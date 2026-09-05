import { describe, expect, it } from 'vitest';
import { scopedFilter } from '../../api/_lib/ownership.js';

const auth = { userId: 'u1', email: 'a@b.com', role: 'user' };

describe('scopedFilter', () => {
  it('adds the user from the token', () => {
    expect(scopedFilter(auth)).toEqual({ user: 'u1' });
  });

  it('merges an extra filter', () => {
    expect(scopedFilter(auth, { routine: 'r1' })).toEqual({ user: 'u1', routine: 'r1' });
  });

  it('does not let the extra filter override user', () => {
    expect(scopedFilter(auth, { user: 'invasor' })).toEqual({ user: 'u1' });
  });
});
