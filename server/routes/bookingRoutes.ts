import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
  approveBooking,
  rejectBooking,
} from '../controllers/bookingController.js';
import { authenticateToken, requireAdmin, requireFacultyOrStudent } from '../middleware/auth.js';

const router = Router();

// All booking routes require authentication
router.use(authenticateToken);

// User-specific booking endpoints
router.post('/', requireFacultyOrStudent, createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

// Administrator booking endpoints
router.get('/', requireAdmin, getAllBookings);
router.patch('/:id/approve', requireAdmin, approveBooking);
router.patch('/:id/reject', requireAdmin, rejectBooking);

export default router;
