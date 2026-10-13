import { Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { Note, Subject } from '../models';
import { getPineconeIndex } from '../../config/pinecone';
import { AuthRequest } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, subjectId, subject: subjectName } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    if (!title || !content || (!subjectId && !subjectName)) {
      return res.status(400).json({ error: 'Title, content, and subject are required.' });
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

    let note;
    try {
      note = await Note.create({ title, content, subjectId: finalSubjectId });

      const embeddingResponse = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: `Title: ${title}\nContent: ${content}`,
        config: {
          outputDimensionality: 768
        }
      });

      const vectorValues = embeddingResponse.embeddings?.[0]?.values;

      if (!vectorValues) {
        throw new Error('Failed to generate embedding vector values.');
      }

      const index = getPineconeIndex();
      await index.upsert({
        records: [
          {
            id: note.id,
            values: vectorValues,
            metadata: {
              userId,
              subjectId,
              title,
              textChunk: content.substring(0, 1000),
            },
          },
        ],
      });

      return res.status(201).json({ message: 'Note saved and indexed using Gemini successfully!', note });
    } catch (error) {
      console.error('Note Upload Error:', error);
      if (note) {
        await note.destroy();
      }
      return res.status(500).json({ error: 'Failed to save and vectorise note.' });
    }
  } catch (error) {
    console.error('Create Note Error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const notes = await Note.findAll({
      include: [
        {
          model: Subject,
          where: { userId },
          attributes: ['id', 'title', 'color'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return res.json(notes);
  } catch (error) {
    console.error('Fetch Notes Error:', error);
    return res.status(500).json({ error: 'Failed to fetch notes.' });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const noteId = req.params.id as string;

    if (!userId) return res.status(401).json({ error: 'Unauthorized.' });

    const note = await Note.findByPk(noteId, { include: [Subject] });
    if (!note) return res.status(404).json({ error: 'Note not found.' });

    if ((note as any).Subject?.userId !== userId) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    try {
      const index = getPineconeIndex();
      await index.deleteOne({ id: note.id });
    } catch (pineconeError) {
      console.error('Failed to delete note from Pinecone:', pineconeError);
    }

    await note.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Delete Note Error:', error);
    return res.status(500).json({ error: 'Failed to delete note.' });
  }
};

export default {
  createNote,
  getNotes,
  deleteNote,
};