import { Router } from 'express';
import { register, login, logout, me, updateProfil } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';
import { validate, registerSchema, loginSchema } from '../middleware/validateMiddleware.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, me);
router.put('/profil', authMiddleware, uploadSingle, updateProfil);

export default router;
