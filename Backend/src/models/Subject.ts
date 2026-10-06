import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

export interface SubjectAttributes {
  id: string;
  title: string;
  color: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubjectCreationAttributes extends Optional<SubjectAttributes, 'id' | 'color'> {}

export class Subject extends Model<SubjectAttributes, SubjectCreationAttributes> implements SubjectAttributes {
  public id!: string;
  public title!: string;
  public color!: string;
  public userId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Subject.init(
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
    color: {
      type: DataTypes.STRING,
      defaultValue: '#4F46E5',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Subjects',
  }
);

export default Subject;
