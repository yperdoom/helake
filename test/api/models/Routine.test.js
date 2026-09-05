import { describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import Routine from '../../../api/_lib/models/Routine.js';

const oid = () => new mongoose.Types.ObjectId().toString();

describe('Routine schema', () => {
  it('requires user and name', () => {
    const error = new Routine({}).validateSync();
    expect(error?.errors?.user).toBeDefined();
    expect(error?.errors?.name).toBeDefined();
  });

  it('validates a complete routine', () => {
    const routine = new Routine({
      user: oid(),
      name: 'Treino A',
      exercises: [{ exercise: oid(), targetSets: 4, targetReps: 10, targetLoad: 60, order: 1 }],
    });
    expect(routine.validateSync()).toBeUndefined();
  });

  it('requires exercise on every item', () => {
    const routine = new Routine({ user: oid(), name: 'A', exercises: [{ targetSets: 3 }] });
    const error = routine.validateSync();
    expect(error).toBeDefined();
  });

  it('rejects negative targets', () => {
    const routine = new Routine({
      user: oid(), name: 'A',
      exercises: [{ exercise: oid(), targetLoad: -1 }],
    });
    expect(routine.validateSync()).toBeDefined();
  });

  it('indexes user', () => {
    expect(Routine.schema.path('user').options.index).toBe(true);
  });

  it('does not generate _id on exercises items', () => {
    const routine = new Routine({ user: oid(), name: 'A', exercises: [{ exercise: oid() }] });
    expect(routine.exercises[0]._id).toBeUndefined();
  });
});
