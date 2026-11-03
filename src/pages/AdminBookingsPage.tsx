import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Search, 
  Filter, 
  Check, 
  X, 
  RotateCcw, 
  Eye, 
  Clock, 
  Building2, 
  User as UserIcon,
  RefreshCw
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { api } from '../services/api';

interface AdminBookingsPageProps {
  onViewBookingDetails: (booking: Booking) => void;
}

const STATUSES: Array<BookingStatus | 'All'> = ['All', 'pending', 'approved', 'rejected', 'cancelled'];

export const AdminBookingsPage: React.FC<AdminBookingsPageProps> = ({
  onViewBookingDetails,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'All'>('All');
  const [selectedDate, setSelectedDate] = useState('');
  
  const [actionBooking, setActionBooking] = useState<{ booking: Booking; action: 'approve' | 'reject' } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.getAllBookings();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = bookings.filter(b => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchUser = b.userName.toLowerCase().includes(q) || b.userEmail.toLowerCase().includes(q);
      const matchEq = b.equipmentName.toLowerCase().includes(q);
      const matchPurpose = b.purpose.toLowerCase().includes(q);
      const matchId = b.id.toLowerCase().includes(q);
      if (!matchUser && !matchEq && !matchPurpose && !matchId) return false;
    }

    if (selectedStatus !== 'All' && b.status !== selectedStatus) {
      return false;
    }

    if (selectedDate && b.bookingDate !== selectedDate) {
      return false;
    }

    return true;
  });

  const handleConfirmAction = async (reason?: string) => {
    if (!actionBooking) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      if (actionBooking.action === 'approve') {
        const res = await api.approveBooking(actionBooking.booking.id, reason);
        if (res.success) {
          setFeedback({ type: 'success', text: `Booking ${actionBooking.booking.id} approved successfully.` });
        }
      } else {
        const res = await api.rejectBooking(actionBooking.booking.id, reason);
        if (res.success) {
          setFeedback({ type: 'success', text: `Booking ${actionBooking.booking.id} declined.` });
        }
      }
      setActionBooking(null);
      fetchBookings();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Master Reservation Registry</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Booking Approvals & Log</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review incoming requests, verify inventory allocations, and approve or reject equipment bookings.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors self-start sm:self-auto"
          title="Refresh table"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user name, email, equipment, or booking ID..."
            className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="text-xs rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600 bg-white"
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600 bg-white"
          />

          {(search || selectedStatus !== 'All' || selectedDate) && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedStatus('All');
                setSelectedDate('');
              }}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              title="Reset filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Bookings Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Requester</th>
                <th className="py-3 px-4">Equipment</th>
                <th className="py-3 px-4">Date & Time Slot</th>
                <th className="py-3 px-4">Units</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                    {b.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{b.userName}</div>
                    <div className="text-[11px] text-slate-400 font-mono capitalize">{b.userRole} · {b.userEmail}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{b.equipmentName}</div>
                    <div className="text-[11px] text-slate-400">{b.equipmentCategory}</div>
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                    <div>{b.bookingDate}</div>
                    <div className="text-[11px] text-slate-400">{b.startTime} - {b.endTime}</div>
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums font-semibold text-slate-900">
                    {b.quantity}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={b.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewBookingDetails(b)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                        title="View full booking detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {b.status === 'pending' && (
                        <>
                          <button
                            onClick={() => setActionBooking({ booking: b, action: 'approve' })}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1 transition-colors"
                            title="Approve booking"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => setActionBooking({ booking: b, action: 'reject' })}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1 transition-colors"
                            title="Reject request"
                          >
                            <X className="w-3 h-3" />
                            <span>Decline</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={actionBooking !== null}
        title={actionBooking?.action === 'approve' ? 'Approve Equipment Request' : 'Decline Booking Request'}
        message={
          actionBooking?.action === 'approve'
            ? `Approve booking for "${actionBooking.booking.equipmentName}" requested by ${actionBooking.booking.userName} on ${actionBooking.booking.bookingDate}?`
            : `Decline booking for "${actionBooking?.booking.equipmentName}" requested by ${actionBooking?.booking.userName}? Please provide a reason to inform the requester.`
        }
        confirmText={actionBooking?.action === 'approve' ? 'Approve Request' : 'Decline Request'}
        isDestructive={actionBooking?.action === 'reject'}
        requireReason={actionBooking?.action === 'reject'}
        reasonPlaceholder={
          actionBooking?.action === 'approve'
            ? 'Optional collection remarks (e.g. collect from Room 102)'
            : 'Enter reason for rejection...'
        }
        onConfirm={handleConfirmAction}
        onClose={() => setActionBooking(null)}
      />
    </div>
  );
};
