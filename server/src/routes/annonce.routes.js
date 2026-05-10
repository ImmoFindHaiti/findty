import { Router } from 'express';
import { creerAnnonce, modifierAnnonce, supprimerAnnonce, mesAnnonces, changerStatut } from '../controllers/annonce.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validate, bienSchema } from '../middleware/validateMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.post('/', roleMiddleware('PROPRIETAIRE', 'ADMIN'), validate(bienSchema), creerAnnonce);
router.put('/:id', roleMiddleware('PROPRIETAIRE', 'ADMIN'), modifierAnnonce);
router.delete('/:id', roleMiddleware('PROPRIETAIRE', 'ADMIN'), supprimerAnnonce);
router.get('/mes', mesAnnonces);
router.patch('/:id/statut', roleMiddleware('PROPRIETAIRE', 'ADMIN'), changerStatut);

export default router;
