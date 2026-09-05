import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { globSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

// Public by definition. `setup.js` guards itself with countDocuments() > 0 -> 403.
const PUBLIC = new Set([
  'api/_routes/auth/login.js',
  'api/_routes/auth/setup.js',
]);

// Endpoints that, by design decision, do NOT filter by owner.
// Adding something here must be a deliberate decision.
const UNSCOPED = new Set([
  // Helake is single-tenant: both users share the same data.
  'api/_routes/customers.js', 'api/_routes/customers/[id].js',
  'api/_routes/dashboard.js',
  'api/_routes/ingredients.js', 'api/_routes/ingredients/[id].js',
  'api/_routes/orders.js', 'api/_routes/orders/[id].js',
  'api/_routes/recipes.js', 'api/_routes/recipes/[id].js',
  'api/_routes/settings.js',
  // The exercise catalog is shared between both users.
  'api/_routes/exercises.js', 'api/_routes/exercises/[id].js',
  // User management is global and admin-only, not scoped by owner.
  'api/_routes/users.js', 'api/_routes/users/[id].js',
  ...PUBLIC,
]);

function endpoints() {
  return globSync('api/**/*.js', { cwd: root })
    .filter((f) => !f.startsWith('api/_lib/') && f !== 'api/[...path].js')
    .map((f) => f.split('\\').join('/'));
}

const all = endpoints();
const protected_ = all.filter((f) => !PUBLIC.has(f));
const scoped = all.filter((f) => !UNSCOPED.has(f));

describe('endpoint sweep', () => {
  it('finds the owned Yper endpoints', () => {
    expect(scoped).toEqual(expect.arrayContaining([
      'api/_routes/routines.js', 'api/_routes/routines/[id].js',
      'api/_routes/workout-logs.js', 'api/_routes/workout-logs/[id].js',
      'api/_routes/measurements.js', 'api/_routes/measurements/[id].js',
    ]));
  });

  it('no dead entries in the allowlists', () => {
    const existing = new Set(all);
    for (const f of [...UNSCOPED, ...PUBLIC]) {
      expect(existing.has(f), `${f} is in the allowlist but no longer exists`).toBe(true);
    }
  });
});

// Applies to EVERY non-public endpoint, including Helake's.
describe.each(protected_)('%s requires identity', (file) => {
  const source = readFileSync(join(root, file), 'utf8');

  it('calls requireAuth or requireAdmin', () => {
    expect(/require(Auth|Admin)\s*\(/.test(source)).toBe(true);
  });
});

describe.each(scoped)('%s filters by owner', (file) => {
  const source = readFileSync(join(root, file), 'utf8');

  it('uses scopedFilter', () => {
    expect(source).toContain('scopedFilter');
  });

  it('does not forward raw req.body to the database', () => {
    const forwardsRawBody = /(?:create|findOneAndUpdate)\([^)]*\breq\.body\b/s.test(source);
    expect(forwardsRawBody).toBe(false);
  });
});
