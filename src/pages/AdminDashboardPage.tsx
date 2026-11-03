import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Layers, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { DashboardReportData, Booking } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface AdminDashboardPageProps {
  onNavigate: (view: string) => void;
  onViewBooking: (b: Booking) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigate,
  onViewBooking,
}) => {
  const [report, setReport] = useState<DashboardReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionBooking, setActionBooking] = useState<{ booking: Booking; action: 'approve' | 'reject' } | null>(null);
  const [submittingAction, setSubmittingAction] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardSummary();
      if (res.success) {
        setReport(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleConfirmAction = async (reason?: string) => {
    if (!actionBooking) return;
    setSubmittingAction(true);
    setMessage(null);

    try {
      if (actionBooking.action === 'approve') {
        await api.approveBooking(actionBooking.booking.id, reason || 'Approved by system administrator');
        setMessage({ type: 'success', text: `Booking ${actionBooking.booking.id} approved successfully.` });
      } else {
        await api.rejectBooking(actionBooking.booking.id, reason);
        setMessage({ type: 'success', text: `Booking ${actionBooking.booking.id} declined.` });
      }
      setActionBooking(null);
      fetchSummary();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Action failed.' });
    } finally {
      setSubmittingAction(false);
    }
  };

  if (loading && !report) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-xs text-slate-500">
        Loading administrator intelligence metrics...
      </div>
    );
  }

  const pendingBookings = report?.recentBookings.filter(b => b.status === 'pending') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Master Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Equipment Governance Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time tracking of university equipment, approval workflows, and resource allocation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('admin-bookings')}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            Review All Bookings
          </button>
          <button
            onClick={() => onNavigate('admin-reports')}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-600" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Assets</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {report?.equipment.total || 0}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            {report?.equipment.totalInventoryUnits || 0} units pool
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-amber-700">Pending Approvals</span>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1 tabular-nums">
            {report?.bookings.pending || 0}
          </div>
          <div className="text-[11px] text-amber-600/80 mt-0.5">Needs action</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-emerald-700">Approved Bookings</span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
            {report?.bookings.approved || 0}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Active / Scheduled</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Declined / Closed</span>
          <div className="text-2xl font-bold font-mono text-slate-700 mt-1 tabular-nums">
            {(report?.bookings.rejected || 0) + (report?.bookings.cancelled || 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Rejected or cancelled</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Registered Users</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {report?.users.total || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {report?.users.students} Students · {report?.users.faculty} Faculty
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-amber-800">Under Maintenance</span>
          <div className="text-2xl font-bold font-mono text-amber-800 mt-1 tabular-nums">
            {report?.equipment.underMaintenance || 0}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">Offline for repairs</div>
        </div>
      </div>

      {/* 2-Column Section: Pending Approval Queue (Left) & Demand Metrics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Pending Approval Quick Actions */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Pending Approval Queue</h2>
              <p className="text-xs text-slate-500">Awaiting your authorization</p>
            </div>
            <button
              onClick={() => onNavigate('admin-bookings')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Master Table ({report?.bookings.pending}) →
            </button>
          </div>

          {pendingBookings.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-medium">All booking requests have been reviewed!</p>
              <p className="text-[11px] text-slate-400 mt-0.5">No pending requests in the queue.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingBookings.map((b) => (
                <div key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-xs">{b.equipmentName}</span>
                      <span className="text-[11px] text-indigo-700 bg-indigo-50 font-medium px-1.5 py-0.5 rounded">
                        {b.quantity} unit(s)
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-medium">
                      Requested by {b.userName} ({b.userRole})
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                      {b.bookingDate} · {b.startTime} - {b.endTime}
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1 italic">
                      "{b.purpose}"
                    </p>
                  </div>

                  {/* Quick Action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActionBooking({ booking: b, action: 'approve' })}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Approve booking"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => setActionBooking({ booking: b, action: 'reject' })}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Reject with remarks"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Most Frequently Booked Equipment & Quick Links */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Highest Demand Equipment
            </h2>

            <div className="space-y-3">
              {report?.mostBooked.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-mono font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-800 line-clamp-1">{item.name}</div>
                      <div className="text-[11px] text-slate-400">{item.category}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    <span className="font-bold text-indigo-600">{item.count} bookings</span>
                    <span className="text-[10px] text-slate-400 block">({item.unitsRequested} units)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Navigation Quick-Links */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-sm text-slate-100">Administrator Navigation</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigate('admin-equipment')}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-left transition-colors"
              >
                <Building2 className="w-4 h-4 text-indigo-400 mb-1" />
                <div className="font-semibold text-white">Asset Inventory</div>
                <div className="text-[10px] text-slate-400">Add, edit, remove</div>
              </button>

              <button
                onClick={() => onNavigate('admin-users')}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-left transition-colors"
              >
                <Users className="w-4 h-4 text-indigo-400 mb-1" />
                <div className="font-semibold text-white">User Accounts</div>
                <div className="text-[10px] text-slate-400">Roles & permissions</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={actionBooking !== null}
        title={actionBooking?.action === 'approve' ? 'Approve Equipment Request' : 'Decline Booking Request'}
        message={
          actionBooking?.action === 'approve'
            ? `Approve booking for "${actionBooking.booking.equipmentName}" requested by ${actionBooking.booking.userName} on ${actionBooking.booking.bookingDate}?`
            : `Decline booking for "${actionBooking?.booking.equipmentName}" requested by ${actionBooking?.booking.userName}? Please supply a mandatory reason for the user.`
        }
        confirmText={actionBooking?.action === 'approve' ? 'Confirm Approval' : 'Submit Rejection'}
        isDestructive={actionBooking?.action === 'reject'}
        requireReason={actionBooking?.action === 'reject'}
        reasonPlaceholder={
          actionBooking?.action === 'approve'
            ? 'Optional pickup instructions (e.g. collect from Room 102)'
            : 'Specify reason (e.g. conflicting high-priority exam session or scheduled maintenance)'
        }
        onConfirm={handleConfirmAction}
        onClose={() => setActionBooking(null)}
      />
    </div>
  );
};
