import { connectDB } from '../_lib/db.js';
import Exercise from '../_lib/models/Exercise.js';
import { applyCors } from '../_lib/cors.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (applyCors(req, res, ['GET', 'POST'])) return;

  if (!requireAuth(req, res)) return;

  await connectDB();

  if (req.method === 'GET') {
    const exercises = await Exercise.find().sort({ name: 1 }).lean();
    return res.status(200).json({ exercises });
  }

  if (req.method === 'POST') {
    const exercise = await Exercise.create(req.body);
    return res.status(201).json({ exercise });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
