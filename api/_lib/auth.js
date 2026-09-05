import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error('JWT_SECRET is not set');

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '30d' });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

export function requireAuth(req, res) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  try {
    return verifyToken(token);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
    return null;
  }
}

export function requireAdmin(req, res) {
  const auth = requireAuth(req, res);
  if (!auth) return null;

  if (auth.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }

  return auth;
}
