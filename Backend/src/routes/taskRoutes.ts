import { Router } from 'express';
import { getTasks, createTask } from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getTasks);
router.post('/', authenticateToken, createTask);

export default router;
