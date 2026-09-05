import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bearer, mockRes, query } from '../helpers.js';

vi.mock('../../api/_lib/db.js', () => ({ connectDB: vi.fn() }));
vi.mock('../../api/_lib/models/Routine.js', () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
    findOneAndUpdate: vi.fn(),
    findOneAndDelete: vi.fn(),
  },
}));

const { default: list } = await import('../../api/_routes/routines.js');
const { default: item } = await import('../../api/_routes/routines/[id].js');
const { default: Routine } = await import('../../api/_lib/models/Routine.js');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('/api/routines', () => {
  it('401 without a token', async () => {
    const res = mockRes();
    await list({ method: 'GET', headers: {} }, res);
    expect(res.statusCode).toBe(401);
    expect(Routine.find).not.toHaveBeenCalled();
  });

  it('filters by the user in the token', async () => {
    Routine.find.mockReturnValue(query([]));
    const res = mockRes();
    await list({ method: 'GET', headers: bearer('u1') }, res);

    expect(Routine.find).toHaveBeenCalledWith({ user: 'u1' });
    expect(res.statusCode).toBe(200);
  });

  it('user B does not get the filter of user A', async () => {
    Routine.find.mockReturnValue(query([]));
    await list({ method: 'GET', headers: bearer('u2') }, mockRes());
    expect(Routine.find).toHaveBeenCalledWith({ user: 'u2' });
  });

  it('stores the user from the token on POST', async () => {
    Routine.create.mockResolvedValue({ _id: 'r1' });
    const res = mockRes();
    await list({ method: 'POST', headers: bearer('u1'), body: { name: 'Treino A' } }, res);

    expect(Routine.create).toHaveBeenCalledWith({ name: 'Treino A', user: 'u1' });
    expect(res.statusCode).toBe(201);
  });

  it('ignores a forged user in the POST body', async () => {
    Routine.create.mockResolvedValue({ _id: 'r1' });
    await list({ method: 'POST', headers: bearer('u1'), body: { name: 'X', user: 'invasor' } }, mockRes());

    expect(Routine.create).toHaveBeenCalledWith({ name: 'X', user: 'u1' });
  });
});

describe('/api/routines/[id]', () => {
  it('401 without a token', async () => {
    const res = mockRes();
    await item({ method: 'PUT', headers: {}, query: { id: 'r1' }, body: {} }, res);
    expect(res.statusCode).toBe(401);
    expect(Routine.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('PUT filters by _id and user', async () => {
    Routine.findOneAndUpdate.mockResolvedValue({ _id: 'r1', name: 'Treino B' });
    const res = mockRes();
    await item({ method: 'PUT', headers: bearer('u1'), query: { id: 'r1' }, body: { name: 'Treino B' } }, res);

    expect(Routine.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'r1', user: 'u1' },
      { name: 'Treino B' },
      expect.anything(),
    );
    expect(res.statusCode).toBe(200);
  });

  it('PUT on a routine from another user returns 404', async () => {
    Routine.findOneAndUpdate.mockResolvedValue(null);
    const res = mockRes();
    await item({ method: 'PUT', headers: bearer('u2'), query: { id: 'r1' }, body: { name: 'hack' } }, res);
    expect(res.statusCode).toBe(404);
  });

  it('PUT does not allow forging user in the body', async () => {
    Routine.findOneAndUpdate.mockResolvedValue({ _id: 'r1' });
    await item({ method: 'PUT', headers: bearer('u1'), query: { id: 'r1' }, body: { user: 'invasor' } }, mockRes());

    const [, update] = Routine.findOneAndUpdate.mock.calls[0];
    expect(update.user).toBeUndefined();
  });

  it('DELETE filters by _id and user', async () => {
    Routine.findOneAndDelete.mockResolvedValue({ _id: 'r1' });
    const res = mockRes();
    await item({ method: 'DELETE', headers: bearer('u1'), query: { id: 'r1' } }, res);

    expect(Routine.findOneAndDelete).toHaveBeenCalledWith({ _id: 'r1', user: 'u1' });
    expect(res.statusCode).toBe(200);
  });

  it('DELETE on a routine from another user returns 404', async () => {
    Routine.findOneAndDelete.mockResolvedValue(null);
    const res = mockRes();
    await item({ method: 'DELETE', headers: bearer('u2'), query: { id: 'r1' } }, res);
    expect(res.statusCode).toBe(404);
  });
});
