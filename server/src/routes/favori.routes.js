import { Router } from 'express';
import { ajouterFavori, retirerFavori, listeFavoris } from '../controllers/favori.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.post('/:annonceId', ajouterFavori);
router.delete('/:annonceId', retirerFavori);
router.get('/', listeFavoris);

export default router;
