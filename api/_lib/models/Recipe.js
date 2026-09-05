import mongoose from 'mongoose';
import { centsField } from '../money.js';

const RecipeIngredientSchema = new mongoose.Schema({
  ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
  quantity: { type: Number, required: true, min: 0 },
}, { _id: false });

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Cakes', 'Sweets', 'Breads', 'Pastries', 'Other'],
    default: 'Other',
  },
  yield: { type: Number, required: true },
  yieldUnit: { type: String, default: 'un' },
  ingredients: [RecipeIngredientSchema],
  laborCostCents: centsField({ default: 0 }),
  infraCostPercentage: { type: Number, default: null },
  sellingPriceCents: centsField({ default: 0 }),
}, { timestamps: true });

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
