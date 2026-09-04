import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bearer, mockRes, query } from '../helpers.js';

vi.mock('../../api/lib/db.js', () => ({ connectDB: vi.fn() }));
vi.mock('../../api/lib/models/Order.js', () => ({
  default: { find: vi.fn(), aggregate: vi.fn() },
}));
vi.mock('../../api/lib/models/Customer.js', () => ({
  default: { find: vi.fn(), create: vi.fn() },
}));
vi.mock('../../api/lib/models/Ingredient.js', () => ({
  default: { find: vi.fn() },
}));

const { default: dashboard } = await import('../../api/dashboard.js');
const { default: customers } = await import('../../api/customers.js');
const { default: Order } = await import('../../api/lib/models/Order.js');
const { default: Customer } = await import('../../api/lib/models/Customer.js');
const { default: Ingredient } = await import('../../api/lib/models/Ingredient.js');

// A wrong field name in an aggregation is silent: Mongo returns nothing and the
// value shows as zero forever. These tests pin the field name in the pipeline.
function pipelineText(mock) {
  return JSON.stringify(mock.mock.calls[0][0]);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/dashboard', () => {
  it('sums revenue over paidPriceCents and returns it as cents', async () => {
    Order.find.mockReturnValue(query([]));
    Ingredient.find.mockReturnValue(query([]));
    Order.aggregate.mockResolvedValue([{ total: 123456 }]);

    const res = mockRes();
    await dashboard({ method: 'GET', headers: bearer('u1') }, res);

    expect(pipelineText(Order.aggregate)).toContain('$paidPriceCents');
    expect(pipelineText(Order.aggregate)).not.toContain('$paidPrice"');
    expect(res.body.revenueThisMonthCents).toBe(123456);
  });

  it('returns zero cents when there is no revenue', async () => {
    Order.find.mockReturnValue(query([]));
    Ingredient.find.mockReturnValue(query([]));
    Order.aggregate.mockResolvedValue([]);

    const res = mockRes();
    await dashboard({ method: 'GET', headers: bearer('u1') }, res);
    expect(res.body.revenueThisMonthCents).toBe(0);
  });

  it('projects the cents field when populating ingredients', async () => {
    Order.find.mockReturnValue(query([]));
    Ingredient.find.mockReturnValue(query([]));
    Order.aggregate.mockResolvedValue([]);

    const populate = vi.fn();
    const chain = { populate, sort: () => chain, lean: () => Promise.resolve([]) };
    populate.mockReturnValue(chain);
    Order.find.mockReturnValue(chain);

    await dashboard({ method: 'GET', headers: bearer('u1') }, mockRes());

    expect(JSON.stringify(populate.mock.calls)).toContain('costPerUnitCents');
  });
});

describe('GET /api/customers', () => {
  it('sums totalSpent over paidPriceCents and returns it as cents', async () => {
    Customer.find.mockReturnValue(query([{ _id: { toString: () => 'c1' } }]));
    Order.aggregate.mockResolvedValue([
      { _id: { toString: () => 'c1' }, totalOrders: 2, totalSpentCents: 9900, lastOrder: null },
    ]);

    const res = mockRes();
    await customers({ method: 'GET', headers: bearer('u1') }, res);

    expect(pipelineText(Order.aggregate)).toContain('$paidPriceCents');
    expect(res.body.customers[0].totalSpentCents).toBe(9900);
  });

  it('returns zero cents for a customer with no orders', async () => {
    Customer.find.mockReturnValue(query([{ _id: { toString: () => 'c2' } }]));
    Order.aggregate.mockResolvedValue([]);

    const res = mockRes();
    await customers({ method: 'GET', headers: bearer('u1') }, res);
    expect(res.body.customers[0].totalSpentCents).toBe(0);
  });
});
