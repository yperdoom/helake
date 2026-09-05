import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { bearer, mockRes } from '../helpers.js';

// These run against a real mongod. They exist to cover what mocked models cannot:
// validators firing on save, Map serialization through lean(), aggregation
// pipelines actually matching field names, and cross-user isolation.

let mongo;

const oid = () => new mongoose.Types.ObjectId().toString();
const USER_A = oid();
const USER_B = oid();

let Ingredient, Recipe, Order, Settings, User, Routine, WorkoutLog, BodyMeasurement;
let ingredients, ingredientById, recipes, orders, dashboard, customers, settings;
let routines, routineById, workoutLogs, measurements, users, usersById;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri('helake-test');

  ({ default: Ingredient } = await import('../../api/_lib/models/Ingredient.js'));
  ({ default: Recipe } = await import('../../api/_lib/models/Recipe.js'));
  ({ default: Order } = await import('../../api/_lib/models/Order.js'));
  ({ default: Settings } = await import('../../api/_lib/models/Settings.js'));
  ({ default: User } = await import('../../api/_lib/models/User.js'));
  ({ default: Routine } = await import('../../api/_lib/models/Routine.js'));
  ({ default: WorkoutLog } = await import('../../api/_lib/models/WorkoutLog.js'));
  ({ default: BodyMeasurement } = await import('../../api/_lib/models/BodyMeasurement.js'));

  ({ default: ingredients } = await import('../../api/_routes/ingredients.js'));
  ({ default: ingredientById } = await import('../../api/_routes/ingredients/[id].js'));
  ({ default: recipes } = await import('../../api/_routes/recipes.js'));
  ({ default: orders } = await import('../../api/_routes/orders.js'));
  ({ default: dashboard } = await import('../../api/_routes/dashboard.js'));
  ({ default: customers } = await import('../../api/_routes/customers.js'));
  ({ default: settings } = await import('../../api/_routes/settings.js'));
  ({ default: routines } = await import('../../api/_routes/routines.js'));
  ({ default: routineById } = await import('../../api/_routes/routines/[id].js'));
  ({ default: workoutLogs } = await import('../../api/_routes/workout-logs.js'));
  ({ default: measurements } = await import('../../api/_routes/measurements.js'));
  ({ default: users } = await import('../../api/_routes/users.js'));
  ({ default: usersById } = await import('../../api/_routes/users/[id].js'));
}, 300000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});

beforeEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const all = await mongoose.connection.db.collections();
    await Promise.all(all.map((c) => c.deleteMany({})));
  }
});

const call = async (handler, req) => {
  const res = mockRes();
  await handler({ query: {}, body: {}, ...req }, res);
  return res;
};

const asA = () => bearer(USER_A);
const asB = () => bearer(USER_B);
const asAdmin = () => bearer(USER_A, 'admin');

describe('money persists as integer cents', () => {
  it('stores and reads back the exact cents', async () => {
    const created = await call(ingredients, {
      method: 'POST', headers: asA(),
      body: { name: 'Chocolate', category: 'Chocolate', unit: 'kg', costPerUnitCents: 3290 },
    });
    expect(created.statusCode).toBe(201);

    const listed = await call(ingredients, { method: 'GET', headers: asA() });
    expect(listed.body.ingredients[0].costPerUnitCents).toBe(3290);
    expect(Number.isInteger(listed.body.ingredients[0].costPerUnitCents)).toBe(true);
  });

  it('rejects fractional cents on write, not just in the schema object', async () => {
    await expect(
      Ingredient.create({ name: 'Bad', unit: 'kg', costPerUnitCents: 32.9 }),
    ).rejects.toThrow(/integer amount in cents/);
  });

  it('rejects fractional cents through the update endpoint', async () => {
    const doc = await Ingredient.create({ name: 'Milk', unit: 'L', costPerUnitCents: 879 });
    await expect(
      call(ingredientById, {
        method: 'PUT', headers: asA(),
        query: { id: doc._id.toString() }, body: { costPerUnitCents: 8.79 },
      }),
    ).rejects.toThrow(/integer amount in cents/);
  });
});

describe('recipe costs against real populate', () => {
  it('computes the cake to the cent end to end', async () => {
    const [choc, milk, butter, egg] = await Ingredient.create([
      { name: 'Chocolate', unit: 'kg', costPerUnitCents: 3290 },
      { name: 'Milk', unit: 'L', costPerUnitCents: 879 },
      { name: 'Butter', unit: 'kg', costPerUnitCents: 1240 },
      { name: 'Egg', unit: 'un', costPerUnitCents: 70 },
    ]);

    await Recipe.create({
      name: 'Chocolate Cake', category: 'Cakes', yield: 1,
      laborCostCents: 2000, sellingPriceCents: 7500,
      ingredients: [
        { ingredient: choc._id, quantity: 0.35 },
        { ingredient: milk._id, quantity: 0.5 },
        { ingredient: butter._id, quantity: 0.2 },
        { ingredient: egg._id, quantity: 6 },
      ],
    });

    const res = await call(recipes, { method: 'GET', headers: asA() });
    const recipe = res.body.recipes[0];

    expect(recipe.ingredientCostCents).toBe(2259);
    expect(recipe.infraCostCents).toBe(339);
    expect(recipe.totalCostCents).toBe(4598);
    expect(recipe.suggestedPriceCents).toBe(6897);
    expect(recipe.margin).toBeCloseTo(38.6933, 3);
  });
});

describe('aggregations match the real field names', () => {
  it('sums monthly revenue over paidPriceCents', async () => {
    const customer = await mongoose.connection.collection('customers')
      .insertOne({ name: 'Ana', phone: '', notes: '' });
    const recipe = await Recipe.create({ name: 'Cake', yield: 1 });

    await Order.create([
      { customer: customer.insertedId, recipe: recipe._id, quantity: 1, deliveryDate: new Date(), status: 'delivered', paidPriceCents: 7500 },
      { customer: customer.insertedId, recipe: recipe._id, quantity: 1, deliveryDate: new Date(), status: 'delivered', paidPriceCents: 4250 },
      { customer: customer.insertedId, recipe: recipe._id, quantity: 1, deliveryDate: new Date(), status: 'new', paidPriceCents: 9999 },
    ]);

    const res = await call(dashboard, { method: 'GET', headers: asA() });
    expect(res.body.revenueThisMonthCents).toBe(11750);
  });

  it('sums customer spend over paidPriceCents', async () => {
    const customer = await mongoose.connection.collection('customers')
      .insertOne({ name: 'Ana', phone: '', notes: '' });
    const recipe = await Recipe.create({ name: 'Cake', yield: 1 });

    await Order.create([
      { customer: customer.insertedId, recipe: recipe._id, quantity: 1, deliveryDate: new Date(), paidPriceCents: 5000 },
      { customer: customer.insertedId, recipe: recipe._id, quantity: 1, deliveryDate: new Date(), paidPriceCents: 2500 },
    ]);

    const res = await call(customers, { method: 'GET', headers: asA() });
    expect(res.body.customers[0].totalSpentCents).toBe(7500);
    expect(res.body.customers[0].totalOrders).toBe(2);
  });
});

describe('settings singleton', () => {
  it('creates the singleton with zeroed cents', async () => {
    const res = await call(settings, { method: 'GET', headers: asA() });
    expect(res.statusCode).toBe(200);
    expect(res.body.settings.gasCents).toBe(0);
    expect(res.body.settings._id).toBe('global');
  });

  it('persists the utility bills as cents', async () => {
    await Settings.getOrCreate();
    await Settings.findByIdAndUpdate('global', { gasCents: 12050, waterCents: 8025 });

    const res = await call(settings, { method: 'GET', headers: asA() });
    expect(res.body.settings.gasCents).toBe(12050);
    expect(res.body.settings.waterCents).toBe(8025);
  });
});

describe('measurements Map survives lean()', () => {
  it('returns arbitrary measurements as a plain JSON object', async () => {
    await call(measurements, {
      method: 'POST', headers: asA(),
      body: { weight: 82.5, measurements: { waist: 84, arm: 36 } },
    });

    const res = await call(measurements, { method: 'GET', headers: asA() });
    const record = res.body.measurements[0];

    // The concern: a Mongoose Map could serialize to {} through JSON.
    expect(JSON.parse(JSON.stringify(record)).measurements).toEqual({ waist: 84, arm: 36 });
    expect(record.weight).toBe(82.5);
  });
});

describe('cross-user isolation with a real database', () => {
  it('does not leak routines between users', async () => {
    await call(routines, { method: 'POST', headers: asA(), body: { name: 'Workout A' } });
    await call(routines, { method: 'POST', headers: asB(), body: { name: 'Workout B' } });

    const forA = await call(routines, { method: 'GET', headers: asA() });
    const forB = await call(routines, { method: 'GET', headers: asB() });

    expect(forA.body.routines.map((r) => r.name)).toEqual(['Workout A']);
    expect(forB.body.routines.map((r) => r.name)).toEqual(['Workout B']);
  });

  it('refuses to update another user routine and leaves it untouched', async () => {
    const created = await call(routines, { method: 'POST', headers: asA(), body: { name: 'Workout A' } });
    const id = created.body.routine._id.toString();

    const attempt = await call(routineById, {
      method: 'PUT', headers: asB(), query: { id }, body: { name: 'hacked' },
    });

    expect(attempt.statusCode).toBe(404);
    const untouched = await Routine.findById(id);
    expect(untouched.name).toBe('Workout A');
  });

  it('refuses to delete another user routine', async () => {
    const created = await call(routines, { method: 'POST', headers: asA(), body: { name: 'Workout A' } });
    const id = created.body.routine._id.toString();

    const attempt = await call(routineById, { method: 'DELETE', headers: asB(), query: { id } });
    expect(attempt.statusCode).toBe(404);
    expect(await Routine.countDocuments()).toBe(1);
  });

  it('ignores a forged user id in the body', async () => {
    const created = await call(routines, {
      method: 'POST', headers: asA(), body: { name: 'Workout A', user: USER_B },
    });
    const stored = await Routine.findById(created.body.routine._id);
    expect(stored.user.toString()).toBe(USER_A);
  });

  it('refuses a workout log pointing at another user routine', async () => {
    const created = await call(routines, { method: 'POST', headers: asA(), body: { name: 'Workout A' } });

    const attempt = await call(workoutLogs, {
      method: 'POST', headers: asB(),
      body: { routine: created.body.routine._id.toString() },
    });

    expect(attempt.statusCode).toBe(404);
    expect(await WorkoutLog.countDocuments()).toBe(0);
  });
});

describe('workout log history order', () => {
  it('returns the most recent first', async () => {
    const exercise = await mongoose.connection.collection('exercises')
      .insertOne({ name: 'Bench', muscleGroup: 'Chest', notes: '' });

    await WorkoutLog.create([
      { user: USER_A, date: new Date('2026-08-01'), entries: [{ exercise: exercise.insertedId, load: 60 }] },
      { user: USER_A, date: new Date('2026-09-01'), entries: [{ exercise: exercise.insertedId, load: 65 }] },
    ]);

    const res = await call(workoutLogs, { method: 'GET', headers: asA() });
    expect(res.body.logs.map((l) => l.entries[0].load)).toEqual([65, 60]);
  });
});

describe('user management against a real database', () => {
  it('hashes the password and never returns it', async () => {
    const created = await call(users, {
      method: 'POST', headers: asAdmin(),
      body: { email: 'Ela@B.com', password: 'secret', name: 'Ela' },
    });

    expect(created.statusCode).toBe(201);
    expect(JSON.stringify(created.body)).not.toContain('secret');

    const stored = await User.findOne({ email: 'ela@b.com' });
    expect(stored.password).not.toBe('secret');
    expect(stored.password).toMatch(/^\$2[aby]\$/);

    const listed = await call(users, { method: 'GET', headers: asAdmin() });
    expect(listed.body.users[0].password).toBeUndefined();
  });

  it('rejects a duplicate email', async () => {
    await call(users, { method: 'POST', headers: asAdmin(), body: { email: 'a@b.com', password: 'x' } });
    const again = await call(users, { method: 'POST', headers: asAdmin(), body: { email: 'a@b.com', password: 'y' } });
    expect(again.statusCode).toBe(409);
  });

  it('refuses to demote the only admin', async () => {
    const admin = await User.create({ email: 'admin@b.com', password: 'hash', role: 'admin' });

    const res = await call(usersById, {
      method: 'PUT', headers: bearer(admin._id.toString(), 'admin'),
      query: { id: admin._id.toString() }, body: { role: 'user' },
    });

    expect(res.statusCode).toBe(400);
    expect((await User.findById(admin._id)).role).toBe('admin');
  });

  it('refuses to delete your own account', async () => {
    const admin = await User.create({ email: 'admin@b.com', password: 'hash', role: 'admin' });

    const res = await call(usersById, {
      method: 'DELETE', headers: bearer(admin._id.toString(), 'admin'),
      query: { id: admin._id.toString() },
    });

    expect(res.statusCode).toBe(400);
    expect(await User.countDocuments()).toBe(1);
  });

  it('rejects a regular user even with a valid token', async () => {
    const res = await call(users, { method: 'GET', headers: asA() });
    expect(res.statusCode).toBe(403);
  });
});

describe('order stock adjustment', () => {
  it('decrements ingredient stock when production starts', async () => {
    const flour = await Ingredient.create({ name: 'Flour', unit: 'kg', costPerUnitCents: 500, currentStock: 10 });
    const recipe = await Recipe.create({
      name: 'Bread', yield: 1, ingredients: [{ ingredient: flour._id, quantity: 0.5 }],
    });
    const customer = await mongoose.connection.collection('customers')
      .insertOne({ name: 'Ana', phone: '', notes: '' });

    const created = await call(orders, {
      method: 'POST', headers: asA(),
      body: { customer: customer.insertedId, recipe: recipe._id, quantity: 4, deliveryDate: new Date(), paidPriceCents: 5000 },
    });

    const { default: orderById } = await import('../../api/_routes/orders/[id].js');
    await call(orderById, {
      method: 'PUT', headers: asA(),
      query: { id: created.body.order._id.toString() }, body: { status: 'in_production' },
    });

    expect((await Ingredient.findById(flour._id)).currentStock).toBe(8);
  });
});
