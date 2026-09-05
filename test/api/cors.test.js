import { afterEach, describe, expect, it, vi } from 'vitest';
import { applyCors } from '../../api/_lib/cors.js';

function mockRes() {
  return {
    statusCode: null,
    headers: {},
    ended: false,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    end() { this.ended = true; return this; },
  };
}

afterEach(() => {
  delete process.env.APP_ORIGIN;
});

describe('applyCors', () => {
  it('handles the preflight: returns true, 200 and ends', () => {
    const res = mockRes();
    const handled = applyCors({ method: 'OPTIONS' }, res, ['GET']);
    expect(handled).toBe(true);
    expect(res.statusCode).toBe(200);
    expect(res.ended).toBe(true);
  });

  it('returns false for a regular method', () => {
    const res = mockRes();
    expect(applyCors({ method: 'GET' }, res, ['GET'])).toBe(false);
  });

  it('declares the given methods plus OPTIONS', () => {
    const res = mockRes();
    applyCors({ method: 'GET' }, res, ['PUT', 'DELETE']);
    expect(res.headers['Access-Control-Allow-Methods']).toBe('PUT, DELETE, OPTIONS');
  });

  it('allows the Authorization header', () => {
    const res = mockRes();
    applyCors({ method: 'GET' }, res, ['GET']);
    expect(res.headers['Access-Control-Allow-Headers']).toContain('Authorization');
  });

  it('echoes APP_ORIGIN when configured', () => {
    process.env.APP_ORIGIN = 'https://helake.vercel.app';
    const res = mockRes();
    applyCors({ method: 'GET' }, res, ['GET']);
    expect(res.headers['Access-Control-Allow-Origin']).toBe('https://helake.vercel.app');
  });

  it('allows no origin at all without APP_ORIGIN', () => {
    const res = mockRes();
    applyCors({ method: 'GET' }, res, ['GET']);
    expect(res.headers['Access-Control-Allow-Origin']).toBeUndefined();
  });
});
