import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bearer, mockRes, query } from '../helpers.js';

vi.mock('../../api/lib/db.js', () => ({ connectDB: vi.fn() }));
vi.mock('../../api/lib/models/WorkoutLog.js', () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
    findOneAndUpdate: vi.fn(),
    findOneAndDelete: vi.fn(),
  },
}));
vi.mock('../../api/lib/models/Routine.js', () => ({
  default: { exists: vi.fn() },
}));

const { default: list } = await import('../../api/workout-logs.js');
const { default: item } = await import('../../api/workout-logs/[id].js');
const { default: WorkoutLog } = await import('../../api/lib/models/WorkoutLog.js');
const { default: Routine } = await import('../../api/lib/models/Routine.js');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('/api/workout-logs', () => {
  it('401 sem token', async () => {
    const res = mockRes();
    await list({ method: 'GET', headers: {}, query: {} }, res);
    expect(res.statusCode).toBe(401);
    expect(WorkoutLog.find).not.toHaveBeenCalled();
  });

  it('filtra pelo user do token', async () => {
    WorkoutLog.find.mockReturnValue(query([]));
    await list({ method: 'GET', headers: bearer('u1'), query: {} }, mockRes());
    expect(WorkoutLog.find).toHaveBeenCalledWith({ user: 'u1' });
  });

  it('filtra por exercise quando pedido', async () => {
    WorkoutLog.find.mockReturnValue(query([]));
    await list({ method: 'GET', headers: bearer('u1'), query: { exercise: 'e1' } }, mockRes());
    expect(WorkoutLog.find).toHaveBeenCalledWith({ user: 'u1', 'entries.exercise': 'e1' });
  });

  it('ordena por data decrescente', async () => {
    const sort = vi.fn().mockReturnValue({ lean: () => Promise.resolve([]) });
    WorkoutLog.find.mockReturnValue({ populate: () => ({ sort }) });
    await list({ method: 'GET', headers: bearer('u1'), query: {} }, mockRes());
    expect(sort).toHaveBeenCalledWith({ date: -1 });
  });

  it('grava o user do token e ignora forjadura no POST', async () => {
    WorkoutLog.create.mockResolvedValue({ _id: 'w1' });
    const res = mockRes();
    await list({ method: 'POST', headers: bearer('u1'), query: {}, body: { user: 'invasor', notes: 'ok' } }, res);

    expect(WorkoutLog.create).toHaveBeenCalledWith({ notes: 'ok', user: 'u1' });
    expect(res.statusCode).toBe(201);
  });

  it('recusa POST apontando para rotina de outro usuário', async () => {
    Routine.exists.mockResolvedValue(null);
    const res = mockRes();
    await list({ method: 'POST', headers: bearer('u2'), query: {}, body: { routine: 'r1' } }, res);

    expect(Routine.exists).toHaveBeenCalledWith({ _id: 'r1', user: 'u2' });
    expect(res.statusCode).toBe(404);
    expect(WorkoutLog.create).not.toHaveBeenCalled();
  });

  it('aceita POST com rotina própria', async () => {
    Routine.exists.mockResolvedValue({ _id: 'r1' });
    WorkoutLog.create.mockResolvedValue({ _id: 'w1' });
    const res = mockRes();
    await list({ method: 'POST', headers: bearer('u1'), query: {}, body: { routine: 'r1' } }, res);
    expect(res.statusCode).toBe(201);
  });
});

describe('/api/workout-logs/[id]', () => {
  it('PUT filtra por _id e user', async () => {
    WorkoutLog.findOneAndUpdate.mockResolvedValue({ _id: 'w1' });
    const res = mockRes();
    await item({ method: 'PUT', headers: bearer('u1'), query: { id: 'w1' }, body: { notes: 'x' } }, res);

    expect(WorkoutLog.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'w1', user: 'u1' }, { notes: 'x' }, expect.anything(),
    );
    expect(res.statusCode).toBe(200);
  });

  it('PUT em log de outro usuário devolve 404', async () => {
    WorkoutLog.findOneAndUpdate.mockResolvedValue(null);
    const res = mockRes();
    await item({ method: 'PUT', headers: bearer('u2'), query: { id: 'w1' }, body: {} }, res);
    expect(res.statusCode).toBe(404);
  });

  it('DELETE em log de outro usuário devolve 404', async () => {
    WorkoutLog.findOneAndDelete.mockResolvedValue(null);
    const res = mockRes();
    await item({ method: 'DELETE', headers: bearer('u2'), query: { id: 'w1' } }, res);
    expect(res.statusCode).toBe(404);
  });
});
