import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

export interface NoteAttributes {
  id: string;
  title: string;
  content: string;
  subjectId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NoteCreationAttributes extends Optional<NoteAttributes, 'id'> {}

export class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
  declare id: string;
  declare title: string;
  declare content: string;
  declare subjectId: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Note.init(
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Notes',
  }
);

export default Note;
