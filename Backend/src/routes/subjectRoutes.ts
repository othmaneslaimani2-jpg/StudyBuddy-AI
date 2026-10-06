import { Router } from 'express';
import { getSubjects, createSubject } from '../controllers/subjectController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getSubjects);
router.post('/', authenticateToken, createSubject);

export default router;
