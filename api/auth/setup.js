import { connectDB } from '../lib/db.js';
import User from '../lib/models/User.js';
import bcrypt from 'bcryptjs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();
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
