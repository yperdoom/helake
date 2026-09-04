import { describe, expect, it } from 'vitest';
import Exercise from '../../../api/lib/models/Exercise.js';

describe('Exercise schema', () => {
  it('exige name', () => {
    const error = new Exercise({}).validateSync();
    expect(error?.errors?.name).toBeDefined();
  });

  it('aceita muscleGroup como texto livre', () => {
    const ex = new Exercise({ name: 'Supino', muscleGroup: 'Peito' });
    expect(ex.validateSync()).toBeUndefined();
    expect(ex.muscleGroup).toBe('Peito');
  });

  it('usa strings vazias por padrão em muscleGroup e notes', () => {
    const ex = new Exercise({ name: 'Supino' });
    expect(ex.muscleGroup).toBe('');
    expect(ex.notes).toBe('');
  });

  it('não tem dono', () => {
    expect(Exercise.schema.path('user')).toBeUndefined();
  });
});
