const { OpenAI } = require('openai');
const { Note, Subject } = require('../models');
const { getPineconeIndex } = require('../config/pinecone');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.createNote = async (req, res) => {
  try {
    const { title, content, subjectId } = req.body;
    const userId = req.user.userId;

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
    await index.upsert([
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
    ]);

    res.status(201).json({ message: 'Note saved and indexed in Pinecone successfully!', note });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save and index note.' });
  }
};