import { Response } from 'express';
import { OpenAI } from 'openai';
import type { ChatCompletionTool } from 'openai/resources/chat/completions';
import { Subject, Task } from '../models';
import { getPineconeIndex } from '../../config/pinecone';
import { AuthRequest } from '../types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: message,
    });
    const queryVector = embeddingResponse.data[0].embedding;

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
          return `[Document Title: ${metadata?.title || 'Untitled'}]\n${metadata?.textChunk || ''}`;
        })
        .join('\n\n');
    }

    const tools: ChatCompletionTool[] = [
      {
        type: 'function',
        function: {
          name: 'create_study_task',
          description: 'Schedules a new homework task or study reminder in PostgreSQL.',
          parameters: {
            type: 'object',
            properties: {
              subjectTitle: { type: 'string', description: 'Subject name e.g. History, Biology' },
              taskTitle: { type: 'string', description: 'Task title e.g. Read Chapter 4' },
              dueDate: { type: 'string', description: 'Due date in YYYY-MM-DD format' },
            },
            required: ['subjectTitle', 'taskTitle', 'dueDate'],
          },
        },
      },
    ];

    const systemPrompt = `You are StudyBuddy AI, an academic assistant for middle and high school students.

STRICT SAFEGUARDS & BOUNDARIES:
- You MUST refuse to write entire essays, write code assignments from scratch, or complete tests for the student.
- Your job is to explain concepts clearly, quiz students based on their notes, and manage their study schedule.

RETRIEVED CLASS NOTES FROM PINECONE:
${retrievedNotesContext ? retrievedNotesContext : 'No matching notes found for this query.'}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      tools: tools,
      tool_choice: 'auto',
    });

    const responseMessage = completion.choices[0].message;

    if (responseMessage.tool_calls) {
      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.type === 'function' && toolCall.function.name === 'create_study_task') {
          const args = JSON.parse(toolCall.function.arguments);

          let [subject] = await Subject.findOrCreate({
            where: { title: args.subjectTitle, userId },
            defaults: { title: args.subjectTitle, userId },
          });

          const newTask = await Task.create({
            title: args.taskTitle,
            dueDate: new Date(args.dueDate),
            subjectId: subject.id,
          });

          return res.json({
            reply: `I scheduled "${newTask.title}" for ${subject.title} due on ${args.dueDate}!`,
            actionExecuted: true,
            task: newTask,
          });
        }
      }
    }

    return res.json({ reply: responseMessage.content });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({ error: 'Failed to process AI chat message.' });
  }
};

export default {
  chatWithAI,
};
