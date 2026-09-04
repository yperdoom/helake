import { beforeEach, describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { requireAuth, signToken, verifyToken } from '../../api/lib/auth.js';

function mockRes() {
  return {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
}

describe('signToken / verifyToken', () => {
  it('faz roundtrip preservando o payload', () => {
    const token = signToken({ userId: '1', email: 'a@b.com', role: 'admin' });
    const decoded = verifyToken(token);
    expect(decoded).toMatchObject({ userId: '1', email: 'a@b.com', role: 'admin' });
  });

  it('lança para token inválido', () => {
    expect(() => verifyToken('not-a-token')).toThrow();
  });

  it('lança para token assinado com outro segredo', () => {
    const foreign = jwt.sign({ userId: '1' }, 'outro-segredo');
    expect(() => verifyToken(foreign)).toThrow();
  });
});

describe('JWT_SECRET', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('lança na importação se a env não existe', async () => {
    const original = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    try {
      await expect(import('../../api/lib/auth.js?missing')).rejects.toThrow(/JWT_SECRET/);
    } finally {
      process.env.JWT_SECRET = original;
    }
  });
});

describe('requireAuth', () => {
  it('devolve 401 e null sem header', () => {
    const res = mockRes();
    const result = requireAuth({ headers: {} }, res);
    expect(result).toBeNull();
    expect(res.statusCode).toBe(401);
  });

  it('devolve 401 e null com token inválido', () => {
    const res = mockRes();
    const result = requireAuth({ headers: { authorization: 'Bearer lixo' } }, res);
    expect(result).toBeNull();
    expect(res.statusCode).toBe(401);
  });

  it('devolve o payload com Bearer válido', () => {
    const token = signToken({ userId: '1', email: 'a@b.com', role: 'user' });
    const res = mockRes();
    const result = requireAuth({ headers: { authorization: `Bearer ${token}` } }, res);
    expect(result).toMatchObject({ userId: '1', role: 'user' });
    expect(res.statusCode).toBeNull();
  });
});
