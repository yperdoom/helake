// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { jsonResponse, makeVm } from './vm.js';

vi.mock('@/lib/api.js', () => ({ apiFetch: vi.fn() }));

const { default: Workout } = await import('../../src/pages/Workout/Workout.js');
const { apiFetch } = await import('@/lib/api.js');

const ROUTINE = {
  _id: 'r1',
  name: 'Treino A',
  exercises: [
    { exercise: { _id: 'e1', name: 'Supino' }, targetSets: 4, targetReps: 10, targetLoad: 60, order: 0 },
    { exercise: { _id: 'e2', name: 'Agachamento' }, targetSets: 3, targetReps: 12, targetLoad: 80, order: 1 },
  ],
};

// Ordenado por data decrescente, como a API devolve.
const LOGS = [
  { _id: 'w2', date: '2026-09-02', entries: [{ exercise: { _id: 'e1' }, load: 65 }] },
  { _id: 'w1', date: '2026-08-30', entries: [{ exercise: { _id: 'e1' }, load: 60 }, { exercise: { _id: 'e2' }, load: 75 }] },
];

function routeApi({ routines = [ROUTINE], logs = LOGS } = {}) {
  apiFetch.mockImplementation((path) => {
    if (path === '/api/routines') return Promise.resolve(jsonResponse({ routines }));
    if (path === '/api/workout-logs') return Promise.resolve(jsonResponse({ logs }));
    return Promise.resolve(jsonResponse({}));
  });
}

const push = vi.fn();
const vmFor = (id = 'r1') => makeVm(Workout, {
  $route: { params: { id } },
  $router: { push },
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Workout', () => {
  it('acha a ficha pelo id da rota', async () => {
    routeApi();
    const vm = vmFor();
    await vm.load();

    expect(vm.routine.name).toBe('Treino A');
    expect(vm.rows).toHaveLength(2);
  });

  it('faz só duas requisições, sem uma por exercício', async () => {
    routeApi();
    const vm = vmFor();
    await vm.load();

    expect(apiFetch).toHaveBeenCalledTimes(2);
  });

  it('usa a carga mais recente de cada exercício', async () => {
    routeApi();
    const vm = vmFor();
    await vm.load();

    const byId = Object.fromEntries(vm.rows.map((r) => [r.exercise, r.lastLoad]));
    expect(byId.e1).toBe(65);
    expect(byId.e2).toBe(75);
  });

  it('deixa lastLoad nulo para exercício sem histórico', async () => {
    routeApi({ logs: [] });
    const vm = vmFor();
    await vm.load();

    expect(vm.rows.every((r) => r.lastLoad === null)).toBe(true);
  });

  it('marca erro se a ficha não existe', async () => {
    routeApi();
    const vm = vmFor('inexistente');
    await vm.load();

    expect(vm.routine).toBeNull();
    expect(vm.error).toBeTruthy();
  });

  it('envia só os exercícios com carga preenchida', async () => {
    routeApi();
    const vm = vmFor();
    await vm.load();
    vm.rows[0].load = 70;

    await vm.save();

    const post = apiFetch.mock.calls.find(([, o]) => o?.method === 'POST');
    const body = JSON.parse(post[1].body);
    expect(body.routine).toBe('r1');
    expect(body.entries).toEqual([{ exercise: 'e1', load: 70 }]);
  });

  it('não envia nada se nenhuma carga foi preenchida', async () => {
    routeApi();
    const vm = vmFor();
    await vm.load();
    vi.clearAllMocks();

    await vm.save();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('volta para a lista de fichas depois de salvar', async () => {
    routeApi();
    const vm = vmFor();
    await vm.load();
    vm.rows[0].load = 70;
    await vm.save();

    expect(push).toHaveBeenCalledWith('/treino');
  });

  it('não redireciona e mostra erro se o POST falha', async () => {
    routeApi();
    const vm = vmFor();
    await vm.load();
    vm.rows[0].load = 70;

    apiFetch.mockRejectedValue(new Error('offline'));
    await vm.save();

    expect(vm.error).toBeTruthy();
    expect(push).not.toHaveBeenCalled();
  });
});
