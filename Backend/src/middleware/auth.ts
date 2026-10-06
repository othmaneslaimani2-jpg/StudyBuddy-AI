import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JwtUserPayload } from '../types';

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token missing.' });
  }

  const jwtSecret = process.env.JWT_SECRET || 'secret';

  jwt.verify(token, jwtSecret, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }

    req.user = decodedUser as JwtUserPayload;
    next();
  });
}

export default authenticateToken;
