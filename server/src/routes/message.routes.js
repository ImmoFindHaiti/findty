import { Router } from 'express';
import { envoyerMessage, getConversation, marquerLu, nonLus, listeConversations } from '../controllers/message.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validate, messageSchema } from '../middleware/validateMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.post('/', validate(messageSchema), envoyerMessage);
router.get('/conversations', listeConversations);
router.get('/conversation/:annonceId', getConversation);
router.patch('/:id/lu', marquerLu);
router.get('/non-lus', nonLus);

export default router;
