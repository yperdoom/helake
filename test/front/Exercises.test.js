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
  it('loads the catalog', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ exercises: CATALOG }));
    const vm = makeVm(Exercises);
    await vm.load();

    expect(apiFetch).toHaveBeenCalledWith('/api/exercises');
    expect(vm.exercises).toHaveLength(2);
    expect(vm.loading).toBe(false);
  });

  it('stores an error message without throwing when the network fails', async () => {
    apiFetch.mockRejectedValue(new Error('offline'));
    const vm = makeVm(Exercises);
    await expect(vm.load()).resolves.toBeUndefined();

    expect(vm.error).toBeTruthy();
    expect(vm.loading).toBe(false);
  });

  it('creates via POST when not editing', async () => {
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

  it('updates via PUT when editing', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ exercises: [] }));
    const vm = makeVm(Exercises);
    vm.edit(CATALOG[0]);
    vm.form.name = 'Supino inclinado';
    await vm.save();

    const [path, options] = apiFetch.mock.calls[0];
    expect(path).toBe('/api/exercises/e1');
    expect(options.method).toBe('PUT');
  });

  it('edit fills the form with the exercise', () => {
    const vm = makeVm(Exercises);
    vm.edit(CATALOG[1]);
    expect(vm.editingId).toBe('e2');
    expect(vm.form.name).toBe('Agachamento');
  });

  it('does not save with an empty name', async () => {
    const vm = makeVm(Exercises);
    vm.form.name = '   ';
    await vm.save();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('reloads and clears the form after saving', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ exercises: CATALOG }));
    const vm = makeVm(Exercises);
    vm.form.name = 'Remada';
    await vm.save();

    expect(apiFetch).toHaveBeenCalledTimes(2);
    expect(apiFetch.mock.calls[1][0]).toBe('/api/exercises');
    expect(vm.form.name).toBe('');
    expect(vm.editingId).toBeNull();
  });

  it('deletes via DELETE and reloads', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ exercises: [] }));
    const vm = makeVm(Exercises);
    await vm.remove('e1');

    expect(apiFetch.mock.calls[0]).toEqual(['/api/exercises/e1', { method: 'DELETE' }]);
    expect(apiFetch).toHaveBeenCalledTimes(2);
  });
});
