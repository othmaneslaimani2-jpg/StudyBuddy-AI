import { Router } from 'express';
import { signup } from '../controllers/signup';
import { login } from '../controllers/login';
import { authValidation } from '../middleware/authValidation';

const router = Router();

router.post('/signup', authValidation, signup);
router.post('/register', authValidation, signup);
router.post('/login', authValidation, login);

export default router;
