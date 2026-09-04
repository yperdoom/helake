import { describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import WorkoutLog from '../../../api/lib/models/WorkoutLog.js';

const oid = () => new mongoose.Types.ObjectId().toString();

describe('WorkoutLog schema', () => {
  it('exige user', () => {
    const error = new WorkoutLog({}).validateSync();
    expect(error?.errors?.user).toBeDefined();
  });

  it('usa a data de hoje por padrão', () => {
    const log = new WorkoutLog({ user: oid() });
    expect(log.date).toBeInstanceOf(Date);
  });

  it('valida um log completo', () => {
    const log = new WorkoutLog({
      user: oid(),
      routine: oid(),
      entries: [{ exercise: oid(), load: 60 }],
      notes: 'pesado',
    });
    expect(log.validateSync()).toBeUndefined();
  });

  it('exige exercise em cada entry', () => {
    const log = new WorkoutLog({ user: oid(), entries: [{ load: 40 }] });
    expect(log.validateSync()).toBeDefined();
  });

  it('rejeita carga negativa', () => {
    const log = new WorkoutLog({ user: oid(), entries: [{ exercise: oid(), load: -5 }] });
    expect(log.validateSync()).toBeDefined();
  });

  it('não guarda séries individuais, só carga por exercício', () => {
    expect(WorkoutLog.schema.path('entries').schema.path('sets')).toBeUndefined();
    expect(WorkoutLog.schema.path('entries').schema.path('load')).toBeDefined();
  });

  it('indexa user', () => {
    expect(WorkoutLog.schema.path('user').options.index).toBe(true);
  });
});
