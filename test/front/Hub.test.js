// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Hub from '../../src/pages/Hub/Hub.js';
import { getRole, getToken, setSession } from '../../src/lib/api.js';
import { makeVm } from './vm.js';

beforeEach(() => {
  localStorage.clear();
});

describe('Hub', () => {
  it('expõe os três blocos base para usuário comum', () => {
    setSession({ token: 't', role: 'user', name: 'Ela' });
    const { tiles } = makeVm(Hub);
    expect(tiles.map((t) => t.label)).toEqual(['Treino', 'Medidas', 'Helake']);
  });

  it('aponta cada bloco para o destino correto', () => {
    setSession({ token: 't', role: 'user', name: '' });
    const { tiles } = makeVm(Hub);
    const destinos = Object.fromEntries(tiles.map((t) => [t.label, t.to]));
    expect(destinos).toMatchObject({
      Treino: '/treino',
      Medidas: '/medidas',
      Helake: '/helake',
    });
  });

  it('não mostra Configurações para usuário comum', () => {
    setSession({ token: 't', role: 'user', name: '' });
    expect(makeVm(Hub).tiles.map((t) => t.to)).not.toContain('/settings');
  });

  it('mostra Configurações para admin', () => {
    setSession({ token: 't', role: 'admin', name: 'Pedro' });
    const { tiles } = makeVm(Hub);
    expect(tiles.map((t) => t.to)).toContain('/settings');
    expect(tiles).toHaveLength(4);
  });

  it('mostra o nome do usuário da sessão', () => {
    setSession({ token: 't', role: 'user', name: 'Pedro' });
    expect(makeVm(Hub).userName).toBe('Pedro');
  });

  it('não quebra sem nome na sessão', () => {
    setSession({ token: 't', role: 'user', name: '' });
    expect(makeVm(Hub).userName).toBe('');
  });

  it('logout limpa a sessão e vai para /login', () => {
    setSession({ token: 't', role: 'admin', name: 'Pedro' });
    const push = vi.fn();
    const vm = makeVm(Hub, { $router: { push } });

    vm.logout();

    expect(getToken()).toBeNull();
    expect(getRole()).toBeNull();
    expect(push).toHaveBeenCalledWith('/login');
  });

  it('todo bloco tem ícone', () => {
    setSession({ token: 't', role: 'admin', name: '' });
    for (const tile of makeVm(Hub).tiles) {
      expect(tile.icon).toBeTruthy();
    }
  });
});
