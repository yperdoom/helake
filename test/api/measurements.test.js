import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bearer, mockRes, query } from '../helpers.js';

vi.mock('../../api/_lib/db.js', () => ({ connectDB: vi.fn() }));
vi.mock('../../api/_lib/models/BodyMeasurement.js', () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
    findOneAndUpdate: vi.fn(),
    findOneAndDelete: vi.fn(),
  },
}));

const { default: list } = await import('../../api/_routes/measurements.js');
const { default: item } = await import('../../api/_routes/measurements/[id].js');
const { default: BodyMeasurement } = await import('../../api/_lib/models/BodyMeasurement.js');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('/api/measurements', () => {
  it('401 without a token', async () => {
    const res = mockRes();
    await list({ method: 'GET', headers: {} }, res);
    expect(res.statusCode).toBe(401);
    expect(BodyMeasurement.find).not.toHaveBeenCalled();
  });

  it('filters by the user in the token', async () => {
    BodyMeasurement.find.mockReturnValue(query([]));
    await list({ method: 'GET', headers: bearer('u1') }, mockRes());
    expect(BodyMeasurement.find).toHaveBeenCalledWith({ user: 'u1' });
  });

  it('sorts by date descending', async () => {
    const sort = vi.fn().mockReturnValue({ lean: () => Promise.resolve([]) });
    BodyMeasurement.find.mockReturnValue({ sort });
    await list({ method: 'GET', headers: bearer('u1') }, mockRes());
    expect(sort).toHaveBeenCalledWith({ date: -1 });
  });

  it('stores the user from the token and ignores forgery', async () => {
    BodyMeasurement.create.mockResolvedValue({ _id: 'm1' });
    const res = mockRes();
    await list({ method: 'POST', headers: bearer('u1'), body: { user: 'invasor', weight: 80 } }, res);

    expect(BodyMeasurement.create).toHaveBeenCalledWith({ weight: 80, user: 'u1' });
    expect(res.statusCode).toBe(201);
  });
});

describe('/api/measurements/[id]', () => {
  it('PUT filters by _id and user', async () => {
    BodyMeasurement.findOneAndUpdate.mockResolvedValue({ _id: 'm1' });
    const res = mockRes();
    await item({ method: 'PUT', headers: bearer('u1'), query: { id: 'm1' }, body: { weight: 81 } }, res);

    expect(BodyMeasurement.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'm1', user: 'u1' }, { weight: 81 }, expect.anything(),
    );
    expect(res.statusCode).toBe(200);
  });

  it('PUT on a measurement from another user returns 404', async () => {
    BodyMeasurement.findOneAndUpdate.mockResolvedValue(null);
    const res = mockRes();
    await item({ method: 'PUT', headers: bearer('u2'), query: { id: 'm1' }, body: {} }, res);
    expect(res.statusCode).toBe(404);
  });

  it('DELETE on a measurement from another user returns 404', async () => {
    BodyMeasurement.findOneAndDelete.mockResolvedValue(null);
    const res = mockRes();
    await item({ method: 'DELETE', headers: bearer('u2'), query: { id: 'm1' } }, res);
    expect(res.statusCode).toBe(404);
  });
});
