import { roundCents } from './money.js';

// Rounding happens once per derived value, never per ingredient line: this is a
// cost calculator, not an invoice, so per-line rounding would introduce a
// systematic error that grows with the number of ingredients.
//
// infraCostCents derives from the already-rounded ingredientCostCents so that
// totalCostCents === ingredientCostCents + infraCostCents + laborCostCents holds
// exactly for the numbers shown on screen.
export function calcCosts(recipe, defaultInfraPercentage, defaultMargin) {
  const exactIngredientCents = (recipe.ingredients || []).reduce((sum, item) => {
    const cents = item.ingredient?.costPerUnitCents || 0;
    return sum + cents * item.quantity;
  }, 0);

  const ingredientCostCents = roundCents(exactIngredientCents);

  const infraPercentage = recipe.infraCostPercentage ?? defaultInfraPercentage;
  const infraCostCents = roundCents(ingredientCostCents * (infraPercentage / 100));

  const totalCostCents = ingredientCostCents + infraCostCents + (recipe.laborCostCents || 0);
  const suggestedPriceCents = roundCents(totalCostCents * (1 + defaultMargin / 100));

  const margin = recipe.sellingPriceCents > 0
    ? ((recipe.sellingPriceCents - totalCostCents) / recipe.sellingPriceCents) * 100
    : null;

  return { ingredientCostCents, infraCostCents, totalCostCents, suggestedPriceCents, margin };
}
