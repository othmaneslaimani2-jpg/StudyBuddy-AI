import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

export interface TaskAttributes {
  id: string;
  title: string;
  dueDate: Date;
  isCompleted?: boolean;
  subjectId?: string;
  description?: string;
  priority?: string;
  reminder?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'isCompleted'> {}

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  declare id: string;
  declare title: string;
  declare dueDate: Date;
  declare isCompleted: boolean;
  declare subjectId: string;
  declare description: string | undefined;
  declare priority: string | undefined;
  declare reminder: string | undefined;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reminder: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Tasks',
  }
);

export default Task;
