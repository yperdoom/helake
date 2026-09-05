import bcrypt from 'bcryptjs';
import { connectDB } from '../_lib/db.js';
import User from '../_lib/models/User.js';
import { applyCors } from '../_lib/cors.js';
import { requireAdmin } from '../_lib/auth.js';

const publicFields = (user) => ({
  _id: user._id,
  email: user.email,
  name: user.name,
  role: user.role,
});

export default async function handler(req, res) {
  if (applyCors(req, res, ['GET', 'POST'])) return;

  if (!requireAdmin(req, res)) return;

  await connectDB();

  if (req.method === 'GET') {
    const users = await User.find().select('-password').sort({ name: 1 }).lean();
    return res.status(200).json({ users });
  }

  if (req.method === 'POST') {
    const { email, password, name = '', role = 'user' } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const normalized = email.toLowerCase();
    const existing = await User.findOne({ email: normalized });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: normalized, password: hash, name, role });
    return res.status(201).json({ user: publicFields(user) });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
