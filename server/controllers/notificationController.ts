import { Response } from 'express';
import { dbStore } from '../db/store.js';
import { AuthRequest } from '../middleware/auth.js';

export const getMyNotifications = (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const notifications = dbStore.getNotificationsByUserId(user.id);
    const unreadCount = notifications.filter(n => !n.read).length;

    return res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve notifications.' });
  }
};

export const markNotificationAsRead = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const success = dbStore.markNotificationAsRead(id, user.id);

    if (!success) {
      return res.status(404).json({ success: false, message: 'Notification not found or access denied.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return res.status(500).json({ success: false, message: 'Failed to update notification.' });
  }
};

export const markAllNotificationsRead = (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const updatedCount = dbStore.markAllNotificationsAsRead(user.id);

    return res.status(200).json({
      success: true,
      message: `${updatedCount} notifications marked as read.`,
      count: updatedCount,
    });
  } catch (error) {
    console.error('Error marking all notifications:', error);
    return res.status(500).json({ success: false, message: 'Failed to mark notifications.' });
  }
};
