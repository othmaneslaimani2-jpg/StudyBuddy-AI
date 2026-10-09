import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function test() {
  try {
    const res = await ai.models.embedContent({
      model: 'gemini-embedding-2',
      contents: 'hi',
    });
    console.log('Success:', res.embeddings?.[0]?.values?.slice(0, 5));
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

test();
