// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch, clearSession, getRole, getToken, setSession } from '../../src/lib/api.js';

function stubFetch(response) {
  const spy = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', spy);
  return spy;
}

const ok = { status: 200, ok: true };

beforeEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
  vi.stubGlobal('location', { pathname: '/helake', assign: vi.fn() });
});

describe('sessão', () => {
  it('grava e lê token, role e name', () => {
    setSession({ token: 't', role: 'admin', name: 'Pedro' });
    expect(getToken()).toBe('t');
    expect(getRole()).toBe('admin');
  });

  it('clearSession apaga tudo', () => {
    setSession({ token: 't', role: 'admin', name: 'Pedro' });
    clearSession();
    expect(getToken()).toBeNull();
    expect(getRole()).toBeNull();
  });
});

describe('apiFetch', () => {
  it('injeta Authorization quando há token', async () => {
    setSession({ token: 'abc', role: 'user', name: '' });
    const spy = stubFetch(ok);
    await apiFetch('/api/orders');
    expect(spy.mock.calls[0][1].headers.Authorization).toBe('Bearer abc');
  });

  it('não injeta Authorization sem token', async () => {
    const spy = stubFetch(ok);
    await apiFetch('/api/orders');
    expect(spy.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('define Content-Type json quando há body', async () => {
    const spy = stubFetch(ok);
    await apiFetch('/api/orders', { method: 'POST', body: '{}' });
    expect(spy.mock.calls[0][1].headers['Content-Type']).toBe('application/json');
  });

  it('devolve a resposta em caso de sucesso', async () => {
    stubFetch(ok);
    await expect(apiFetch('/api/orders')).resolves.toBe(ok);
  });

  it('em 401 limpa a sessão e redireciona para /login', async () => {
    setSession({ token: 'abc', role: 'user', name: '' });
    stubFetch({ status: 401, ok: false });
    await expect(apiFetch('/api/orders')).rejects.toThrow();
    expect(getToken()).toBeNull();
    expect(location.assign).toHaveBeenCalledWith('/login');
  });

  it('não redireciona em loop se já está em /login', async () => {
    vi.stubGlobal('location', { pathname: '/login', assign: vi.fn() });
    stubFetch({ status: 401, ok: false });
    await expect(apiFetch('/api/auth/login')).rejects.toThrow();
    expect(location.assign).not.toHaveBeenCalled();
  });
});
