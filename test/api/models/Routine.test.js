import { describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import Routine from '../../../api/lib/models/Routine.js';

const oid = () => new mongoose.Types.ObjectId().toString();

describe('Routine schema', () => {
  it('exige user e name', () => {
    const error = new Routine({}).validateSync();
    expect(error?.errors?.user).toBeDefined();
    expect(error?.errors?.name).toBeDefined();
  });

  it('valida uma rotina completa', () => {
    const routine = new Routine({
      user: oid(),
      name: 'Treino A',
      exercises: [{ exercise: oid(), targetSets: 4, targetReps: 10, targetLoad: 60, order: 1 }],
    });
    expect(routine.validateSync()).toBeUndefined();
  });

  it('exige exercise em cada item', () => {
    const routine = new Routine({ user: oid(), name: 'A', exercises: [{ targetSets: 3 }] });
    const error = routine.validateSync();
    expect(error).toBeDefined();
  });

  it('rejeita alvos negativos', () => {
    const routine = new Routine({
      user: oid(), name: 'A',
      exercises: [{ exercise: oid(), targetLoad: -1 }],
    });
    expect(routine.validateSync()).toBeDefined();
  });

  it('indexa user', () => {
    expect(Routine.schema.path('user').options.index).toBe(true);
  });

  it('não gera _id nos itens de exercises', () => {
    const routine = new Routine({ user: oid(), name: 'A', exercises: [{ exercise: oid() }] });
    expect(routine.exercises[0]._id).toBeUndefined();
  });
});
