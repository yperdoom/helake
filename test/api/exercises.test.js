import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bearer, mockRes, query } from '../helpers.js';

vi.mock('../../api/lib/db.js', () => ({ connectDB: vi.fn() }));
vi.mock('../../api/lib/models/Exercise.js', () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

const { default: list } = await import('../../api/exercises.js');
const { default: item } = await import('../../api/exercises/[id].js');
const { default: Exercise } = await import('../../api/lib/models/Exercise.js');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('/api/exercises', () => {
  it('401 sem token', async () => {
    const res = mockRes();
    await list({ method: 'GET', headers: {} }, res);
    expect(res.statusCode).toBe(401);
    expect(Exercise.find).not.toHaveBeenCalled();
  });

  it('lista o catálogo sem filtrar por usuário', async () => {
    Exercise.find.mockReturnValue(query([{ name: 'Supino' }]));
    const res = mockRes();
    await list({ method: 'GET', headers: bearer('u1') }, res);

    expect(res.statusCode).toBe(200);
    expect(Exercise.find).toHaveBeenCalledWith();
    expect(res.body.exercises).toHaveLength(1);
  });

  it('mostra ao usuário B o exercício criado por A', async () => {
    Exercise.find.mockReturnValue(query([{ name: 'Agachamento' }]));
    const res = mockRes();
    await list({ method: 'GET', headers: bearer('u2') }, res);
    expect(res.body.exercises[0].name).toBe('Agachamento');
  });

  it('cria via POST', async () => {
    Exercise.create.mockResolvedValue({ _id: 'e1', name: 'Remada' });
    const res = mockRes();
    await list({ method: 'POST', headers: bearer('u1'), body: { name: 'Remada' } }, res);

    expect(Exercise.create).toHaveBeenCalledWith({ name: 'Remada' });
    expect(res.statusCode).toBe(201);
  });

  it('405 para método não suportado', async () => {
    const res = mockRes();
    await list({ method: 'DELETE', headers: bearer('u1') }, res);
    expect(res.statusCode).toBe(405);
  });
});

describe('/api/exercises/[id]', () => {
  it('401 sem token', async () => {
    const res = mockRes();
    await item({ method: 'PUT', headers: {}, query: { id: 'e1' }, body: {} }, res);
    expect(res.statusCode).toBe(401);
    expect(Exercise.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('atualiza via PUT', async () => {
    Exercise.findByIdAndUpdate.mockResolvedValue({ _id: 'e1', name: 'Remada curvada' });
    const res = mockRes();
    await item({ method: 'PUT', headers: bearer('u1'), query: { id: 'e1' }, body: { name: 'Remada curvada' } }, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.exercise.name).toBe('Remada curvada');
  });

  it('404 ao atualizar id inexistente', async () => {
    Exercise.findByIdAndUpdate.mockResolvedValue(null);
    const res = mockRes();
    await item({ method: 'PUT', headers: bearer('u1'), query: { id: 'nope' }, body: {} }, res);
    expect(res.statusCode).toBe(404);
  });

  it('apaga via DELETE', async () => {
    Exercise.findByIdAndDelete.mockResolvedValue({ _id: 'e1' });
    const res = mockRes();
    await item({ method: 'DELETE', headers: bearer('u1'), query: { id: 'e1' } }, res);
    expect(res.statusCode).toBe(200);
  });
});
