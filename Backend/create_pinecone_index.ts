import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
dotenv.config();

async function createIndex() {
  try {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const indexName = (process.env.PINECONE_INDEX_NAME || 'StudyBuddyAI').toLowerCase(); // Index names must be lowercase
    console.log(`Creating Pinecone index: ${indexName}...`);
    
    // Pinecone index names must be lowercase. Let's ensure it's valid.
    const validIndexName = indexName.replace(/[^a-z0-9-]/g, '-').toLowerCase();

    const existingIndexes = await pc.listIndexes();
    const exists = existingIndexes.indexes?.some((idx: any) => idx.name === validIndexName);

    if (exists) {
      console.log(`Index ${validIndexName} already exists!`);
    } else {
      await pc.createIndex({
        name: validIndexName,
        dimension: 768, // Default for Gemini embeddings
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      console.log(`Successfully created Pinecone index: ${validIndexName}`);
    }
  } catch (error: any) {
    console.error('Failed to create Pinecone index:', error.message);
  }
}

createIndex();
