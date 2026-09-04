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
  it('finds the routine by the route id', async () => {
    routeApi();
    const vm = vmFor();
    await vm.load();

    expect(vm.routine.name).toBe('Treino A');
    expect(vm.rows).toHaveLength(2);
  });

  it('makes only two requests, not one per exercise', async () => {
    routeApi();
    const vm = vmFor();
    await vm.load();

    expect(apiFetch).toHaveBeenCalledTimes(2);
  });

  it('uses the most recent load of each exercise', async () => {
    routeApi();
    const vm = vmFor();
    await vm.load();

    const byId = Object.fromEntries(vm.rows.map((r) => [r.exercise, r.lastLoad]));
    expect(byId.e1).toBe(65);
    expect(byId.e2).toBe(75);
  });

  it('leaves lastLoad null for an exercise without history', async () => {
    routeApi({ logs: [] });
    const vm = vmFor();
    await vm.load();

    expect(vm.rows.every((r) => r.lastLoad === null)).toBe(true);
  });

  it('flags an error when the routine does not exist', async () => {
    routeApi();
    const vm = vmFor('inexistente');
    await vm.load();

    expect(vm.routine).toBeNull();
    expect(vm.error).toBeTruthy();
  });

  it('sends only the exercises with a filled load', async () => {
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

  it('sends nothing when no load was filled', async () => {
    routeApi();
    const vm = vmFor();
    await vm.load();
    vi.clearAllMocks();

    await vm.save();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('goes back to the routine list after saving', async () => {
    routeApi();
    const vm = vmFor();
    await vm.load();
    vm.rows[0].load = 70;
    await vm.save();

    expect(push).toHaveBeenCalledWith('/workouts');
  });

  it('does not redirect and shows an error when the POST fails', async () => {
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
