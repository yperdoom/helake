import mongoose from 'mongoose';
import { isCents } from '../money.js';

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
  laborCostCents: { type: Number, default: 0, min: 0, validate: { validator: isCents, message: '{PATH} must be an integer amount in cents' } },
  infraCostPercentage: { type: Number, default: null },
  sellingPriceCents: { type: Number, default: 0, min: 0, validate: { validator: isCents, message: '{PATH} must be an integer amount in cents' } },
}, { timestamps: true });

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
