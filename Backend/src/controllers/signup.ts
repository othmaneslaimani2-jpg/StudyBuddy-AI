import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error during registration.' });
  }
};

export const register = signup;
export default signup;
