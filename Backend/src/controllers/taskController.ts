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

    const { title, dueDate, subjectId, subject: subjectName, description, priority, reminder } = req.body;
    if (!title || !dueDate || (!subjectId && !subjectName)) {
      return res.status(400).json({ error: 'Title, dueDate, and subject are required.' });
    }

    let finalSubjectId = subjectId;
    if (!finalSubjectId && subjectName) {
      let subjectRecord = await Subject.findOne({ where: { title: subjectName, userId } });
      if (!subjectRecord) {
        subjectRecord = await Subject.create({
          title: subjectName,
          userId,
        });
      }
      finalSubjectId = subjectRecord.id;
    }

    const subject = await Subject.findOne({ where: { id: finalSubjectId, userId } });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found.' });
    }

    const task = await Task.create({
      title,
      dueDate: new Date(dueDate),
      subjectId: finalSubjectId,
      description,
      priority,
      reminder,
    });
    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create task.' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const taskId = req.params.id as string;
    const { isCompleted } = req.body;

    const task = await Task.findByPk(taskId, { include: [Subject] });
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    if ((task as any).Subject?.userId !== userId) return res.status(401).json({ error: 'Unauthorized.' });

    if (isCompleted !== undefined) task.isCompleted = isCompleted;
    await task.save();
    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update task.' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const taskId = req.params.id as string;

    const task = await Task.findByPk(taskId, { include: [Subject] });
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    if ((task as any).Subject?.userId !== userId) return res.status(401).json({ error: 'Unauthorized.' });

    await task.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete task.' });
  }
};

export default {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
