import { Response } from 'express';
import { User } from '../models';
import { AuthRequest } from '../types';

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { fullName } = req.body;
    if (!fullName) return res.status(400).json({ error: 'Name is required' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.fullName = fullName;
    await user.save();

    return res.json({ message: 'Profile updated successfully', user: { id: user.id, fullName: user.fullName, email: user.email } });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};
