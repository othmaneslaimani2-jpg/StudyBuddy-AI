import sequelize from '../../config/database';
import User from './User';
import Subject from './Subject';
import Task from './Task';
import Note from './Note';

User.hasMany(Subject, { foreignKey: 'userId', onDelete: 'CASCADE' });
Subject.belongsTo(User, { foreignKey: 'userId' });

Subject.hasMany(Task, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
Task.belongsTo(Subject, { foreignKey: 'subjectId' });

Subject.hasMany(Note, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
Note.belongsTo(Subject, { foreignKey: 'subjectId' });

export { sequelize, User, Subject, Task, Note };
export default {
  sequelize,
  User,
  Subject,
  Task,
  Note,
};
