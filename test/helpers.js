import { signToken } from '../api/lib/auth.js';

export function mockRes() {
  return {
    statusCode: null,
    body: null,
    headers: {},
    ended: false,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    end() { this.ended = true; return this; },
  };
}

export function bearer(userId, role = 'user') {
  const token = signToken({ userId, email: `${userId}@b.com`, role });
  return { authorization: `Bearer ${token}` };
}

export function query(value) {
  const q = {
    sort: () => q,
    populate: () => q,
    lean: () => Promise.resolve(value),
    then: (...args) => Promise.resolve(value).then(...args),
  };
  return q;
}
