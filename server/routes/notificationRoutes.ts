import { Router } from 'express';
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsRead,
} from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getMyNotifications);
router.patch('/read-all', markAllNotificationsRead);
router.patch('/:id/read', markNotificationAsRead);

export default router;
