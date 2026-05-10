import { Router } from 'express';
import { setNotifications, getNonLus, dashboardStats } from '../controllers/notification.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.post('/preferences', setNotifications);
router.get('/non-lus', getNonLus);
router.get('/dashboard-stats', roleMiddleware('PROPRIETAIRE'), dashboardStats);

export default router;
