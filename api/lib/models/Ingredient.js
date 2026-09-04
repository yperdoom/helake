import mongoose from 'mongoose';
import { isCents } from '../money.js';

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Dry Goods', 'Dairy', 'Chocolate', 'Spices', 'Packaging', 'Other'],
    default: 'Other',
  },
  unit: {
    type: String,
    enum: ['kg', 'g', 'un', 'L', 'ml', 'dz'],
    required: true,
  },
  costPerUnitCents: {
    type: Number,
    required: true,
    min: 0,
    validate: { validator: isCents, message: '{PATH} must be an integer amount in cents' },
  },
  currentStock: { type: Number, default: 0, min: 0 },
  minimumStock: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

export default mongoose.models.Ingredient || mongoose.model('Ingredient', IngredientSchema);
