import { Response } from 'express';
import { Subject, Task, Note } from '../models';
import { AuthRequest } from '../types';

export const getSubjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const subjects = await Subject.findAll({
      where: { userId },
      include: [Task, Note],
    });
    return res.json(subjects);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch subjects.' });
  }
};

export const createSubject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const { title, color } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Subject title is required.' });
    }

    const subject = await Subject.create({
      title,
      color: color || '#4F46E5',
      userId,
    });

    return res.status(201).json(subject);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create subject.' });
  }
};

export default {
  getSubjects,
  createSubject,
};
