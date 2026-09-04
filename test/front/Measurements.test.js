// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { jsonResponse, makeVm } from './vm.js';

vi.mock('@/lib/api.js', () => ({ apiFetch: vi.fn() }));

const { default: Measurements } = await import('../../src/pages/Measurements/Measurements.js');
const { apiFetch } = await import('@/lib/api.js');

// A API devolve por data decrescente e o Map do Mongoose sai como objeto no lean().
const HISTORY = [
  { _id: 'm2', date: '2026-09-01', weight: 82, measurements: { cintura: 84 } },
  { _id: 'm1', date: '2026-08-01', weight: 84, measurements: { cintura: 86 } },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Measurements', () => {
  it('carrega o histórico', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ measurements: HISTORY }));
    const vm = makeVm(Measurements);
    await vm.load();

    expect(apiFetch).toHaveBeenCalledWith('/api/measurements');
    expect(vm.history).toHaveLength(2);
  });

  it('preserva a ordem que a API devolveu', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ measurements: HISTORY }));
    const vm = makeVm(Measurements);
    await vm.load();

    expect(vm.history.map((m) => m._id)).toEqual(['m2', 'm1']);
  });

  it('não quebra quando a rede falha', async () => {
    apiFetch.mockRejectedValue(new Error('offline'));
    const vm = makeVm(Measurements);
    await expect(vm.load()).resolves.toBeUndefined();
    expect(vm.error).toBeTruthy();
  });

  it('adiciona e remove campos de medida', () => {
    const vm = makeVm(Measurements);
    const inicial = vm.form.fields.length;
    vm.addField();
    expect(vm.form.fields).toHaveLength(inicial + 1);

    vm.removeField(0);
    expect(vm.form.fields).toHaveLength(inicial);
  });

  it('monta o objeto de medidas a partir dos campos', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ measurements: [] }));
    const vm = makeVm(Measurements);
    vm.form.weight = 82.5;
    vm.form.fields = [
      { key: 'cintura', value: 84 },
      { key: 'braco', value: 36 },
    ];
    await vm.save();

    const [path, options] = apiFetch.mock.calls[0];
    expect(path).toBe('/api/measurements');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toMatchObject({
      weight: 82.5,
      measurements: { cintura: 84, braco: 36 },
    });
  });

  it('ignora campos sem nome ou sem valor', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ measurements: [] }));
    const vm = makeVm(Measurements);
    vm.form.weight = 80;
    vm.form.fields = [
      { key: 'cintura', value: 84 },
      { key: '', value: 50 },
      { key: 'coxa', value: null },
      { key: '  ', value: null },
    ];
    await vm.save();

    expect(JSON.parse(apiFetch.mock.calls[0][1].body).measurements).toEqual({ cintura: 84 });
  });

  it('não salva registro totalmente vazio', async () => {
    const vm = makeVm(Measurements);
    vm.form.weight = null;
    vm.form.fields = [{ key: '', value: null }];
    await vm.save();

    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('salva só com peso, sem medidas', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ measurements: [] }));
    const vm = makeVm(Measurements);
    vm.form.weight = 81;
    vm.form.fields = [];
    await vm.save();

    expect(apiFetch).toHaveBeenCalled();
    expect(JSON.parse(apiFetch.mock.calls[0][1].body).weight).toBe(81);
  });

  it('limpa o formulário e recarrega depois de salvar', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ measurements: HISTORY }));
    const vm = makeVm(Measurements);
    vm.form.weight = 81;
    await vm.save();

    expect(vm.form.weight).toBeNull();
    expect(apiFetch.mock.calls[1][0]).toBe('/api/measurements');
  });

  it('remove registro e recarrega', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ measurements: [] }));
    const vm = makeVm(Measurements);
    await vm.remove('m1');

    expect(apiFetch.mock.calls[0]).toEqual(['/api/measurements/m1', { method: 'DELETE' }]);
    expect(apiFetch).toHaveBeenCalledTimes(2);
  });
});
