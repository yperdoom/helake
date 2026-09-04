import { describe, expect, it, vi } from 'vitest';
import { signToken } from '../../api/lib/auth.js';

const { model } = vi.hoisted(() => {
  function chainable() {
    const promise = Promise.resolve([]);
    const proxy = new Proxy(promise, {
      get(target, prop) {
        if (prop === 'then' || prop === 'catch' || prop === 'finally') {
          return target[prop].bind(target);
        }
        return () => proxy;
      },
    });
    return proxy;
  }

  return {
    model: () => ({
      default: new Proxy({}, { get: () => () => chainable() }),
    }),
  };
});

vi.mock('../../api/lib/db.js', () => ({ connectDB: vi.fn() }));
vi.mock('../../api/lib/models/Customer.js', model);
vi.mock('../../api/lib/models/Ingredient.js', model);
vi.mock('../../api/lib/models/Order.js', model);
vi.mock('../../api/lib/models/Recipe.js', model);
vi.mock('../../api/lib/models/Settings.js', model);
vi.mock('../../api/lib/models/User.js', model);

function mockRes() {
  return {
    statusCode: null,
    body: null,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    end() { return this; },
  };
}

const ENDPOINTS = [
  ['api/customers.js', 'GET', () => import('../../api/customers.js')],
  ['api/dashboard.js', 'GET', () => import('../../api/dashboard.js')],
  ['api/ingredients.js', 'GET', () => import('../../api/ingredients.js')],
  ['api/orders.js', 'GET', () => import('../../api/orders.js')],
  ['api/recipes.js', 'GET', () => import('../../api/recipes.js')],
  ['api/settings.js', 'GET', () => import('../../api/settings.js')],
  ['api/customers/[id].js', 'PUT', () => import('../../api/customers/[id].js')],
  ['api/ingredients/[id].js', 'PUT', () => import('../../api/ingredients/[id].js')],
  ['api/orders/[id].js', 'PUT', () => import('../../api/orders/[id].js')],
  ['api/recipes/[id].js', 'PUT', () => import('../../api/recipes/[id].js')],
];

async function call(load, method, headers) {
  const { default: handler } = await load();
  const res = mockRes();
  const req = { method, headers, query: { id: 'abc' }, body: {} };
  try {
    await handler(req, res);
  } catch {
    // happy path pode falhar com model mockado; aqui só o status importa
  }
  return res;
}

describe.each(ENDPOINTS)('%s', (file, method, load) => {
  it('devolve 401 sem header Authorization', async () => {
    const res = await call(load, method, {});
    expect(res.statusCode).toBe(401);
  });

  it('devolve 401 com token inválido', async () => {
    const res = await call(load, method, { authorization: 'Bearer lixo' });
    expect(res.statusCode).toBe(401);
  });

  it('não devolve 401 com Bearer válido', async () => {
    const token = signToken({ userId: 'u1', email: 'a@b.com', role: 'admin' });
    const res = await call(load, method, { authorization: `Bearer ${token}` });
    expect(res.statusCode).not.toBe(401);
  });
});
