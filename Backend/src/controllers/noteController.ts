import { Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { Note, Subject } from '../models';
import { getPineconeIndex } from '../../config/pinecone';
import { AuthRequest } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, subjectId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    if (!title || !content || !subjectId) {
      return res.status(400).json({ error: 'Title, content, and subjectId are required.' });
    }

    const subject = await Subject.findOne({ where: { id: subjectId, userId } });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found.' });
    }

    const note = await Note.create({ title, content, subjectId });

    const embeddingResponse = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: `Title: ${title}\nContent: ${content}`,
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
    return res.status(500).json({ error: 'Failed to save and vectorise note.' });
  }
};

export default {
  createNote,
};