import React from 'react';
import { X, CheckCheck, Clock, Bell } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onSelectBooking?: (bookingId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onSelectBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              <h2 className="font-semibold text-slate-900 text-base">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <Bell className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-600">No notifications yet</p>
                <p className="text-xs text-slate-400 mt-1">Updates on your equipment reservations will appear here.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.read) onMarkRead(notif.id);
                    if (notif.relatedBookingId && onSelectBooking) {
                      onSelectBooking(notif.relatedBookingId);
                    }
                  }}
                  className={`p-3.5 rounded-lg transition-colors cursor-pointer text-left ${
                    notif.read ? 'bg-white hover:bg-slate-50' : 'bg-indigo-50/60 hover:bg-indigo-50 border-l-3 border-indigo-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-sm ${notif.read ? 'font-medium text-slate-800' : 'font-semibold text-slate-900'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                    {notif.relatedBookingId && (
                      <span className="text-indigo-600 font-medium hover:underline">
                        View Booking →
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
