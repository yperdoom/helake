import { describe, expect, it } from 'vitest';
import Exercise from '../../../api/lib/models/Exercise.js';

describe('Exercise schema', () => {
  it('requires name', () => {
    const error = new Exercise({}).validateSync();
    expect(error?.errors?.name).toBeDefined();
  });

  it('accepts muscleGroup as free text', () => {
    const ex = new Exercise({ name: 'Supino', muscleGroup: 'Peito' });
    expect(ex.validateSync()).toBeUndefined();
    expect(ex.muscleGroup).toBe('Peito');
  });

  it('defaults muscleGroup and notes to empty strings', () => {
    const ex = new Exercise({ name: 'Supino' });
    expect(ex.muscleGroup).toBe('');
    expect(ex.notes).toBe('');
  });

  it('has no owner', () => {
    expect(Exercise.schema.path('user')).toBeUndefined();
  });
});
