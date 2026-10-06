import { Router } from 'express';
import { createNote } from '../controllers/noteController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createNote);

export default router;
