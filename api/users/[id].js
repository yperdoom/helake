import bcrypt from 'bcryptjs';
import { connectDB } from '../lib/db.js';
import User from '../lib/models/User.js';
import { applyCors } from '../lib/cors.js';
import { requireAdmin } from '../lib/auth.js';

async function isLastAdmin(user) {
  if (user.role !== 'admin') return false;
  const admins = await User.countDocuments({ role: 'admin' });
  return admins <= 1;
}

export default async function handler(req, res) {
  if (applyCors(req, res, ['PUT', 'DELETE'])) return;

  const auth = requireAdmin(req, res);
  if (!auth) return;

  await connectDB();
  const { id } = req.query;

  if (req.method === 'PUT') {
    const target = await User.findById(id);
    if (!target) return res.status(404).json({ error: 'Not found' });

    const { name, role, password } = req.body || {};

    if (role && role !== 'admin' && await isLastAdmin(target)) {
      return res.status(400).json({ error: 'Cannot demote the last admin' });
    }

    const update = {};
    if (name !== undefined) update.name = name;
    if (role !== undefined) update.role = role;
    if (password) update.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .select('-password');
    return res.status(200).json({ user });
  }

  if (req.method === 'DELETE') {
    if (String(id) === String(auth.userId)) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const target = await User.findById(id);
    if (!target) return res.status(404).json({ error: 'Not found' });

    if (await isLastAdmin(target)) {
      return res.status(400).json({ error: 'Cannot delete the last admin' });
    }

    await User.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
