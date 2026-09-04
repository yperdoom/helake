// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import router from '../../src/router.js';

const CASES = [
  ['/login', 'Login'],
  ['/', 'Hub'],
  ['/exercises', 'Exercises'],
  ['/workouts', 'Routines'],
  ['/workouts/r1/log', 'Workout'],
  ['/measurements', 'Measurements'],
  ['/settings', 'AppSettings'],
  ['/helake', 'Dashboard'],
  ['/helake/orders', 'Orders'],
  ['/helake/recipes', 'Recipes'],
  ['/helake/customers', 'Customers'],
  ['/helake/ingredients', 'Ingredients'],
  ['/helake/settings', 'HelakeSettings'],
];

describe('routes', () => {
  it.each(CASES)('%s resolves to %s', (path, name) => {
    expect(router.resolve(path).name).toBe(name);
  });

  it('marks /settings as an admin route', () => {
    expect(router.resolve('/settings').meta.requiresAdmin).toBe(true);
  });

  it('does not mark the Yper routes as admin', () => {
    for (const path of ['/', '/workouts', '/measurements', '/exercises']) {
      expect(router.resolve(path).meta.requiresAdmin).toBeUndefined();
    }
  });

  it('no longer exposes the old Helake routes at the root', () => {
    for (const old of ['/orders', '/recipes', '/customers', '/ingredients', '/home']) {
      expect(router.resolve(old).matched).toHaveLength(0);
    }
  });
});
