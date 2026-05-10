import { Router } from 'express';
import { listBiens, getBien } from '../controllers/bien.controller.js';

const router = Router();

router.get('/', listBiens);
router.get('/:id', getBien);

export default router;
