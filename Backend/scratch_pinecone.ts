import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
dotenv.config();

async function testPinecone() {
  try {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const indexName = process.env.PINECONE_INDEX_NAME!;
    const index = pc.index(indexName);

    // Dummy vector
    const vector = Array.from({ length: 768 }).map(() => Math.random());

    const pineconeResults = await index.query({
      vector,
      topK: 3,
      includeMetadata: true,
      filter: { userId: { $eq: 1 } }, // Using a dummy user id
    });
    console.log('Pinecone Query Success:', pineconeResults.matches.length, 'matches');
  } catch (error: any) {
    console.error('Pinecone Error:', error.message);
  }
}

testPinecone();
