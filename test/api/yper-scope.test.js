import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { globSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

// Endpoints públicos por definição. `setup.js` se protege sozinho com
// countDocuments() > 0 -> 403.
const PUBLIC = new Set([
  'api/auth/login.js',
  'api/auth/setup.js',
]);

// Endpoints que, por decisão de design, NÃO filtram por dono.
// Adicionar algo aqui tem que ser uma decisão consciente.
const UNSCOPED = new Set([
  // Helake é single-tenant: os dois usuários compartilham os dados.
  'api/customers.js', 'api/customers/[id].js',
  'api/dashboard.js',
  'api/ingredients.js', 'api/ingredients/[id].js',
  'api/orders.js', 'api/orders/[id].js',
  'api/recipes.js', 'api/recipes/[id].js',
  'api/settings.js',
  // Catálogo de exercícios é compartilhado entre os dois usuários.
  'api/exercises.js', 'api/exercises/[id].js',
  // Gestão de usuários é global e restrita a admin, não escopada por dono.
  'api/users.js', 'api/users/[id].js',
  ...PUBLIC,
]);

function endpoints() {
  return globSync('api/**/*.js', { cwd: root })
    .filter((f) => !f.startsWith('api/lib/'))
    .map((f) => f.split('\\').join('/'));
}

const all = endpoints();
const protected_ = all.filter((f) => !PUBLIC.has(f));
const scoped = all.filter((f) => !UNSCOPED.has(f));

describe('varredura de endpoints', () => {
  it('encontra os endpoints do Yper com dono', () => {
    expect(scoped).toEqual(expect.arrayContaining([
      'api/routines.js', 'api/routines/[id].js',
      'api/workout-logs.js', 'api/workout-logs/[id].js',
      'api/measurements.js', 'api/measurements/[id].js',
    ]));
  });

  it('nenhuma entrada morta nas allowlists', () => {
    const existing = new Set(all);
    for (const f of [...UNSCOPED, ...PUBLIC]) {
      expect(existing.has(f), `${f} está na allowlist mas não existe mais`).toBe(true);
    }
  });
});

// Vale para TODO endpoint não público, incluindo os do Helake.
describe.each(protected_)('%s exige identidade', (file) => {
  const source = readFileSync(join(root, file), 'utf8');

  it('chama requireAuth ou requireAdmin', () => {
    expect(/require(Auth|Admin)\s*\(/.test(source)).toBe(true);
  });
});

describe.each(scoped)('%s filtra por dono', (file) => {
  const source = readFileSync(join(root, file), 'utf8');

  it('usa scopedFilter', () => {
    expect(source).toContain('scopedFilter');
  });

  it('não repassa req.body cru para o banco', () => {
    const forwardsRawBody = /(?:create|findOneAndUpdate)\([^)]*\breq\.body\b/s.test(source);
    expect(forwardsRawBody).toBe(false);
  });
});
