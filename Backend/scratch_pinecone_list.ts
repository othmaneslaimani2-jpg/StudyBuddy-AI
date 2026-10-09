import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
dotenv.config();

async function listPinecone() {
  try {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const indexes = await pc.listIndexes();
    console.log('Pinecone Indexes:', indexes.indexes);
  } catch (error: any) {
    console.error('Pinecone Error:', error.message);
  }
}

listPinecone();
