import { Response } from 'express';
import { dbStore } from '../db/store.js';
import { AuthRequest } from '../middleware/auth.js';

export const getUsers = (req: AuthRequest, res: Response) => {
  try {
    const { role, status, search } = req.query;
    let list = dbStore.getAllUsers();

    if (role && typeof role === 'string' && role !== 'All') {
      list = list.filter(u => u.role === role);
    }

    if (status && typeof status === 'string' && status !== 'All') {
      list = list.filter(u => u.status === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.department && u.department.toLowerCase().includes(q)) ||
        (u.studentIdOrStaffId && u.studentIdOrStaffId.toLowerCase().includes(q))
      );
    }

    const safeUsers = list.map(({ passwordHash, ...rest }) => rest);

    return res.status(200).json({
      success: true,
      count: safeUsers.length,
      data: safeUsers,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
  }
};

export const getUserById = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = dbStore.findUserById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Only allow admin or the user themselves
    if (req.user?.role !== 'admin' && req.user?.id !== id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const { passwordHash, ...safeUser } = user;
    return res.status(200).json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    console.error('Error fetching user by id:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
};

export const updateUserProfile = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;

    if (currentUser.role !== 'admin' && currentUser.id !== id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const targetUser = dbStore.findUserById(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { name, department, phone, studentIdOrStaffId } = req.body;
    const updated = dbStore.updateUser(id, {
      name: name ? name.trim() : targetUser.name,
      department: department ? department.trim() : targetUser.department,
      phone: phone ? phone.trim() : targetUser.phone,
      studentIdOrStaffId: studentIdOrStaffId ? studentIdOrStaffId.trim() : targetUser.studentIdOrStaffId,
    });

    if (!updated) {
      return res.status(500).json({ success: false, message: 'Failed to update user profile.' });
    }

    const { passwordHash, ...safeUser } = updated;
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: safeUser,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

export const updateUserRoleOrStatus = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    const targetUser = dbStore.findUserById(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Safety: prevent de-admining the main system admin
    if (targetUser.email === 'admin@college.edu' && role && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot demote the primary root administrator.' });
    }

    const updates: Partial<typeof targetUser> = {};
    if (role && ['student', 'faculty', 'admin'].includes(role)) {
      updates.role = role;
    }
    if (status && ['active', 'suspended'].includes(status)) {
      updates.status = status;
    }

    const updated = dbStore.updateUser(id, updates);
    const { passwordHash, ...safeUser } = updated!;

    return res.status(200).json({
      success: true,
      message: 'User permissions updated successfully.',
      data: safeUser,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({ success: false, message: 'Failed to update user status.' });
  }
};
