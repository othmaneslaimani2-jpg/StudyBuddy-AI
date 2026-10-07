import { Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { Subject, Task } from '../models';
import { getPineconeIndex } from '../../config/pinecone';
import { AuthRequest } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const chatWithAI = async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const embeddingResponse = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: message,
    });
    const queryVector = embeddingResponse.embeddings?.[0]?.values;

    if (!queryVector) {
      throw new Error('Failed to generate embedding vector.');
    }

    const index = getPineconeIndex();
    const pineconeResults = await index.query({
      vector: queryVector,
      topK: 3,
      includeMetadata: true,
      filter: { userId: { $eq: userId } },
    });

    let retrievedNotesContext = '';
    if (pineconeResults.matches && pineconeResults.matches.length > 0) {
      retrievedNotesContext = pineconeResults.matches
        .filter((match) => (match.score ?? 0) > 0.3)
        .map((match) => {
          const metadata = match.metadata as { title?: string; textChunk?: string } | undefined;
          return `[Document: ${metadata?.title || 'Untitled'}]\n${metadata?.textChunk || ''}`;
        })
        .join('\n\n');
    }

    const createTaskTool = {
      functionDeclarations: [
        {
          name: 'create_study_task',
          description: 'Schedules a new homework task or study reminder in PostgreSQL.',
          parameters: {
            type: Type.OBJECT,
            properties: {
              subjectTitle: { type: Type.STRING, description: 'Subject name e.g. History, Biology' },
              taskTitle: { type: Type.STRING, description: 'Task title e.g. Read Chapter 4' },
              dueDate: { type: Type.STRING, description: 'Due date in YYYY-MM-DD format' },
            },
            required: ['subjectTitle', 'taskTitle', 'dueDate'],
          },
        },
      ],
    };

    const systemInstruction = `You are StudyBuddy AI, an academic tutor for middle and high school students.

STRICT SAFEGUARDS:
- Refuse to write whole essays or complete entire tests for the student.
- Explain concepts clearly, quiz students based on their notes, and manage study schedules.

RETRIEVED CLASS NOTES:
${retrievedNotesContext ? retrievedNotesContext : 'No matching notes found.'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction,
        tools: [createTaskTool],
      },
    });

    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === 'create_study_task') {
        const { subjectTitle, taskTitle, dueDate } = (call.args as any) || {};

        let [subject] = await Subject.findOrCreate({
          where: { title: subjectTitle, userId },
          defaults: { title: subjectTitle, userId },
        });

        const newTask = await Task.create({
          title: taskTitle,
          dueDate: new Date(dueDate),
          subjectId: subject.id,
        });

        return res.json({
          reply: `I scheduled "${newTask.title}" for ${subject.title} due on ${dueDate}! 📅`,
          actionExecuted: true,
          task: newTask,
        });
      }
    }

    return res.json({ reply: response.text });
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    return res.status(500).json({ error: 'Failed to process AI chat message.' });
  }
};

export default {
  chatWithAI,
};