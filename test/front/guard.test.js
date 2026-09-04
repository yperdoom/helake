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

describe('authGuard com requiresAdmin', () => {
  const rotaAdmin = { path: '/settings', fullPath: '/settings', meta: { requiresAdmin: true } };

  it('manda usuário comum de volta para o hub', () => {
    setSession({ token: 't', role: 'user', name: '' });
    expect(authGuard(rotaAdmin)).toBe('/');
  });

  it('libera admin', () => {
    setSession({ token: 't', role: 'admin', name: '' });
    expect(authGuard(rotaAdmin)).toBe(true);
  });

  it('sem token vai para /login, não para o hub', () => {
    expect(authGuard(rotaAdmin)).toMatchObject({ path: '/login' });
  });

  it('rota sem meta não exige admin', () => {
    setSession({ token: 't', role: 'user', name: '' });
    expect(authGuard({ path: '/treino', fullPath: '/treino' })).toBe(true);
  });

  it('meta sem requiresAdmin não exige admin', () => {
    setSession({ token: 't', role: 'user', name: '' });
    expect(authGuard({ path: '/treino', fullPath: '/treino', meta: {} })).toBe(true);
  });
});
