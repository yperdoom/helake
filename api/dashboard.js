import { connectDB } from './lib/db.js';
import Order from './lib/models/Order.js';
import Ingredient from './lib/models/Ingredient.js';
import { applyCors } from './lib/cors.js';
import { requireAuth } from './lib/auth.js';

export default async function handler(req, res) {
  if (applyCors(req, res, ['GET'])) return;

  if (!requireAuth(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  await connectDB();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [allActiveOrders, ingredients, revenueData] = await Promise.all([
    Order.find({ status: { $in: ['new', 'in_production', 'ready'] } })
      .populate('customer', 'name phone')
      .populate({ path: 'recipe', populate: { path: 'ingredients.ingredient', select: 'name unit costPerUnit currentStock minimumStock' } })
      .sort({ deliveryDate: 1 })
      .lean(),
    Ingredient.find().lean(),
    Order.aggregate([
      { $match: { status: 'delivered', deliveryDate: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$paidPrice' } } },
    ]),
  ]);

  const upcomingDeadlines = allActiveOrders.filter(
    (o) => new Date(o.deliveryDate) <= in7Days
  );

  const pendingOrders = allActiveOrders.filter((o) => o.status === 'new');

  const reserved = {};
  for (const order of pendingOrders) {
    if (!order.recipe?.ingredients) continue;
    for (const item of order.recipe.ingredients) {
      const ingId = item.ingredient?._id?.toString();
      if (!ingId) continue;
      reserved[ingId] = (reserved[ingId] || 0) + item.quantity * order.quantity;
    }
  }

  const ingredientAlerts = ingredients
    .map((ing) => {
      const res = reserved[ing._id.toString()] || 0;
      const projected = ing.currentStock - res;
      let severity = null;
      if (projected < 0) severity = 'critical';
      else if (projected < ing.minimumStock) severity = 'low';
      return severity ? { ingredient: ing, currentStock: ing.currentStock, projectedStock: projected, severity } : null;
    })
    .filter(Boolean)
    .sort((a, b) => (a.severity === 'critical' ? -1 : 1) - (b.severity === 'critical' ? -1 : 1));

  return res.status(200).json({
    activeOrders: allActiveOrders.length,
    revenueThisMonth: revenueData[0]?.total || 0,
    upcomingDeadlines,
    pendingOrders,
    ingredientAlerts,
  });
}
