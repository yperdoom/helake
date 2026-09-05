import { describe, expect, it, vi } from 'vitest';
import { mockRes } from '../helpers.js';

vi.mock('../../api/_routes/customers.js', () => ({
  default: vi.fn((req, res) => res.status(200).json({ handler: 'customers' })),
}));
vi.mock('../../api/_routes/customers/[id].js', () => ({
  default: vi.fn((req, res) => res.status(200).json({ handler: 'customers/[id]', id: req.query.id })),
}));
vi.mock('../../api/_routes/auth/login.js', () => ({
  default: vi.fn((req, res) => res.status(200).json({ handler: 'auth/login' })),
}));
vi.mock('../../api/_routes/auth/setup.js', () => ({
  default: vi.fn((req, res) => res.status(200).json({ handler: 'auth/setup' })),
}));

const { default: router } = await import('../../api/[...path].js');
const { default: customers } = await import('../../api/_routes/customers.js');

describe('api/[...path] router', () => {
  it('dispatches a single-segment path to its list handler', async () => {
    const res = mockRes();
    await router({ method: 'GET', query: { path: ['customers'] }, headers: {} }, res);

    expect(customers).toHaveBeenCalled();
    expect(res.body.handler).toBe('customers');
  });

  it('dispatches a two-segment entity/:id path, injecting query.id', async () => {
    const res = mockRes();
    const req = { method: 'PUT', query: { path: ['customers', '123'] }, headers: {} };
    await router(req, res);

    expect(req.query.id).toBe('123');
    expect(res.body).toEqual({ handler: 'customers/[id]', id: '123' });
  });

  it('dispatches fixed two-segment auth routes', async () => {
    const res = mockRes();
    await router({ method: 'POST', query: { path: ['auth', 'login'] }, headers: {} }, res);
    expect(res.body.handler).toBe('auth/login');

    const res2 = mockRes();
    await router({ method: 'POST', query: { path: ['auth', 'setup'] }, headers: {} }, res2);
    expect(res2.body.handler).toBe('auth/setup');
  });

  it('returns 404 for an unknown path', async () => {
    const res = mockRes();
    await router({ method: 'GET', query: { path: ['nope'] }, headers: {} }, res);
    expect(res.statusCode).toBe(404);
  });
});
