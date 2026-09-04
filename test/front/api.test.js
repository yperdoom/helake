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

describe('session', () => {
  it('stores and reads token, role and name', () => {
    setSession({ token: 't', role: 'admin', name: 'Pedro' });
    expect(getToken()).toBe('t');
    expect(getRole()).toBe('admin');
  });

  it('clearSession wipes everything', () => {
    setSession({ token: 't', role: 'admin', name: 'Pedro' });
    clearSession();
    expect(getToken()).toBeNull();
    expect(getRole()).toBeNull();
  });
});

describe('apiFetch', () => {
  it('injects Authorization when a token exists', async () => {
    setSession({ token: 'abc', role: 'user', name: '' });
    const spy = stubFetch(ok);
    await apiFetch('/api/orders');
    expect(spy.mock.calls[0][1].headers.Authorization).toBe('Bearer abc');
  });

  it('does not inject Authorization without a token', async () => {
    const spy = stubFetch(ok);
    await apiFetch('/api/orders');
    expect(spy.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('sets Content-Type json when there is a body', async () => {
    const spy = stubFetch(ok);
    await apiFetch('/api/orders', { method: 'POST', body: '{}' });
    expect(spy.mock.calls[0][1].headers['Content-Type']).toBe('application/json');
  });

  it('returns the response on success', async () => {
    stubFetch(ok);
    await expect(apiFetch('/api/orders')).resolves.toBe(ok);
  });

  it('on 401 clears the session and redirects to /login', async () => {
    setSession({ token: 'abc', role: 'user', name: '' });
    stubFetch({ status: 401, ok: false });
    await expect(apiFetch('/api/orders')).rejects.toThrow();
    expect(getToken()).toBeNull();
    expect(location.assign).toHaveBeenCalledWith('/login');
  });

  it('throws with the server message when the response is not ok', async () => {
    stubFetch({
      status: 400,
      ok: false,
      json: () => Promise.resolve({ error: 'Cannot delete the last admin' }),
    });

    await expect(apiFetch('/api/users/u1', { method: 'DELETE' }))
      .rejects.toThrow('Cannot delete the last admin');
  });

  it('exposes the status on the error', async () => {
    stubFetch({ status: 409, ok: false, json: () => Promise.resolve({ error: 'duplicado' }) });

    await expect(apiFetch('/api/users', { method: 'POST' }))
      .rejects.toMatchObject({ status: 409 });
  });

  it('throws even without a JSON body on the error', async () => {
    stubFetch({ status: 500, ok: false, json: () => Promise.reject(new Error('sem corpo')) });

    await expect(apiFetch('/api/users')).rejects.toThrow(/500/);
  });

  it('does not loop redirecting when already at /login', async () => {
    vi.stubGlobal('location', { pathname: '/login', assign: vi.fn() });
    stubFetch({ status: 401, ok: false });
    await expect(apiFetch('/api/auth/login')).rejects.toThrow();
    expect(location.assign).not.toHaveBeenCalled();
  });
});
