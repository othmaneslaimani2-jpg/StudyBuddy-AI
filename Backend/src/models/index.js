const sequelize = require('../../config/database');
const User = require('./User');
const Subject = require('./Subject');
const Task = require('./Task');
const Note = require('./Note');

User.hasMany(Subject, { foreignKey: 'userId', onDelete: 'CASCADE' });
Subject.belongsTo(User, { foreignKey: 'userId' });

Subject.hasMany(Task, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
Task.belongsTo(Subject, { foreignKey: 'subjectId' });

Subject.hasMany(Note, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
Note.belongsTo(Subject, { foreignKey: 'subjectId' });

module.exports = {
  sequelize,
  User,
  Subject,
  Task,
  Note,
};