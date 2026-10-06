import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

    return res.json({
      message: 'Login successful!',
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error during login.' });
  }
};

export default login;
