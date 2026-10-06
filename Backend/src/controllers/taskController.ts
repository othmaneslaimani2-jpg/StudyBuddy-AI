import { Response } from 'express';
import { Task, Subject } from '../models';
import { AuthRequest } from '../types';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const tasks = await Task.findAll({
      include: [
        {
          model: Subject,
          where: { userId },
          attributes: ['id', 'title', 'color'],
        },
      ],
      order: [['dueDate', 'ASC']],
    });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const { title, dueDate, subjectId } = req.body;
    if (!title || !dueDate || !subjectId) {
      return res.status(400).json({ error: 'Title, dueDate, and subjectId are required.' });
    }

    const subject = await Subject.findOne({ where: { id: subjectId, userId } });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found.' });
    }

    const task = await Task.create({
      title,
      dueDate: new Date(dueDate),
      subjectId,
    });
    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create task.' });
  }
};

export default {
  getTasks,
  createTask,
};
