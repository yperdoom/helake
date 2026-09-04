import { describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import WorkoutLog from '../../../api/lib/models/WorkoutLog.js';

const oid = () => new mongoose.Types.ObjectId().toString();

describe('WorkoutLog schema', () => {
  it('requires user', () => {
    const error = new WorkoutLog({}).validateSync();
    expect(error?.errors?.user).toBeDefined();
  });

  it('defaults the date to today', () => {
    const log = new WorkoutLog({ user: oid() });
    expect(log.date).toBeInstanceOf(Date);
  });

  it('validates a complete log', () => {
    const log = new WorkoutLog({
      user: oid(),
      routine: oid(),
      entries: [{ exercise: oid(), load: 60 }],
      notes: 'pesado',
    });
    expect(log.validateSync()).toBeUndefined();
  });

  it('requires exercise on every entry', () => {
    const log = new WorkoutLog({ user: oid(), entries: [{ load: 40 }] });
    expect(log.validateSync()).toBeDefined();
  });

  it('rejeita carga negativa', () => {
    const log = new WorkoutLog({ user: oid(), entries: [{ exercise: oid(), load: -5 }] });
    expect(log.validateSync()).toBeDefined();
  });

  it('stores no individual sets, only load per exercise', () => {
    expect(WorkoutLog.schema.path('entries').schema.path('sets')).toBeUndefined();
    expect(WorkoutLog.schema.path('entries').schema.path('load')).toBeDefined();
  });

  it('indexes user', () => {
    expect(WorkoutLog.schema.path('user').options.index).toBe(true);
  });
});
