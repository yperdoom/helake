import { describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import Ingredient from '../../../api/lib/models/Ingredient.js';
import Order from '../../../api/lib/models/Order.js';
import Recipe from '../../../api/lib/models/Recipe.js';
import Settings from '../../../api/lib/models/Settings.js';

const oid = () => new mongoose.Types.ObjectId().toString();

const FIELDS = [
  ['Ingredient', Ingredient, 'costPerUnitCents', 'costPerUnit'],
  ['Recipe', Recipe, 'laborCostCents', 'laborCost'],
  ['Recipe', Recipe, 'sellingPriceCents', 'sellingPrice'],
  ['Order', Order, 'paidPriceCents', 'paidPrice'],
  ['Settings', Settings, 'gasCents', 'gas'],
  ['Settings', Settings, 'electricityCents', 'electricity'],
  ['Settings', Settings, 'waterCents', 'water'],
  ['Settings', Settings, 'otherCents', 'other'],
];

describe.each(FIELDS)('%s.%s', (_name, Model, newField, oldField) => {
  it('exists on the schema', () => {
    expect(Model.schema.path(newField)).toBeDefined();
  });

  it('no longer exposes the reais field', () => {
    expect(Model.schema.path(oldField)).toBeUndefined();
  });

  it('rejects a fractional value', () => {
    const doc = new Model({});
    doc.set(newField, 32.9);
    const error = doc.validateSync();
    expect(error?.errors?.[newField], `${newField} accepted a fractional value`).toBeDefined();
  });

  it('rejects a negative value', () => {
    const doc = new Model({});
    doc.set(newField, -1);
    expect(doc.validateSync()?.errors?.[newField]).toBeDefined();
  });

  it('accepts an integer', () => {
    const doc = new Model({});
    doc.set(newField, 3290);
    expect(doc.validateSync()?.errors?.[newField]).toBeUndefined();
    expect(doc.get(newField)).toBe(3290);
  });
});

describe('non-money fields keep fractional values', () => {
  it('Ingredient stock stays fractional', () => {
    const doc = new Ingredient({ name: 'Chocolate', unit: 'kg', costPerUnitCents: 3290, currentStock: 0.35 });
    expect(doc.validateSync()).toBeUndefined();
    expect(doc.currentStock).toBe(0.35);
  });

  it('Recipe ingredient quantity stays fractional', () => {
    const doc = new Recipe({
      name: 'Cake', yield: 1,
      ingredients: [{ ingredient: oid(), quantity: 0.35 }],
    });
    expect(doc.validateSync()).toBeUndefined();
    expect(doc.ingredients[0].quantity).toBe(0.35);
  });

  it('percentages stay fractional', () => {
    const doc = new Recipe({ name: 'Cake', yield: 1, infraCostPercentage: 12.5 });
    expect(doc.validateSync()).toBeUndefined();
    expect(doc.infraCostPercentage).toBe(12.5);
  });
});
