import { Router } from 'express';
import { chatWithAI } from '../controllers/aiController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/chat', authenticateToken, chatWithAI);

export default router;
