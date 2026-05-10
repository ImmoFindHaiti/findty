import { Router } from 'express';
import { uploadPhotos, supprimerPhoto } from '../controllers/photo.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadMultiple } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/upload', authMiddleware, uploadMultiple, uploadPhotos);
router.delete('/:id', authMiddleware, supprimerPhoto);

export default router;
