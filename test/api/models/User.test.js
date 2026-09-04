import { describe, expect, it } from 'vitest';
import User from '../../../api/lib/models/User.js';

describe('User schema', () => {
  it('defaults role to "user"', () => {
    const user = new User({ email: 'a@b.com', password: 'hash' });
    expect(user.role).toBe('user');
  });

  it('accepts role "admin"', () => {
    const user = new User({ email: 'a@b.com', password: 'hash', role: 'admin' });
    expect(user.validateSync()).toBeUndefined();
    expect(user.role).toBe('admin');
  });

  it('rejects a role outside the enum', () => {
    const user = new User({ email: 'a@b.com', password: 'hash', role: 'root' });
    const error = user.validateSync();
    expect(error?.errors?.role).toBeDefined();
  });

  it('accepts name and defaults it to an empty string', () => {
    const semNome = new User({ email: 'a@b.com', password: 'hash' });
    expect(semNome.name).toBe('');

    const comNome = new User({ email: 'a@b.com', password: 'hash', name: 'Pedro' });
    expect(comNome.name).toBe('Pedro');
  });
});
