import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { globSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

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
  // Públicos por definição.
  'api/auth/login.js', 'api/auth/setup.js',
]);

function endpoints() {
  return globSync('api/**/*.js', { cwd: root })
    .filter((f) => !f.startsWith('api/lib/'))
    .map((f) => f.split('\\').join('/'));
}

const scoped = endpoints().filter((f) => !UNSCOPED.has(f));

describe('varredura de endpoints', () => {
  it('encontra os endpoints do Yper com dono', () => {
    expect(scoped).toEqual(expect.arrayContaining([
      'api/routines.js', 'api/routines/[id].js',
      'api/workout-logs.js', 'api/workout-logs/[id].js',
      'api/measurements.js', 'api/measurements/[id].js',
    ]));
  });

  it('toda a allowlist ainda existe (sem entrada morta)', () => {
    const all = new Set(endpoints());
    for (const f of UNSCOPED) {
      expect(all.has(f), `${f} está na allowlist mas não existe mais`).toBe(true);
    }
  });
});

describe.each(scoped)('%s', (file) => {
  const source = readFileSync(join(root, file), 'utf8');

  it('exige autenticação', () => {
    expect(source).toContain('requireAuth');
  });

  it('filtra por dono com scopedFilter', () => {
    expect(source).toContain('scopedFilter');
  });

  it('não repassa req.body cru para o banco', () => {
    const forwardsRawBody = /(?:create|findOneAndUpdate)\([^)]*\breq\.body\b/s.test(source);
    expect(forwardsRawBody).toBe(false);
  });
});
