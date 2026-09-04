// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { authGuard } from '../../src/router.js';
import { setSession } from '../../src/lib/api.js';

beforeEach(() => {
  localStorage.clear();
});

describe('authGuard', () => {
  it('manda para /login quem não tem token', () => {
    expect(authGuard({ path: '/helake', fullPath: '/helake' }))
      .toMatchObject({ path: '/login' });
    expect(authGuard({ path: '/helake/orders', fullPath: '/helake/orders' }))
      .toMatchObject({ path: '/login' });
  });

  it('preserva o destino pretendido ao mandar para /login', () => {
    expect(authGuard({ path: '/helake', fullPath: '/helake' }))
      .toMatchObject({ query: { redirect: '/helake' } });
  });

  it('não guarda o hub como destino, que já é o default', () => {
    expect(authGuard({ path: '/', fullPath: '/' }))
      .toMatchObject({ path: '/login', query: {} });
  });

  it('libera quem tem token', () => {
    setSession({ token: 't', role: 'user', name: '' });
    expect(authGuard({ path: '/helake' })).toBe(true);
    expect(authGuard({ path: '/' })).toBe(true);
  });

  it('libera /login para quem não está autenticado', () => {
    expect(authGuard({ path: '/login' })).toBe(true);
  });

  it('tira de /login quem já está autenticado', () => {
    setSession({ token: 't', role: 'user', name: '' });
    expect(authGuard({ path: '/login' })).toBe('/');
  });
});
