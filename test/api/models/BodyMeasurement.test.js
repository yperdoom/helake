import { describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import BodyMeasurement from '../../../api/_lib/models/BodyMeasurement.js';

const oid = () => new mongoose.Types.ObjectId().toString();

describe('BodyMeasurement schema', () => {
  it('requires user', () => {
    const error = new BodyMeasurement({}).validateSync();
    expect(error?.errors?.user).toBeDefined();
  });

  it('defaults the date to today', () => {
    const m = new BodyMeasurement({ user: oid() });
    expect(m.date).toBeInstanceOf(Date);
  });

  it('accepts arbitrary measurements as numbers', () => {
    const m = new BodyMeasurement({
      user: oid(),
      weight: 82.5,
      measurements: { peito: 100, cintura: 84, braco: 36 },
    });
    expect(m.validateSync()).toBeUndefined();
    expect(m.measurements.get('cintura')).toBe(84);
  });

  it('rejects a non-numeric measurement', () => {
    const m = new BodyMeasurement({ user: oid(), measurements: { peito: 'grande' } });
    expect(m.validateSync()).toBeDefined();
  });

  it('rejects a negative weight', () => {
    const m = new BodyMeasurement({ user: oid(), weight: -1 });
    expect(m.validateSync()).toBeDefined();
  });

  it('indexes user', () => {
    expect(BodyMeasurement.schema.path('user').options.index).toBe(true);
  });
});
