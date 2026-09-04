import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bearer, mockRes, query } from '../helpers.js';

vi.mock('../../api/lib/db.js', () => ({ connectDB: vi.fn() }));
vi.mock('../../api/lib/models/User.js', () => ({
  default: {
    find: vi.fn(),
    findOne: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    create: vi.fn(),
    countDocuments: vi.fn(),
  },
}));
vi.mock('bcryptjs', () => ({ default: { hash: vi.fn(async () => 'hashed') } }));

const { default: list } = await import('../../api/users.js');
const { default: item } = await import('../../api/users/[id].js');
const { default: User } = await import('../../api/lib/models/User.js');
const { default: bcrypt } = await import('bcryptjs');

const admin = () => bearer('admin1', 'admin');
const regular = () => bearer('u2', 'user');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('permission', () => {
  const cases = [
    ['GET', list, { method: 'GET' }],
    ['POST', list, { method: 'POST', body: { email: 'a@b.com', password: 'x' } }],
  ];

  it.each(cases)('%s without a token returns 401', async (_m, handler, req) => {
    const res = mockRes();
    await handler({ ...req, headers: {}, query: {} }, res);
    expect(res.statusCode).toBe(401);
  });

  it.each(cases)('%s with a regular user returns 403', async (_m, handler, req) => {
    const res = mockRes();
    await handler({ ...req, headers: regular(), query: {} }, res);
    expect(res.statusCode).toBe(403);
    expect(User.find).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
  });

  it('PUT and DELETE with a regular user return 403', async () => {
    for (const method of ['PUT', 'DELETE']) {
      const res = mockRes();
      await item({ method, headers: regular(), query: { id: 'u9' }, body: {} }, res);
      expect(res.statusCode).toBe(403);
    }
    expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(User.findByIdAndDelete).not.toHaveBeenCalled();
  });
});

describe('GET /api/users', () => {
  it('never returns the password hash', async () => {
    const select = vi.fn().mockReturnValue(query([{ _id: 'u1', email: 'a@b.com' }]));
    User.find.mockReturnValue({ select });

    const res = mockRes();
    await list({ method: 'GET', headers: admin(), query: {} }, res);

    expect(select).toHaveBeenCalledWith('-password');
    expect(res.statusCode).toBe(200);
    expect(JSON.stringify(res.body)).not.toContain('password');
  });
});

describe('POST /api/users', () => {
  it('requires email and password', async () => {
    const res = mockRes();
    await list({ method: 'POST', headers: admin(), query: {}, body: { email: 'a@b.com' } }, res);
    expect(res.statusCode).toBe(400);
  });

  it('rejects a duplicate email', async () => {
    User.findOne.mockResolvedValue({ _id: 'existente' });
    const res = mockRes();
    await list({ method: 'POST', headers: admin(), query: {}, body: { email: 'a@b.com', password: 'x' } }, res);
    expect(res.statusCode).toBe(409);
    expect(User.create).not.toHaveBeenCalled();
  });

  it('hashes the password and never stores plain text', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: 'u3', email: 'nova@b.com', name: 'Ela', role: 'user' });

    const res = mockRes();
    await list({
      method: 'POST', headers: admin(), query: {},
      body: { email: 'Nova@B.com', password: 'segredo', name: 'Ela' },
    }, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('segredo', 10);
    const [created] = User.create.mock.calls[0];
    expect(created.password).toBe('hashed');
    expect(created.email).toBe('nova@b.com');
    expect(res.statusCode).toBe(201);
  });

  it('does not return a password in the creation response', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: 'u3', email: 'n@b.com', name: '', role: 'user', password: 'hashed' });

    const res = mockRes();
    await list({ method: 'POST', headers: admin(), query: {}, body: { email: 'n@b.com', password: 'x' } }, res);

    expect(JSON.stringify(res.body)).not.toContain('hashed');
  });
});

describe('PUT /api/users/[id]', () => {
  it('404 for a non-existent user', async () => {
    User.findById.mockResolvedValue(null);
    const res = mockRes();
    await item({ method: 'PUT', headers: admin(), query: { id: 'nope' }, body: { name: 'X' } }, res);
    expect(res.statusCode).toBe(404);
  });

  it('updates name and role', async () => {
    User.findById.mockResolvedValue({ _id: 'u2', role: 'user' });
    User.findByIdAndUpdate.mockReturnValue({ select: () => Promise.resolve({ _id: 'u2', role: 'admin' }) });

    const res = mockRes();
    await item({ method: 'PUT', headers: admin(), query: { id: 'u2' }, body: { name: 'Ela', role: 'admin' } }, res);

    const [, update] = User.findByIdAndUpdate.mock.calls[0];
    expect(update).toMatchObject({ name: 'Ela', role: 'admin' });
    expect(res.statusCode).toBe(200);
  });

  it('hashes a new password', async () => {
    User.findById.mockResolvedValue({ _id: 'u2', role: 'user' });
    User.findByIdAndUpdate.mockReturnValue({ select: () => Promise.resolve({ _id: 'u2' }) });

    await item({ method: 'PUT', headers: admin(), query: { id: 'u2' }, body: { password: 'nova' } }, mockRes());

    const [, update] = User.findByIdAndUpdate.mock.calls[0];
    expect(update.password).toBe('hashed');
  });

  it('a blank password does not overwrite the existing one', async () => {
    User.findById.mockResolvedValue({ _id: 'u2', role: 'user' });
    User.findByIdAndUpdate.mockReturnValue({ select: () => Promise.resolve({ _id: 'u2' }) });

    await item({ method: 'PUT', headers: admin(), query: { id: 'u2' }, body: { name: 'Ela', password: '' } }, mockRes());

    const [, update] = User.findByIdAndUpdate.mock.calls[0];
    expect(update.password).toBeUndefined();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it('refuses to demote the last admin', async () => {
    User.findById.mockResolvedValue({ _id: 'admin1', role: 'admin' });
    User.countDocuments.mockResolvedValue(1);

    const res = mockRes();
    await item({ method: 'PUT', headers: admin(), query: { id: 'admin1' }, body: { role: 'user' } }, res);

    expect(res.statusCode).toBe(400);
    expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('allows demoting an admin when another one exists', async () => {
    User.findById.mockResolvedValue({ _id: 'admin2', role: 'admin' });
    User.countDocuments.mockResolvedValue(2);
    User.findByIdAndUpdate.mockReturnValue({ select: () => Promise.resolve({ _id: 'admin2' }) });

    const res = mockRes();
    await item({ method: 'PUT', headers: admin(), query: { id: 'admin2' }, body: { role: 'user' } }, res);
    expect(res.statusCode).toBe(200);
  });
});

describe('DELETE /api/users/[id]', () => {
  it('refuses to delete your own account', async () => {
    const res = mockRes();
    await item({ method: 'DELETE', headers: admin(), query: { id: 'admin1' }, body: {} }, res);

    expect(res.statusCode).toBe(400);
    expect(User.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it('refuses to delete the last admin', async () => {
    User.findById.mockResolvedValue({ _id: 'admin2', role: 'admin' });
    User.countDocuments.mockResolvedValue(1);

    const res = mockRes();
    await item({ method: 'DELETE', headers: admin(), query: { id: 'admin2' }, body: {} }, res);

    expect(res.statusCode).toBe(400);
    expect(User.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it('deletes a regular user', async () => {
    User.findById.mockResolvedValue({ _id: 'u2', role: 'user' });
    User.findByIdAndDelete.mockResolvedValue({ _id: 'u2' });

    const res = mockRes();
    await item({ method: 'DELETE', headers: admin(), query: { id: 'u2' }, body: {} }, res);

    expect(User.findByIdAndDelete).toHaveBeenCalledWith('u2');
    expect(res.statusCode).toBe(200);
  });

  it('404 for a non-existent user', async () => {
    User.findById.mockResolvedValue(null);
    const res = mockRes();
    await item({ method: 'DELETE', headers: admin(), query: { id: 'nope' }, body: {} }, res);
    expect(res.statusCode).toBe(404);
  });
});
