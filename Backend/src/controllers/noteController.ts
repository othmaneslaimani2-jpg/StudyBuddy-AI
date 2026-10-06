import { Response } from 'express';
import { OpenAI } from 'openai';
import { Note, Subject } from '../models';
import { getPineconeIndex } from '../../config/pinecone';
import { AuthRequest } from '../types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: `Title: ${title}\nContent: ${content}`,
    });
    const vectorValues = embeddingResponse.data[0].embedding;

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

    return res.status(201).json({ message: 'Note saved and indexed in Pinecone successfully!', note });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save and index note.' });
  }
};

export default {
  createNote,
};
