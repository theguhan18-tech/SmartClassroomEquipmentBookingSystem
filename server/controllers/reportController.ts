import { Response } from 'express';
import { dbStore } from '../db/store.js';
import { AuthRequest } from '../middleware/auth.js';

export const getDashboardSummary = (req: AuthRequest, res: Response) => {
  try {
    const allEquipment = dbStore.getAllEquipment();
    const allUsers = dbStore.getAllUsers();
    const allBookings = dbStore.getAllBookings();

    const totalEquipment = allEquipment.length;
    const totalInventoryUnits = allEquipment.reduce((sum, e) => sum + e.totalQuantity, 0);
    const equipmentUnderMaintenance = allEquipment.filter(e => e.status === 'Under Maintenance').length;

    const totalUsers = allUsers.length;
    const totalStudents = allUsers.filter(u => u.role === 'student').length;
    const totalFaculty = allUsers.filter(u => u.role === 'faculty').length;
    const totalAdmins = allUsers.filter(u => u.role === 'admin').length;

    const totalBookings = allBookings.length;
    const pendingBookings = allBookings.filter(b => b.status === 'pending').length;
    const approvedBookings = allBookings.filter(b => b.status === 'approved').length;
    const rejectedBookings = allBookings.filter(b => b.status === 'rejected').length;
    const cancelledBookings = allBookings.filter(b => b.status === 'cancelled').length;

    // Calculate equipment popularity / frequency
    const bookingCountByEquipment: Record<string, { name: string; count: number; category: string; unitsRequested: number }> = {};
    allBookings.forEach(b => {
      if (!bookingCountByEquipment[b.equipmentId]) {
        bookingCountByEquipment[b.equipmentId] = {
          name: b.equipmentName,
          count: 0,
          category: b.equipmentCategory,
          unitsRequested: 0,
        };
      }
      bookingCountByEquipment[b.equipmentId].count += 1;
      bookingCountByEquipment[b.equipmentId].unitsRequested += b.quantity;
    });

    const mostBooked = Object.values(bookingCountByEquipment)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Bookings by category
    const bookingsByCategory: Record<string, number> = {};
    allBookings.forEach(b => {
      bookingsByCategory[b.equipmentCategory] = (bookingsByCategory[b.equipmentCategory] || 0) + 1;
    });

    // Recent 5 bookings
    const recentBookings = [...allBookings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      data: {
        equipment: {
          total: totalEquipment,
          totalInventoryUnits,
          underMaintenance: equipmentUnderMaintenance,
          availableTypes: allEquipment.filter(e => e.status === 'Available').length,
        },
        users: {
          total: totalUsers,
          students: totalStudents,
          faculty: totalFaculty,
          admins: totalAdmins,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          approved: approvedBookings,
          rejected: rejectedBookings,
          cancelled: cancelledBookings,
        },
        mostBooked,
        bookingsByCategory,
        recentBookings,
      },
    });
  } catch (error) {
    console.error('Error getting dashboard summary:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate dashboard analytics.' });
  }
};

export const getEquipmentUsageReport = (req: AuthRequest, res: Response) => {
  try {
    const allEquipment = dbStore.getAllEquipment();
    const allBookings = dbStore.getAllBookings();

    const report = allEquipment.map(item => {
      const itemBookings = allBookings.filter(b => b.equipmentId === item.id);
      const approvedCount = itemBookings.filter(b => b.status === 'approved').length;
      const totalUnitsReserved = itemBookings
        .filter(b => b.status === 'approved')
        .reduce((sum, b) => sum + b.quantity, 0);

      // Estimated utilization rate (approved bookings relative to total pool)
      const utilizationPercent = Math.min(100, Math.round((approvedCount * 20) / Math.max(1, item.totalQuantity)));

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        totalQuantity: item.totalQuantity,
        location: item.location,
        condition: item.condition,
        status: item.status,
        totalBookings: itemBookings.length,
        approvedBookings: approvedCount,
        totalUnitsReserved,
        utilizationScore: `${utilizationPercent}%`,
      };
    });

    return res.status(200).json({
      success: true,
      count: report.length,
      data: report,
    });
  } catch (error) {
    console.error('Error getting equipment usage:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate usage report.' });
  }
};
