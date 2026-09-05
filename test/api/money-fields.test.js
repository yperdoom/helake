import { describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import { isCents } from '../../api/_lib/money.js';

import Ingredient from '../../api/_lib/models/Ingredient.js';
import Order from '../../api/_lib/models/Order.js';
import Recipe from '../../api/_lib/models/Recipe.js';
import Settings from '../../api/_lib/models/Settings.js';
import Customer from '../../api/_lib/models/Customer.js';
import User from '../../api/_lib/models/User.js';
import Exercise from '../../api/_lib/models/Exercise.js';
import Routine from '../../api/_lib/models/Routine.js';
import WorkoutLog from '../../api/_lib/models/WorkoutLog.js';
import BodyMeasurement from '../../api/_lib/models/BodyMeasurement.js';

const MODELS = [
  Ingredient, Order, Recipe, Settings, Customer, User,
  Exercise, Routine, WorkoutLog, BodyMeasurement,
];

// Names that mean money. A field named like this must carry the Cents suffix and
// the integer validator, otherwise it is a float amount and the bug is back.
const MONEY_WORDS = /(price|cost|amount|fee|total|revenue|spent|paid)/i;

// Not money despite matching MONEY_WORDS. Each entry must be a deliberate call.
const NOT_MONEY = new Set([
  'infraCostPercentage',        // percentage
  'defaultInfraPercentage',     // percentage
]);

function moneyPaths(model) {
  const found = [];
  model.schema.eachPath((path, type) => {
    found.push([path, type]);
    if (type.schema) {
      type.schema.eachPath((sub, subType) => found.push([`${path}.${sub}`, subType]));
    }
  });
  return found;
}

describe.each(MODELS.map((m) => [m.modelName, m]))('%s', (_name, model) => {
  const paths = moneyPaths(model);

  it('every field with a money-ish name ends in Cents', () => {
    for (const [path, type] of paths) {
      const leaf = path.split('.').pop();
      if (NOT_MONEY.has(leaf) || !MONEY_WORDS.test(leaf)) continue;
      expect(leaf.endsWith('Cents'), `${model.modelName}.${path} looks like money but has no Cents suffix`).toBe(true);
      expect(type.instance).toBe('Number');
    }
  });

  it('every Cents field validates as integer cents', () => {
    for (const [path, type] of paths) {
      const leaf = path.split('.').pop();
      if (!leaf.endsWith('Cents')) continue;

      const validators = type.validators || [];
      const hasCentsValidator = validators.some((v) => v.validator === isCents);
      expect(hasCentsValidator, `${model.modelName}.${path} has no isCents validator`).toBe(true);
    }
  });
});

describe('allowlist hygiene', () => {
  it('every NOT_MONEY entry still exists on some schema', () => {
    const leaves = new Set();
    for (const model of MODELS) {
      for (const [path] of moneyPaths(model)) leaves.add(path.split('.').pop());
    }
    for (const entry of NOT_MONEY) {
      expect(leaves.has(entry), `${entry} is allowlisted but no longer exists`).toBe(true);
    }
  });
});
