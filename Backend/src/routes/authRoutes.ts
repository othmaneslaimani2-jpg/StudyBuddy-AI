import { Router } from 'express';
import { signup } from '../controllers/signup';
import { login } from '../controllers/login';
import { updateProfile } from '../controllers/userController';
import { authValidation } from '../middleware/authValidation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/signup', authValidation, signup);
router.post('/login', authValidation, login);
router.put('/profile', authenticateToken, updateProfile);

export default router;
