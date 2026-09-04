import { describe, expect, it } from 'vitest';
import { scopedFilter } from '../../api/lib/ownership.js';

const auth = { userId: 'u1', email: 'a@b.com', role: 'user' };

describe('scopedFilter', () => {
  it('adiciona o user do token', () => {
    expect(scopedFilter(auth)).toEqual({ user: 'u1' });
  });

  it('mescla filtro extra', () => {
    expect(scopedFilter(auth, { routine: 'r1' })).toEqual({ user: 'u1', routine: 'r1' });
  });

  it('não deixa o filtro extra sobrescrever o user', () => {
    expect(scopedFilter(auth, { user: 'invasor' })).toEqual({ user: 'u1' });
  });
});
