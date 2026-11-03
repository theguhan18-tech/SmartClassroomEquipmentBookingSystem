import { Router } from 'express';
import {
  getEquipment,
  getEquipmentById,
  checkAvailability,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from '../controllers/equipmentController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public / Authenticated catalog endpoints
router.get('/', getEquipment);
router.get('/:id/availability', checkAvailability);
router.get('/:id', getEquipmentById);

// Admin-only management endpoints
router.post('/', authenticateToken, requireAdmin, createEquipment);
router.put('/:id', authenticateToken, requireAdmin, updateEquipment);
router.delete('/:id', authenticateToken, requireAdmin, deleteEquipment);

export default router;
