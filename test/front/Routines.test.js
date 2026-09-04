// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { jsonResponse, makeVm } from './vm.js';

vi.mock('@/lib/api.js', () => ({ apiFetch: vi.fn() }));

const { default: Routines } = await import('../../src/pages/Routines/Routines.js');
const { apiFetch } = await import('@/lib/api.js');

const CATALOG = [
  { _id: 'e1', name: 'Supino', muscleGroup: 'Peito' },
  { _id: 'e2', name: 'Agachamento', muscleGroup: 'Perna' },
];

// Como a API popula exercises.exercise, a ficha volta com objeto, não com id.
const ROUTINE = {
  _id: 'r1',
  name: 'Treino A',
  exercises: [
    { exercise: { _id: 'e1', name: 'Supino' }, targetSets: 4, targetReps: 10, targetLoad: 60, order: 0 },
    { exercise: { _id: 'e2', name: 'Agachamento' }, targetSets: 3, targetReps: 12, targetLoad: 80, order: 1 },
  ],
};

function routeApi({ routines = [ROUTINE], exercises = CATALOG } = {}) {
  apiFetch.mockImplementation((path) => {
    if (path === '/api/routines') return Promise.resolve(jsonResponse({ routines }));
    if (path === '/api/exercises') return Promise.resolve(jsonResponse({ exercises }));
    return Promise.resolve(jsonResponse({}));
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Routines', () => {
  it('carrega fichas e catálogo', async () => {
    routeApi();
    const vm = makeVm(Routines);
    await vm.load();

    const paths = apiFetch.mock.calls.map(([p]) => p);
    expect(paths).toContain('/api/routines');
    expect(paths).toContain('/api/exercises');
    expect(vm.routines).toHaveLength(1);
    expect(vm.catalog).toHaveLength(2);
  });

  it('não quebra quando a rede falha', async () => {
    apiFetch.mockRejectedValue(new Error('offline'));
    const vm = makeVm(Routines);
    await expect(vm.load()).resolves.toBeUndefined();
    expect(vm.error).toBeTruthy();
  });

  it('adiciona exercício à ficha em edição', () => {
    const vm = makeVm(Routines);
    vm.addExercise('e1');
    vm.addExercise('e2');
    expect(vm.form.exercises.map((e) => e.exercise)).toEqual(['e1', 'e2']);
  });

  it('remove exercício por posição', () => {
    const vm = makeVm(Routines);
    vm.addExercise('e1');
    vm.addExercise('e2');
    vm.removeExercise(0);
    expect(vm.form.exercises.map((e) => e.exercise)).toEqual(['e2']);
  });

  it('normaliza o exercício populado para id ao editar', () => {
    const vm = makeVm(Routines);
    vm.edit(ROUTINE);

    expect(vm.editingId).toBe('r1');
    expect(vm.form.name).toBe('Treino A');
    expect(vm.form.exercises.map((e) => e.exercise)).toEqual(['e1', 'e2']);
  });

  it('grava a ordem a partir da posição na lista', async () => {
    routeApi();
    const vm = makeVm(Routines);
    vm.form.name = 'Treino B';
    vm.addExercise('e2');
    vm.addExercise('e1');
    await vm.save();

    const [, options] = apiFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.exercises).toEqual([
      expect.objectContaining({ exercise: 'e2', order: 0 }),
      expect.objectContaining({ exercise: 'e1', order: 1 }),
    ]);
  });

  it('cria via POST e atualiza via PUT', async () => {
    routeApi();
    const vm = makeVm(Routines);

    vm.form.name = 'Nova';
    await vm.save();
    expect(apiFetch.mock.calls[0][0]).toBe('/api/routines');
    expect(apiFetch.mock.calls[0][1].method).toBe('POST');

    vi.clearAllMocks();
    routeApi();
    vm.edit(ROUTINE);
    await vm.save();
    expect(apiFetch.mock.calls[0][0]).toBe('/api/routines/r1');
    expect(apiFetch.mock.calls[0][1].method).toBe('PUT');
  });

  it('não salva ficha sem nome', async () => {
    const vm = makeVm(Routines);
    vm.form.name = '  ';
    await vm.save();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('remove ficha e recarrega', async () => {
    routeApi();
    const vm = makeVm(Routines);
    await vm.remove('r1');

    expect(apiFetch.mock.calls[0]).toEqual(['/api/routines/r1', { method: 'DELETE' }]);
    expect(apiFetch.mock.calls.map(([p]) => p)).toContain('/api/routines');
  });

  it('limpa o formulário depois de salvar', async () => {
    routeApi();
    const vm = makeVm(Routines);
    vm.form.name = 'Nova';
    vm.addExercise('e1');
    await vm.save();

    expect(vm.form.name).toBe('');
    expect(vm.form.exercises).toHaveLength(0);
    expect(vm.editingId).toBeNull();
  });
});
