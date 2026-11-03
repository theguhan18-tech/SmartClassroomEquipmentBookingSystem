import React, { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Filter, 
  XCircle, 
  CheckCircle, 
  FileText, 
  Plus, 
  AlertCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { api } from '../services/api';

interface MyBookingsPageProps {
  bookings: Booking[];
  onRefresh: () => void;
  onNavigateToCatalog: () => void;
  onViewBookingDetails: (booking: Booking) => void;
}

const STATUS_FILTERS: Array<BookingStatus | 'All'> = ['All', 'pending', 'approved', 'rejected', 'cancelled'];

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  bookings,
  onRefresh,
  onNavigateToCatalog,
  onViewBookingDetails,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'All'>('All');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (selectedStatus !== 'All' && b.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const handleOpenCancel = (booking: Booking) => {
    setSelectedBookingForCancel(booking);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async (reason?: string) => {
    if (!selectedBookingForCancel) return;
    setCancelling(true);
    setActionMessage(null);

    try {
      const res = await api.cancelBooking(selectedBookingForCancel.id, reason);
      if (res.success) {
        setActionMessage({
          type: 'success',
          text: `Booking for ${selectedBookingForCancel.equipmentName} has been cancelled and reserved units returned to the inventory.`,
        });
        setCancelModalOpen(false);
        setSelectedBookingForCancel(null);
        onRefresh();
      }
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Failed to cancel reservation.',
      });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Academic Reservations</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Equipment Bookings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor reservation progress, review administrator remarks, and manage active requests.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh bookings"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onNavigateToCatalog}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
          actionMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${
              selectedStatus === st
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st === 'All' ? 'All Bookings' : st}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-900 text-base">No Bookings Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {selectedStatus === 'All'
              ? 'You have not submitted any equipment reservation requests yet.'
              : `You have no bookings currently in "${selectedStatus}" status.`}
          </p>
          <button
            onClick={onNavigateToCatalog}
            className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            Browse Equipment & Book
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={b.status} size="sm" />
                  <span className="text-xs font-mono font-bold text-slate-700">ID: {b.id}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-indigo-600 font-medium">{b.equipmentCategory}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">
                  {b.equipmentName}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Purpose:</strong> {b.purpose}
                </p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500 font-mono tabular-nums">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    <span>{b.bookingDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{b.startTime} - {b.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">Quantity: {b.quantity} unit(s)</span>
                  </div>
                </div>

                {b.adminRemarks && (
                  <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Admin Remark: </span>
                    {b.adminRemarks}
                    {b.handledByAdminName && (
                      <span className="text-slate-400 text-[11px] block mt-0.5">
                        Reviewed by {b.handledByAdminName}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 md:self-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                <button
                  onClick={() => onViewBookingDetails(b)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                {(b.status === 'pending' || b.status === 'approved') && (
                  <button
                    onClick={() => handleOpenCancel(b)}
                    className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Booking</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancellation Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel Equipment Reservation"
        message={`Are you sure you want to cancel booking ${selectedBookingForCancel?.id} for "${selectedBookingForCancel?.equipmentName}"? Reserved units will immediately be released back into the available pool.`}
        confirmText={cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
        isDestructive={true}
        requireReason={false}
        onConfirm={handleConfirmCancel}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedBookingForCancel(null);
        }}
      />
    </div>
  );
};
