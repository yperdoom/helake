// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import router from '../../src/router.js';

const CASES = [
  ['/login', 'Login'],
  ['/', 'Hub'],
  ['/helake', 'Dashboard'],
  ['/helake/orders', 'Orders'],
  ['/helake/recipes', 'Recipes'],
  ['/helake/customers', 'Customers'],
  ['/helake/ingredients', 'Ingredients'],
  ['/helake/settings', 'HelakeSettings'],
];

describe('rotas', () => {
  it.each(CASES)('%s resolve para %s', (path, name) => {
    expect(router.resolve(path).name).toBe(name);
  });

  it('não expõe mais as rotas antigas do Helake na raiz', () => {
    for (const old of ['/orders', '/recipes', '/customers', '/ingredients', '/home']) {
      expect(router.resolve(old).matched).toHaveLength(0);
    }
  });
});
