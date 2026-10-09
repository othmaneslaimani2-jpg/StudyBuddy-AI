import { Router } from 'express';
import { createNote, getNotes, deleteNote } from '../controllers/noteController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getNotes);
router.post('/', authenticateToken, createNote);
router.delete('/:id', authenticateToken, deleteNote);

export default router;
