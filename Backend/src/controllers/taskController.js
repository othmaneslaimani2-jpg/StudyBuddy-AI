const { Task, Subject } = require('../models');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        {
          model: Subject,
          where: { userId: req.user.userId }, // Ensure ownership through subject relation
          attributes: ['id', 'title', 'color'],
        },
      ],
      order: [['dueDate', 'ASC']],
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, dueDate, subjectId } = req.body;
    if (!title || !dueDate || !subjectId) {
      return res.status(400).json({ error: 'Title, dueDate, and subjectId are required.' });
    }

    const subject = await Subject.findOne({ where: { id: subjectId, userId: req.user.userId } });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found.' });
    }

    const task = await Task.create({ title, dueDate, subjectId });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task.' });
  }
};