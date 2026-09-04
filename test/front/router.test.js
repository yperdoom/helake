// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import router from '../../src/router.js';

const CASES = [
  ['/login', 'Login'],
  ['/', 'Hub'],
  ['/exercicios', 'Exercises'],
  ['/treino', 'Routines'],
  ['/treino/r1/registro', 'Workout'],
  ['/medidas', 'Measurements'],
  ['/settings', 'AppSettings'],
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

  it('marca /settings como rota de admin', () => {
    expect(router.resolve('/settings').meta.requiresAdmin).toBe(true);
  });

  it('não marca as rotas do Yper como admin', () => {
    for (const path of ['/', '/treino', '/medidas', '/exercicios']) {
      expect(router.resolve(path).meta.requiresAdmin).toBeUndefined();
    }
  });

  it('não expõe mais as rotas antigas do Helake na raiz', () => {
    for (const old of ['/orders', '/recipes', '/customers', '/ingredients', '/home']) {
      expect(router.resolve(old).matched).toHaveLength(0);
    }
  });
});
