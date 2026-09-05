import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { globSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

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

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

const MODELS = [
  Ingredient, Order, Recipe, Settings, Customer, User,
  Exercise, Routine, WorkoutLog, BodyMeasurement,
];

// path name -> referenced model name, gathered from every schema including
// subdocuments. Each Vercel function is bundled on its own, so a handler that
// populates a ref without importing its model throws MissingSchemaError.
function buildRefMap() {
  const map = new Map();
  const seen = new Map();

  const record = (path, ref) => {
    if (!ref) return;
    seen.set(path, (seen.get(path) || new Set()).add(ref));
    map.set(path, ref);
  };

  for (const model of MODELS) {
    model.schema.eachPath((path, type) => {
      record(path, type.options?.ref);
      if (type.schema) {
        type.schema.eachPath((sub, subType) => record(`${path}.${sub}`, subType.options?.ref));
      }
    });
  }

  for (const [path, refs] of seen) {
    if (refs.size > 1) {
      throw new Error(`path "${path}" resolves to more than one model: ${[...refs].join(', ')}`);
    }
  }

  return map;
}

const REF_BY_PATH = buildRefMap();

function populatedPaths(source) {
  const paths = new Set();
  for (const match of source.matchAll(/populate\(\s*'([^']+)'/g)) paths.add(match[1]);
  for (const match of source.matchAll(/path:\s*'([^']+)'/g)) paths.add(match[1]);
  return [...paths];
}

const handlers = globSync('api/**/*.js', { cwd: root })
  .filter((f) => !f.startsWith('api/_lib/'))
  .map((f) => f.split('\\').join('/'));

const withPopulate = handlers.filter((f) => readFileSync(join(root, f), 'utf8').includes('populate('));

describe('populate registration', () => {
  it('finds the handlers that populate', () => {
    expect(withPopulate.length).toBeGreaterThan(0);
  });

  it('every populated path maps to a known model', () => {
    for (const file of withPopulate) {
      for (const path of populatedPaths(readFileSync(join(root, file), 'utf8'))) {
        expect(REF_BY_PATH.has(path), `${file} populates "${path}" but no schema declares that ref`).toBe(true);
      }
    }
  });
});

describe.each(withPopulate)('%s', (file) => {
  const source = readFileSync(join(root, file), 'utf8');

  it('imports every model it populates', () => {
    for (const path of populatedPaths(source)) {
      const modelName = REF_BY_PATH.get(path);
      if (!modelName) continue;
      expect(
        source.includes(`models/${modelName}.js`),
        `${file} populates "${path}" (model ${modelName}) but never imports models/${modelName}.js`,
      ).toBe(true);
    }
  });
});
