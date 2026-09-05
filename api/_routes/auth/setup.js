import { connectDB } from '../../_lib/db.js';
import User from '../../_lib/models/User.js';
import bcrypt from 'bcryptjs';
import { applyCors } from '../../_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res, ['POST'])) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await connectDB();

  const count = await User.countDocuments();
  if (count > 0) return res.status(403).json({ error: 'Setup already done' });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email: email.toLowerCase(), password: hash });

  return res.status(201).json({ message: 'User created', email: user.email });
}
