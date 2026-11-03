import { Router } from 'express';
import { getDashboardSummary, getEquipmentUsageReport } from '../controllers/reportController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/dashboard', getDashboardSummary);
router.get('/equipment-usage', getEquipmentUsageReport);
router.get('/bookings', getDashboardSummary);

export default router;
