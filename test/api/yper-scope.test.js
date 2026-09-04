import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { globSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

// Public by definition. `setup.js` guards itself with countDocuments() > 0 -> 403.
const PUBLIC = new Set([
  'api/auth/login.js',
  'api/auth/setup.js',
]);

// Endpoints that, by design decision, do NOT filter by owner.
// Adding something here must be a deliberate decision.
const UNSCOPED = new Set([
  // Helake is single-tenant: both users share the same data.
  'api/customers.js', 'api/customers/[id].js',
  'api/dashboard.js',
  'api/ingredients.js', 'api/ingredients/[id].js',
  'api/orders.js', 'api/orders/[id].js',
  'api/recipes.js', 'api/recipes/[id].js',
  'api/settings.js',
  // The exercise catalog is shared between both users.
  'api/exercises.js', 'api/exercises/[id].js',
  // User management is global and admin-only, not scoped by owner.
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

describe('endpoint sweep', () => {
  it('finds the owned Yper endpoints', () => {
    expect(scoped).toEqual(expect.arrayContaining([
      'api/routines.js', 'api/routines/[id].js',
      'api/workout-logs.js', 'api/workout-logs/[id].js',
      'api/measurements.js', 'api/measurements/[id].js',
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
