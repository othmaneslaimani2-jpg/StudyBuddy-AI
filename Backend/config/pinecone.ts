import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
});

const getPineconeIndex = () => pinecone.index(process.env.PINECONE_INDEX_NAME || '');

export { pinecone, getPineconeIndex };
export default pinecone;
