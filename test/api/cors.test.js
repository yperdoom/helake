import { afterEach, describe, expect, it, vi } from 'vitest';
import { applyCors } from '../../api/lib/cors.js';

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
  it('trata o preflight: devolve true, 200 e encerra', () => {
    const res = mockRes();
    const handled = applyCors({ method: 'OPTIONS' }, res, ['GET']);
    expect(handled).toBe(true);
    expect(res.statusCode).toBe(200);
    expect(res.ended).toBe(true);
  });

  it('devolve false para método normal', () => {
    const res = mockRes();
    expect(applyCors({ method: 'GET' }, res, ['GET'])).toBe(false);
  });

  it('declara os métodos recebidos mais OPTIONS', () => {
    const res = mockRes();
    applyCors({ method: 'GET' }, res, ['PUT', 'DELETE']);
    expect(res.headers['Access-Control-Allow-Methods']).toBe('PUT, DELETE, OPTIONS');
  });

  it('permite o header Authorization', () => {
    const res = mockRes();
    applyCors({ method: 'GET' }, res, ['GET']);
    expect(res.headers['Access-Control-Allow-Headers']).toContain('Authorization');
  });

  it('reflete APP_ORIGIN quando configurada', () => {
    process.env.APP_ORIGIN = 'https://helake.vercel.app';
    const res = mockRes();
    applyCors({ method: 'GET' }, res, ['GET']);
    expect(res.headers['Access-Control-Allow-Origin']).toBe('https://helake.vercel.app');
  });

  it('não libera origem nenhuma sem APP_ORIGIN', () => {
    const res = mockRes();
    applyCors({ method: 'GET' }, res, ['GET']);
    expect(res.headers['Access-Control-Allow-Origin']).toBeUndefined();
  });
});
