import { describe, expect, it } from 'vitest';
import { calcCosts } from '../../api/_lib/recipeCosts.js';
import { isCents } from '../../api/_lib/money.js';

const ing = (cents, quantity) => ({ ingredient: { costPerUnitCents: cents }, quantity });

// Chocolate 32.90/kg x 0.35 + milk 8.79/L x 0.5 + butter 12.40/kg x 0.2 + eggs 0.70 x 6
const CAKE = {
  ingredients: [ing(3290, 0.35), ing(879, 0.5), ing(1240, 0.2), ing(70, 6)],
  laborCostCents: 2000,
  infraCostPercentage: null,
  sellingPriceCents: 7500,
};

describe('calcCosts', () => {
  it('returns every money value as integer cents', () => {
    const result = calcCosts(CAKE, 15, 50);
    for (const key of ['ingredientCostCents', 'infraCostCents', 'totalCostCents', 'suggestedPriceCents']) {
      expect(isCents(result[key]), `${key} is not integer cents: ${result[key]}`).toBe(true);
    }
  });

  it('matches the known cake to the cent', () => {
    const result = calcCosts(CAKE, 15, 50);
    expect(result.ingredientCostCents).toBe(2259);
    expect(result.infraCostCents).toBe(339);
    expect(result.totalCostCents).toBe(4598);
    expect(result.suggestedPriceCents).toBe(6897);
  });

  it('rounds once at the total, not per ingredient line', () => {
    // Three lines of 33.333 cents each: 100 if rounded once, 99 if rounded per line.
    const recipe = {
      ingredients: [ing(100, 0.33333), ing(100, 0.33333), ing(100, 0.33334)],
      laborCostCents: 0,
      infraCostPercentage: 0,
      sellingPriceCents: 0,
    };
    expect(calcCosts(recipe, 0, 0).ingredientCostCents).toBe(100);
  });

  it('lets the recipe percentage override the default', () => {
    const withOwn = calcCosts({ ...CAKE, infraCostPercentage: 30 }, 15, 50);
    expect(withOwn.infraCostCents).toBe(678);
  });

  it('falls back to the default percentage when the recipe has none', () => {
    expect(calcCosts({ ...CAKE, infraCostPercentage: null }, 15, 50).infraCostCents).toBe(339);
    expect(calcCosts({ ...CAKE, infraCostPercentage: undefined }, 15, 50).infraCostCents).toBe(339);
  });

  it('keeps a zero percentage instead of falling back', () => {
    expect(calcCosts({ ...CAKE, infraCostPercentage: 0 }, 15, 50).infraCostCents).toBe(0);
  });

  it('sums total as ingredient plus infra plus labor', () => {
    const result = calcCosts(CAKE, 15, 50);
    expect(result.totalCostCents)
      .toBe(result.ingredientCostCents + result.infraCostCents + CAKE.laborCostCents);
  });

  it('computes margin as a percentage of the selling price', () => {
    const result = calcCosts(CAKE, 15, 50);
    expect(result.margin).toBeCloseTo(((7500 - 4598) / 7500) * 100, 6);
  });

  it('returns null margin when there is no selling price', () => {
    expect(calcCosts({ ...CAKE, sellingPriceCents: 0 }, 15, 50).margin).toBeNull();
  });

  it('handles a recipe with no ingredients', () => {
    const result = calcCosts({ ingredients: [], laborCostCents: 0, sellingPriceCents: 0 }, 15, 50);
    expect(result.ingredientCostCents).toBe(0);
    expect(result.totalCostCents).toBe(0);
    expect(result.margin).toBeNull();
  });

  it('tolerates an unpopulated ingredient reference', () => {
    const result = calcCosts({
      ingredients: [{ ingredient: null, quantity: 2 }, ing(100, 1)],
      laborCostCents: 0,
      sellingPriceCents: 0,
    }, 0, 0);
    expect(result.ingredientCostCents).toBe(100);
  });

  it('treats missing labor cost as zero', () => {
    const result = calcCosts({ ingredients: [ing(100, 1)], sellingPriceCents: 0 }, 0, 0);
    expect(result.totalCostCents).toBe(100);
  });
});
