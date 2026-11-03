import React from 'react';
import { 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Plus, 
  Building2, 
  User as UserIcon,
  Sparkles,
  Eye
} from 'lucide-react';
import { Booking, Equipment } from '../types';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';

interface UserDashboardPageProps {
  bookings: Booking[];
  equipmentList: Equipment[];
  onNavigate: (view: string) => void;
  onViewBooking: (b: Booking) => void;
  onViewEquipment: (e: Equipment) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  bookings,
  equipmentList,
  onNavigate,
  onViewBooking,
  onViewEquipment,
}) => {
  const { user } = useAuth();

  const totalBookings = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const approvedCount = bookings.filter(b => b.status === 'approved').length;
  const rejectedCount = bookings.filter(b => b.status === 'rejected').length;

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const availableEquipment = equipmentList.filter(e => e.status === 'Available').slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <span className="capitalize">{user?.role} Portal</span>
            <span className="text-slate-300">·</span>
            <span>{user?.department}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track equipment allocation, manage classroom reservations, and review approval updates.
          </p>
        </div>

        <button
          onClick={() => onNavigate('catalog')}
          className="px-5 py-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Equipment Reservation</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Requests</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            {totalBookings}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">All academic bookings submitted</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-700">Pending Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-700 mt-2 tabular-nums">
            {pendingCount}
          </div>
          <div className="text-[11px] text-amber-600/80 mt-1">Awaiting administrator approval</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-700">Approved Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-700 mt-2 tabular-nums">
            {approvedCount}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-1">Confirmed and ready for pickup</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Declined / Closed</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-700 mt-2 tabular-nums">
            {rejectedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Declined or returned assets</div>
        </div>
      </div>

      {/* 2-Column Split: Recent Bookings (Left) & Quick Available Equipment (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Bookings */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Booking Requests</h2>
              <p className="text-xs text-slate-500">Latest reservation status for your account</p>
            </div>
            <button
              onClick={() => onNavigate('my-bookings')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View All ({bookings.length}) →
            </button>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-10">
              <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No bookings created yet.</p>
              <button
                onClick={() => onNavigate('catalog')}
                className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
              >
                Browse Equipment Catalog
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  onClick={() => onViewBooking(b)}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={b.status} size="sm" />
                      <span className="font-semibold text-slate-900 text-xs">{b.equipmentName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {b.bookingDate} · {b.startTime}-{b.endTime} · {b.quantity} unit(s)
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Fast Reserve Recommendations */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Featured Available Gear</h2>
              <p className="text-xs text-slate-500">Fast checkout for active smart gear</p>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Browse →
            </button>
          </div>

          <div className="space-y-3">
            {availableEquipment.map((eq) => (
              <div
                key={eq.id}
                className="p-3 rounded-xl border border-slate-200/90 hover:border-indigo-300 transition-colors flex items-center gap-3 bg-slate-50/50"
              >
                <img
                  src={eq.image}
                  alt={eq.name}
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-xs truncate">{eq.name}</h3>
                  <div className="text-[11px] text-slate-500 truncate">{eq.location}</div>
                  <div className="text-[11px] font-mono font-medium text-emerald-700 mt-0.5">
                    {eq.availableQuantity} units available
                  </div>
                </div>
                <button
                  onClick={() => onViewEquipment(eq)}
                  className="px-2.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shrink-0"
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
