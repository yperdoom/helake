// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { jsonResponse, makeVm } from './vm.js';

vi.mock('@/lib/api.js', () => ({ apiFetch: vi.fn() }));

const { default: Ingredients } = await import('../../src/pages/Ingredients/Ingredients.js');
const { default: Recipes } = await import('../../src/pages/Recipes/Recipes.js');
const { default: Orders } = await import('../../src/pages/Orders/Orders.js');
const { default: Settings } = await import('../../src/pages/Settings/Settings.js');
const { apiFetch } = await import('@/lib/api.js');

const sentBody = () => {
  const call = apiFetch.mock.calls.find(([, o]) => o?.body);
  return JSON.parse(call[1].body);
};

beforeEach(() => {
  vi.clearAllMocks();
  apiFetch.mockResolvedValue(jsonResponse({
    ingredients: [], recipes: [], orders: [], customers: [], settings: {},
  }));
});

describe('Ingredients money boundary', () => {
  it('sends cents, not reais', async () => {
    const vm = makeVm(Ingredients);
    vm.form.costPerUnit = 32.9;
    await vm.save();

    const body = sentBody();
    expect(body.costPerUnitCents).toBe(3290);
    expect(body.costPerUnit).toBeUndefined();
  });

  it('shows reais in the form when editing', () => {
    const vm = makeVm(Ingredients);
    vm.openModal({ _id: 'i1', name: 'Chocolate', category: 'Chocolate', unit: 'kg', costPerUnitCents: 3290, currentStock: 1, minimumStock: 0 });
    expect(vm.form.costPerUnit).toBe(32.9);
  });

  it('formats cents as currency', () => {
    const vm = makeVm(Ingredients);
    expect(vm.fmtCurrency(3290)).toContain('32,90');
  });
});

describe('Recipes money boundary', () => {
  it('sends labor cost and selling price in cents', async () => {
    const vm = makeVm(Recipes);
    vm.form.laborCost = 20;
    vm.form.sellingPrice = 75.5;
    await vm.save();

    const body = sentBody();
    expect(body.laborCostCents).toBe(2000);
    expect(body.sellingPriceCents).toBe(7550);
    expect(body.laborCost).toBeUndefined();
    expect(body.sellingPrice).toBeUndefined();
  });

  it('shows reais in the form when editing', () => {
    const vm = makeVm(Recipes);
    vm.openModal({
      _id: 'r1', name: 'Cake', category: 'Cakes', yield: 1, yieldUnit: 'un',
      laborCostCents: 2000, sellingPriceCents: 7550, infraCostPercentage: null, ingredients: [],
    });
    expect(vm.form.laborCost).toBe(20);
    expect(vm.form.sellingPrice).toBe(75.5);
  });

  it('does not convert the percentage', async () => {
    const vm = makeVm(Recipes);
    vm.form.infraCostPercentage = 15;
    await vm.save();
    expect(sentBody().infraCostPercentage).toBe(15);
  });
});

describe('Orders money boundary', () => {
  it('sends paid price in cents', async () => {
    const vm = makeVm(Orders);
    vm.form.paidPrice = 75;
    await vm.save();

    const body = sentBody();
    expect(body.paidPriceCents).toBe(7500);
    expect(body.paidPrice).toBeUndefined();
  });

  it('shows reais in the form when editing', () => {
    const vm = makeVm(Orders);
    vm.openModal({ _id: 'o1', quantity: 1, deliveryDate: null, paidPriceCents: 7500, notes: '' });
    expect(vm.form.paidPrice).toBe(75);
  });

  it('does not convert the quantity', async () => {
    const vm = makeVm(Orders);
    vm.form.quantity = 3;
    await vm.save();
    expect(sentBody().quantity).toBe(3);
  });
});

describe('Settings money boundary', () => {
  it('sends the utility bills in cents', async () => {
    const vm = makeVm(Settings);
    vm.form.gas = 120.5;
    vm.form.electricity = 340;
    vm.form.water = 80.25;
    vm.form.other = 0;
    await vm.save();

    const body = sentBody();
    expect(body.gasCents).toBe(12050);
    expect(body.electricityCents).toBe(34000);
    expect(body.waterCents).toBe(8025);
    expect(body.otherCents).toBe(0);
    expect(body.gas).toBeUndefined();
  });

  it('does not convert hours or percentages', async () => {
    const vm = makeVm(Settings);
    vm.form.monthlyHours = 160;
    vm.form.defaultMargin = 50;
    vm.form.defaultInfraPercentage = 15;
    await vm.save();

    const body = sentBody();
    expect(body.monthlyHours).toBe(160);
    expect(body.defaultMargin).toBe(50);
    expect(body.defaultInfraPercentage).toBe(15);
  });

  it('shows reais in the form when loading', async () => {
    apiFetch.mockResolvedValue(jsonResponse({
      settings: { gasCents: 12050, electricityCents: 34000, waterCents: 8025, otherCents: 0 },
    }));
    const vm = makeVm(Settings);
    await Settings.mounted.call(vm);

    expect(vm.form.gas).toBe(120.5);
    expect(vm.form.water).toBe(80.25);
  });
});
