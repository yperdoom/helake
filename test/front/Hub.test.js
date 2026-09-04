// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Hub from '../../src/pages/Hub/Hub.js';
import { getRole, getToken, setSession } from '../../src/lib/api.js';
import { makeVm } from './vm.js';

beforeEach(() => {
  localStorage.clear();
});

describe('Hub', () => {
  it('exposes the three base tiles for a regular user', () => {
    setSession({ token: 't', role: 'user', name: 'Ela' });
    const { tiles } = makeVm(Hub);
    expect(tiles.map((t) => t.label)).toEqual(['Workouts', 'Measurements', 'Helake']);
  });

  it('points each tile at the right destination', () => {
    setSession({ token: 't', role: 'user', name: '' });
    const { tiles } = makeVm(Hub);
    const destinations = Object.fromEntries(tiles.map((t) => [t.label, t.to]));
    expect(destinations).toMatchObject({
      Workouts: '/workouts',
      Measurements: '/measurements',
      Helake: '/helake',
    });
  });

  it('does not show Settings to a regular user', () => {
    setSession({ token: 't', role: 'user', name: '' });
    expect(makeVm(Hub).tiles.map((t) => t.to)).not.toContain('/settings');
  });

  it('shows Settings to an admin', () => {
    setSession({ token: 't', role: 'admin', name: 'Pedro' });
    const { tiles } = makeVm(Hub);
    expect(tiles.map((t) => t.to)).toContain('/settings');
    expect(tiles).toHaveLength(4);
  });

  it('shows the user name from the session', () => {
    setSession({ token: 't', role: 'user', name: 'Pedro' });
    expect(makeVm(Hub).userName).toBe('Pedro');
  });

  it('does not break without a name in the session', () => {
    setSession({ token: 't', role: 'user', name: '' });
    expect(makeVm(Hub).userName).toBe('');
  });

  it('logout clears the session and goes to /login', () => {
    setSession({ token: 't', role: 'admin', name: 'Pedro' });
    const push = vi.fn();
    const vm = makeVm(Hub, { $router: { push } });

    vm.logout();

    expect(getToken()).toBeNull();
    expect(getRole()).toBeNull();
    expect(push).toHaveBeenCalledWith('/login');
  });

  it('every tile has an icon', () => {
    setSession({ token: 't', role: 'admin', name: '' });
    for (const tile of makeVm(Hub).tiles) {
      expect(tile.icon).toBeTruthy();
    }
  });
});
