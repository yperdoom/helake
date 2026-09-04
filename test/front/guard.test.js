// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { authGuard } from '../../src/router.js';
import { setSession } from '../../src/lib/api.js';

beforeEach(() => {
  localStorage.clear();
});

describe('authGuard', () => {
  it('sends anyone without a token to /login', () => {
    expect(authGuard({ path: '/helake', fullPath: '/helake' }))
      .toMatchObject({ path: '/login' });
    expect(authGuard({ path: '/helake/orders', fullPath: '/helake/orders' }))
      .toMatchObject({ path: '/login' });
  });

  it('preserves the intended destination when sending to /login', () => {
    expect(authGuard({ path: '/helake', fullPath: '/helake' }))
      .toMatchObject({ query: { redirect: '/helake' } });
  });

  it('does not store the hub as a destination, since it is already the default', () => {
    expect(authGuard({ path: '/', fullPath: '/' }))
      .toMatchObject({ path: '/login', query: {} });
  });

  it('allows anyone with a token', () => {
    setSession({ token: 't', role: 'user', name: '' });
    expect(authGuard({ path: '/helake' })).toBe(true);
    expect(authGuard({ path: '/' })).toBe(true);
  });

  it('allows /login for anyone not authenticated', () => {
    expect(authGuard({ path: '/login' })).toBe(true);
  });

  it('moves anyone already authenticated away from /login', () => {
    setSession({ token: 't', role: 'user', name: '' });
    expect(authGuard({ path: '/login' })).toBe('/');
  });
});

describe('authGuard with requiresAdmin', () => {
  const adminRoute = { path: '/settings', fullPath: '/settings', meta: { requiresAdmin: true } };

  it('sends a regular user back to the hub', () => {
    setSession({ token: 't', role: 'user', name: '' });
    expect(authGuard(adminRoute)).toBe('/');
  });

  it('allows an admin', () => {
    setSession({ token: 't', role: 'admin', name: '' });
    expect(authGuard(adminRoute)).toBe(true);
  });

  it('without a token goes to /login, not to the hub', () => {
    expect(authGuard(adminRoute)).toMatchObject({ path: '/login' });
  });

  it('a route without meta does not require admin', () => {
    setSession({ token: 't', role: 'user', name: '' });
    expect(authGuard({ path: '/workouts', fullPath: '/workouts' })).toBe(true);
  });

  it('meta without requiresAdmin does not require admin', () => {
    setSession({ token: 't', role: 'user', name: '' });
    expect(authGuard({ path: '/workouts', fullPath: '/workouts', meta: {} })).toBe(true);
  });
});
