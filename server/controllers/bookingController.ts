import { Response } from 'express';
import { dbStore, IBooking } from '../db/store.js';
import { AuthRequest } from '../middleware/auth.js';

export const createBooking = (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { equipmentId, bookingDate, startTime, endTime, quantity, purpose } = req.body;

    // 1. Validate required fields
    if (!equipmentId || !bookingDate || !startTime || !endTime || !quantity || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Equipment, date, start time, end time, quantity, and purpose are required.',
      });
    }

    // 2. Validate quantity
    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      return res.status(400).json({ success: false, message: 'Requested quantity must be a positive integer.' });
    }

    // 3. Validate past dates
    const todayStr = new Date().toISOString().split('T')[0];
    if (bookingDate < todayStr) {
      return res.status(400).json({ success: false, message: 'Cannot create bookings for past dates.' });
    }

    // 4. Validate time range (HH:mm)
    if (endTime <= startTime) {
      return res.status(400).json({ success: false, message: 'End time must be strictly later than start time.' });
    }

    // 5. Verify equipment exists & is active
    const equipment = dbStore.findEquipmentById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found.' });
    }

    if (equipment.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: `Equipment is currently ${equipment.status} and cannot be reserved.`,
      });
    }

    // 6. Check real-time inventory availability during requested window
    const availability = dbStore.getEquipmentAvailability(equipmentId, bookingDate, startTime, endTime);
    if (parsedQty > availability.availableQuantity) {
      return res.status(409).json({
        success: false,
        message: `Requested quantity (${parsedQty}) exceeds available inventory (${availability.availableQuantity}) for this time slot.`,
        availableQuantity: availability.availableQuantity,
      });
    }

    // 7. Create booking record with status 'pending'
    const now = new Date().toISOString();
    const newBooking: IBooking = {
      id: 'bk_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      equipmentCategory: equipment.category,
      bookingDate,
      startTime,
      endTime,
      quantity: parsedQty,
      purpose: purpose.trim(),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    dbStore.createBooking(newBooking);

    // 8. Create user confirmation notification
    dbStore.createNotification({
      id: 'notif_' + Date.now(),
      userId: user.id,
      title: 'Booking Request Submitted',
      message: `Your booking request for ${parsedQty} unit(s) of "${equipment.name}" on ${bookingDate} (${startTime} - ${endTime}) was submitted successfully. Waiting for administrator approval.`,
      type: 'booking_created',
      relatedBookingId: newBooking.id,
      read: false,
      createdAt: now,
    });

    // 9. Create notification for administrators
    const admins = dbStore.getAllUsers().filter(u => u.role === 'admin');
    admins.forEach(admin => {
      dbStore.createNotification({
        id: 'notif_adm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
        userId: admin.id,
        title: 'New Booking Awaiting Approval',
        message: `${user.name} (${user.role.toUpperCase()}) submitted a booking request for ${parsedQty} unit(s) of "${equipment.name}" on ${bookingDate}.`,
        type: 'booking_created',
        relatedBookingId: newBooking.id,
        read: false,
        createdAt: now,
      });
    });

    return res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully.',
      data: newBooking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit booking request.' });
  }
};

export const getMyBookings = (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const bookings = dbStore.getBookingsByUserId(user.id);
    // Sort descending by creation
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve booking history.' });
  }
};

export const getAllBookings = (req: AuthRequest, res: Response) => {
  try {
    const { status, date, equipmentId, userId, search } = req.query;
    let list = dbStore.getAllBookings();

    if (status && typeof status === 'string' && status !== 'All') {
      list = list.filter(b => b.status === status);
    }

    if (date && typeof date === 'string') {
      list = list.filter(b => b.bookingDate === date);
    }

    if (equipmentId && typeof equipmentId === 'string' && equipmentId !== 'All') {
      list = list.filter(b => b.equipmentId === equipmentId);
    }

    if (userId && typeof userId === 'string') {
      list = list.filter(b => b.userId === userId);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.userName.toLowerCase().includes(q) ||
        b.userEmail.toLowerCase().includes(q) ||
        b.equipmentName.toLowerCase().includes(q) ||
        b.purpose.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }

    // Sort descending by creation
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve bookings list.' });
  }
};

export const getBookingById = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const booking = dbStore.findBookingById(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Enforce authorization: only owner or admin can view booking details
    if (user.role !== 'admin' && booking.userId !== user.id) {
      return res.status(403).json({ success: false, message: 'Access denied to this booking record.' });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error fetching booking by id:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve booking.' });
  }
};

export const cancelBooking = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const booking = dbStore.findBookingById(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Only owner or admin can cancel
    if (user.role !== 'admin' && booking.userId !== user.id) {
      return res.status(403).json({ success: false, message: 'Access denied. You cannot cancel another user\'s booking.' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    if (booking.status === 'rejected' || booking.status === 'returned') {
      return res.status(400).json({ success: false, message: `Cannot cancel a booking with status "${booking.status}".` });
    }

    const updated = dbStore.updateBooking(id, {
      status: 'cancelled',
      adminRemarks: req.body.reason || `Cancelled by ${user.name} (${user.role})`,
    });

    // Notify user
    dbStore.createNotification({
      id: 'notif_' + Date.now(),
      userId: booking.userId,
      title: 'Booking Cancelled',
      message: `Your booking for "${booking.equipmentName}" on ${booking.bookingDate} has been cancelled. Reserved inventory has been released.`,
      type: 'booking_cancelled',
      relatedBookingId: booking.id,
      read: false,
      createdAt: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Reserved units released.',
      data: updated,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({ success: false, message: 'Failed to cancel booking.' });
  }
};

export const approveBooking = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const admin = req.user!;
    const { adminRemarks } = req.body;

    const booking = dbStore.findBookingById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Only pending bookings can be approved. Current status: ${booking.status}.`,
      });
    }

    // Double check availability at approval time
    const eq = dbStore.findEquipmentById(booking.equipmentId);
    if (!eq) {
      return res.status(404).json({ success: false, message: 'Associated equipment no longer exists.' });
    }

    // Check if other already approved bookings overlap and exceed total inventory
    const overlappingApproved = dbStore.getAllBookings().filter(b => 
      b.id !== booking.id &&
      b.equipmentId === booking.equipmentId &&
      b.bookingDate === booking.bookingDate &&
      b.status === 'approved' &&
      booking.startTime < b.endTime &&
      booking.endTime > b.startTime
    );

    const approvedQuantitySum = overlappingApproved.reduce((sum, b) => sum + b.quantity, 0);
    if (approvedQuantitySum + booking.quantity > eq.totalQuantity) {
      return res.status(409).json({
        success: false,
        message: `Cannot approve: total requested quantity exceeds available stock due to conflicting approved bookings. Available slots: ${eq.totalQuantity - approvedQuantitySum}.`,
      });
    }

    const updated = dbStore.updateBooking(id, {
      status: 'approved',
      adminRemarks: adminRemarks || 'Approved by system administrator.',
      handledByAdminId: admin.id,
      handledByAdminName: admin.name,
    });

    // Notify user
    dbStore.createNotification({
      id: 'notif_' + Date.now(),
      userId: booking.userId,
      title: 'Booking Approved',
      message: `Your booking for "${booking.equipmentName}" on ${booking.bookingDate} (${booking.startTime} - ${booking.endTime}) was approved by ${admin.name}.`,
      type: 'booking_approved',
      relatedBookingId: booking.id,
      read: false,
      createdAt: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: 'Booking approved successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error approving booking:', error);
    return res.status(500).json({ success: false, message: 'Failed to approve booking.' });
  }
};

export const rejectBooking = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const admin = req.user!;
    const { reason, adminRemarks } = req.body;

    const rejectionReason = reason || adminRemarks || 'Equipment unavailable or scheduled maintenance during this window.';

    const booking = dbStore.findBookingById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.status !== 'pending' && booking.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject a booking with status: ${booking.status}.`,
      });
    }

    const updated = dbStore.updateBooking(id, {
      status: 'rejected',
      adminRemarks: rejectionReason,
      handledByAdminId: admin.id,
      handledByAdminName: admin.name,
    });

    // Notify user
    dbStore.createNotification({
      id: 'notif_' + Date.now(),
      userId: booking.userId,
      title: 'Booking Request Declined',
      message: `Your booking for "${booking.equipmentName}" on ${booking.bookingDate} was rejected. Reason: ${rejectionReason}`,
      type: 'booking_rejected',
      relatedBookingId: booking.id,
      read: false,
      createdAt: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: 'Booking request rejected. Inventory reservation released.',
      data: updated,
    });
  } catch (error) {
    console.error('Error rejecting booking:', error);
    return res.status(500).json({ success: false, message: 'Failed to reject booking.' });
  }
};
