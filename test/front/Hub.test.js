// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import Hub from '../../src/pages/Hub/Hub.js';
import { setSession } from '../../src/lib/api.js';

function vm() {
  const data = Hub.data();
  return {
    ...data,
    userName: Hub.computed.userName.call(data),
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe('Hub', () => {
  it('expõe os três blocos do design', () => {
    const { tiles } = vm();
    expect(tiles.map((t) => t.label)).toEqual(['Treino', 'Medidas', 'Helake']);
  });

  it('aponta cada bloco para o destino correto', () => {
    const { tiles } = vm();
    const destinos = Object.fromEntries(tiles.map((t) => [t.label, t.to]));
    expect(destinos).toEqual({
      Treino: '/treino',
      Medidas: '/medidas',
      Helake: '/helake',
    });
  });

  it('não mostra bloco de configurações, que é da Entrega 4', () => {
    const { tiles } = vm();
    expect(tiles.map((t) => t.to)).not.toContain('/settings');
  });

  it('mostra o nome do usuário da sessão', () => {
    setSession({ token: 't', role: 'user', name: 'Pedro' });
    expect(vm().userName).toBe('Pedro');
  });

  it('não quebra sem nome na sessão', () => {
    setSession({ token: 't', role: 'user', name: '' });
    expect(vm().userName).toBe('');
  });

  it('todo bloco tem ícone', () => {
    const { tiles } = vm();
    for (const tile of tiles) {
      expect(tile.icon).toBeTruthy();
    }
  });
});
