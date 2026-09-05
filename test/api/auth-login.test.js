import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../api/_lib/db.js', () => ({ connectDB: vi.fn() }));
vi.mock('../../api/_lib/models/User.js', () => ({
  default: { findOne: vi.fn() },
}));
vi.mock('bcryptjs', () => ({ default: { compare: vi.fn() } }));

const { default: handler } = await import('../../api/_routes/auth/login.js');
const { default: User } = await import('../../api/_lib/models/User.js');
const { default: bcrypt } = await import('bcryptjs');
const { verifyToken } = await import('../../api/_lib/auth.js');

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

const req = (body) => ({ method: 'POST', headers: {}, body });

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('includes role in the JWT payload', async () => {
    User.findOne.mockResolvedValue({ _id: 'u1', email: 'a@b.com', role: 'admin', name: 'Pedro' });
    bcrypt.compare.mockResolvedValue(true);

    const res = mockRes();
    await handler(req({ email: 'a@b.com', password: 'x' }), res);

    expect(res.statusCode).toBe(200);
    expect(verifyToken(res.body.token)).toMatchObject({ userId: 'u1', role: 'admin' });
  });

  it('returns role and name in the response body', async () => {
    User.findOne.mockResolvedValue({ _id: 'u1', email: 'a@b.com', role: 'user', name: 'Namorada' });
    bcrypt.compare.mockResolvedValue(true);

    const res = mockRes();
    await handler(req({ email: 'a@b.com', password: 'x' }), res);

    expect(res.body).toMatchObject({ role: 'user', name: 'Namorada' });
  });

  it('returns 401 with a wrong password', async () => {
    User.findOne.mockResolvedValue({ _id: 'u1', email: 'a@b.com', role: 'user' });
    bcrypt.compare.mockResolvedValue(false);

    const res = mockRes();
    await handler(req({ email: 'a@b.com', password: 'x' }), res);

    expect(res.statusCode).toBe(401);
  });
});
