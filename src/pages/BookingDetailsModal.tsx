import React from 'react';
import { X, Calendar, Clock, Layers, User, Mail, Shield, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Booking } from '../types';
import { StatusBadge } from '../components/StatusBadge';

interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status} size="sm" />
            <span className="text-xs font-mono font-bold text-slate-700">Booking {booking.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">{booking.equipmentName}</h3>
            <span className="text-indigo-600 font-medium">{booking.equipmentCategory}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block mb-0.5">Date</span>
              <span className="font-semibold text-slate-800 font-mono text-sm">{booking.bookingDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Time Window</span>
              <span className="font-semibold text-slate-800 font-mono text-sm">{booking.startTime} - {booking.endTime}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Reserved Units</span>
              <span className="font-semibold text-slate-800 font-mono text-sm">{booking.quantity} unit(s)</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Requester Role</span>
              <span className="font-semibold text-slate-800 capitalize">{booking.userRole}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Academic Purpose</h4>
            <p className="text-slate-600 leading-relaxed bg-white border border-slate-200 p-3 rounded-lg">
              {booking.purpose}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1.5 text-slate-500">
            <div className="flex justify-between">
              <span>Requester Name:</span>
              <span className="font-medium text-slate-800">{booking.userName}</span>
            </div>
            <div className="flex justify-between">
              <span>Requester Email:</span>
              <span className="font-medium text-slate-800 font-mono">{booking.userEmail}</span>
            </div>
            <div className="flex justify-between">
              <span>Request Created:</span>
              <span className="font-mono">{new Date(booking.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {booking.adminRemarks && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900">
              <span className="font-bold block mb-1">Administrator Review Remarks:</span>
              <p className="leading-relaxed">{booking.adminRemarks}</p>
              {booking.handledByAdminName && (
                <span className="text-[11px] text-indigo-700 block mt-1 font-medium">
                  Verified by: {booking.handledByAdminName}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
