const { Subject, Task, Note } = require('../models');

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      where: { userId: req.user.userId },
      include: [Task, Note], 
    });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subjects.' });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { title, color } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Subject title is required.' });
    }

    const subject = await Subject.create({
      title,
      color: color || '#4F46E5',
      userId: req.user.userId,
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subject.' });
  }
};