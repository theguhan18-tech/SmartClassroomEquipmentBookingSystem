import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserRoleOrStatus,
} from '../controllers/userController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// User retrieval and updates
router.get('/', requireAdmin, getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUserProfile);
router.patch('/:id/role', requireAdmin, updateUserRoleOrStatus);

export default router;
