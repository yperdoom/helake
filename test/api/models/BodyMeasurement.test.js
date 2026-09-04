import { describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import BodyMeasurement from '../../../api/lib/models/BodyMeasurement.js';

const oid = () => new mongoose.Types.ObjectId().toString();

describe('BodyMeasurement schema', () => {
  it('exige user', () => {
    const error = new BodyMeasurement({}).validateSync();
    expect(error?.errors?.user).toBeDefined();
  });

  it('usa a data de hoje por padrão', () => {
    const m = new BodyMeasurement({ user: oid() });
    expect(m.date).toBeInstanceOf(Date);
  });

  it('aceita medidas arbitrárias como números', () => {
    const m = new BodyMeasurement({
      user: oid(),
      weight: 82.5,
      measurements: { peito: 100, cintura: 84, braco: 36 },
    });
    expect(m.validateSync()).toBeUndefined();
    expect(m.measurements.get('cintura')).toBe(84);
  });

  it('rejeita medida não numérica', () => {
    const m = new BodyMeasurement({ user: oid(), measurements: { peito: 'grande' } });
    expect(m.validateSync()).toBeDefined();
  });

  it('rejeita peso negativo', () => {
    const m = new BodyMeasurement({ user: oid(), weight: -1 });
    expect(m.validateSync()).toBeDefined();
  });

  it('indexa user', () => {
    expect(BodyMeasurement.schema.path('user').options.index).toBe(true);
  });
});
