import { describe, expect, it } from 'vitest';
import User from '../../../api/lib/models/User.js';

describe('User schema', () => {
  it('nasce com role "user" por padrão', () => {
    const user = new User({ email: 'a@b.com', password: 'hash' });
    expect(user.role).toBe('user');
  });

  it('aceita role "admin"', () => {
    const user = new User({ email: 'a@b.com', password: 'hash', role: 'admin' });
    expect(user.validateSync()).toBeUndefined();
    expect(user.role).toBe('admin');
  });

  it('rejeita role fora do enum', () => {
    const user = new User({ email: 'a@b.com', password: 'hash', role: 'root' });
    const error = user.validateSync();
    expect(error?.errors?.role).toBeDefined();
  });

  it('aceita name e usa string vazia por padrão', () => {
    const semNome = new User({ email: 'a@b.com', password: 'hash' });
    expect(semNome.name).toBe('');

    const comNome = new User({ email: 'a@b.com', password: 'hash', name: 'Pedro' });
    expect(comNome.name).toBe('Pedro');
  });
});
