import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    if (await User.findOne({ where: { email } })) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashedPassword });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d', });

    return res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email },
    });
  } catch {
    return res.status(500).json({ error: 'Server error during registration.' });
  }
};

export const register = signup;
export default signup;
