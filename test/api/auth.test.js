import { beforeEach, describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { requireAuth, signToken, verifyToken } from '../../api/_lib/auth.js';

function mockRes() {
  return {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
}

describe('signToken / verifyToken', () => {
  it('round-trips preserving the payload', () => {
    const token = signToken({ userId: '1', email: 'a@b.com', role: 'admin' });
    const decoded = verifyToken(token);
    expect(decoded).toMatchObject({ userId: '1', email: 'a@b.com', role: 'admin' });
  });

  it('throws for an invalid token', () => {
    expect(() => verifyToken('not-a-token')).toThrow();
  });

  it('throws for a token signed with another secret', () => {
    const foreign = jwt.sign({ userId: '1' }, 'outro-segredo');
    expect(() => verifyToken(foreign)).toThrow();
  });
});

describe('JWT_SECRET', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('throws on import when the env is missing', async () => {
    const original = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    try {
      await expect(import('../../api/_lib/auth.js?missing')).rejects.toThrow(/JWT_SECRET/);
    } finally {
      process.env.JWT_SECRET = original;
    }
  });
});

describe('requireAuth', () => {
  it('returns 401 and null without a header', () => {
    const res = mockRes();
    const result = requireAuth({ headers: {} }, res);
    expect(result).toBeNull();
    expect(res.statusCode).toBe(401);
  });

  it('returns 401 and null with an invalid token', () => {
    const res = mockRes();
    const result = requireAuth({ headers: { authorization: 'Bearer lixo' } }, res);
    expect(result).toBeNull();
    expect(res.statusCode).toBe(401);
  });

  it('returns the payload with a valid Bearer', () => {
    const token = signToken({ userId: '1', email: 'a@b.com', role: 'user' });
    const res = mockRes();
    const result = requireAuth({ headers: { authorization: `Bearer ${token}` } }, res);
    expect(result).toMatchObject({ userId: '1', role: 'user' });
    expect(res.statusCode).toBeNull();
  });
});
