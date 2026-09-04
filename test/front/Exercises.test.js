// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { jsonResponse, makeVm } from './vm.js';

vi.mock('@/lib/api.js', () => ({ apiFetch: vi.fn() }));

const { default: Exercises } = await import('../../src/pages/Exercises/Exercises.js');
const { apiFetch } = await import('@/lib/api.js');

const CATALOG = [
  { _id: 'e1', name: 'Supino', muscleGroup: 'Peito', notes: '' },
  { _id: 'e2', name: 'Agachamento', muscleGroup: 'Perna', notes: '' },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Exercises', () => {
  it('carrega o catálogo', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ exercises: CATALOG }));
    const vm = makeVm(Exercises);
    await vm.load();

    expect(apiFetch).toHaveBeenCalledWith('/api/exercises');
    expect(vm.exercises).toHaveLength(2);
    expect(vm.loading).toBe(false);
  });

  it('guarda mensagem de erro sem lançar quando a rede falha', async () => {
    apiFetch.mockRejectedValue(new Error('offline'));
    const vm = makeVm(Exercises);
    await expect(vm.load()).resolves.toBeUndefined();

    expect(vm.error).toBeTruthy();
    expect(vm.loading).toBe(false);
  });

  it('cria via POST quando não está editando', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ exercises: [] }));
    const vm = makeVm(Exercises);
    vm.form.name = 'Remada';
    vm.form.muscleGroup = 'Costas';
    await vm.save();

    const [path, options] = apiFetch.mock.calls[0];
    expect(path).toBe('/api/exercises');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toMatchObject({ name: 'Remada', muscleGroup: 'Costas' });
  });

  it('atualiza via PUT quando está editando', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ exercises: [] }));
    const vm = makeVm(Exercises);
    vm.edit(CATALOG[0]);
    vm.form.name = 'Supino inclinado';
    await vm.save();

    const [path, options] = apiFetch.mock.calls[0];
    expect(path).toBe('/api/exercises/e1');
    expect(options.method).toBe('PUT');
  });

  it('edit preenche o formulário com o exercício', () => {
    const vm = makeVm(Exercises);
    vm.edit(CATALOG[1]);
    expect(vm.editingId).toBe('e2');
    expect(vm.form.name).toBe('Agachamento');
  });

  it('não salva com nome vazio', async () => {
    const vm = makeVm(Exercises);
    vm.form.name = '   ';
    await vm.save();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('recarrega e limpa o formulário depois de salvar', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ exercises: CATALOG }));
    const vm = makeVm(Exercises);
    vm.form.name = 'Remada';
    await vm.save();

    expect(apiFetch).toHaveBeenCalledTimes(2);
    expect(apiFetch.mock.calls[1][0]).toBe('/api/exercises');
    expect(vm.form.name).toBe('');
    expect(vm.editingId).toBeNull();
  });

  it('remove via DELETE e recarrega', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ exercises: [] }));
    const vm = makeVm(Exercises);
    await vm.remove('e1');

    expect(apiFetch.mock.calls[0]).toEqual(['/api/exercises/e1', { method: 'DELETE' }]);
    expect(apiFetch).toHaveBeenCalledTimes(2);
  });
});
