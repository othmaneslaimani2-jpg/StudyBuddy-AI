import { Request, Response, NextFunction } from 'express';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const authValidation = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, fullName } = req.body;
  const isSignup = req.path === '/signup' || req.path === '/register';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (isSignup && !fullName) {
    return res.status(400).json({ error: 'Full name is required.' });
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

export default authValidation;
