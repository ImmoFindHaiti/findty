import { Router } from 'express';
import { listeUtilisateurs, changerRole, toggleLockAnnonce, setPremium, toutesAnnonces, supprimerAnnonceAdmin, supprimerUtilisateur } from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware('ADMIN'));

router.get('/utilisateurs', listeUtilisateurs);
router.patch('/utilisateurs/:id/role', changerRole);
router.get('/annonces', toutesAnnonces);
router.delete('/annonces/:id', supprimerAnnonceAdmin);
router.patch('/annonces/:id/lock', toggleLockAnnonce);
router.patch('/utilisateurs/:id/premium', setPremium);
router.delete('/utilisateurs/:id', supprimerUtilisateur);

export default router;
