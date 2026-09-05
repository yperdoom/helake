import { connectDB } from '../../_lib/db.js';
import Order from '../../_lib/models/Order.js';
import Ingredient from '../../_lib/models/Ingredient.js';
// Registered for populate() only: each Vercel function is bundled
// separately, so a ref whose model is never imported throws
// MissingSchemaError at query time.
import '../../_lib/models/Customer.js';
import '../../_lib/models/Recipe.js';
import { applyCors } from '../../_lib/cors.js';
import { requireAuth } from '../../_lib/auth.js';

async function adjustStock(recipe, orderQty, direction) {
  if (!recipe?.ingredients) return;
  const ops = recipe.ingredients.map((item) =>
    Ingredient.findByIdAndUpdate(item.ingredient, {
      $inc: { currentStock: direction * item.quantity * orderQty },
    })
  );
  await Promise.all(ops);
}

export default async function handler(req, res) {
  if (applyCors(req, res, ['PUT', 'DELETE'])) return;

  if (!requireAuth(req, res)) return;

  await connectDB();
  const { id } = req.query;

  if (req.method === 'PUT') {
    const current = await Order.findById(id).populate('recipe');
    if (!current) return res.status(404).json({ error: 'Not found' });

    const { status: newStatus } = req.body;

    if (newStatus && newStatus !== current.status) {
      if (newStatus === 'in_production' && current.status === 'new') {
        await adjustStock(current.recipe, current.quantity, -1);
      }
      if (newStatus === 'cancelled' && current.status === 'in_production') {
        await adjustStock(current.recipe, current.quantity, +1);
      }
    }

    const order = await Order.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      .populate('customer', 'name phone')
      .populate({ path: 'recipe', select: 'name category' });

    return res.status(200).json({ order });
  }

  if (req.method === 'DELETE') {
    await Order.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
