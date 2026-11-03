import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Calendar, 
  Clock, 
  Layers, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Equipment, AvailabilityResult } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface CreateBookingPageProps {
  equipment: Equipment | null;
  equipmentList: Equipment[];
  onBack: () => void;
  onSuccess: (bookingId: string) => void;
  prefill?: {
    date: string;
    startTime: string;
    endTime: string;
    quantity: number;
  };
}

export const CreateBookingPage: React.FC<CreateBookingPageProps> = ({
  equipment: initialEquipment,
  equipmentList,
  onBack,
  onSuccess,
  prefill,
}) => {
  const { user } = useAuth();
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>(
    initialEquipment ? initialEquipment.id : equipmentList[0]?.id || ''
  );

  const selectedEquipment = equipmentList.find(e => e.id === selectedEquipmentId) || initialEquipment;

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [bookingDate, setBookingDate] = useState(prefill?.date || tomorrow);
  const [startTime, setStartTime] = useState(prefill?.startTime || '10:00');
  const [endTime, setEndTime] = useState(prefill?.endTime || '12:00');
  const [quantity, setQuantity] = useState<number>(prefill?.quantity || 1);
  const [purpose, setPurpose] = useState('');
  
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Automatically check availability whenever equipment, date, startTime, or endTime change
  useEffect(() => {
    if (!selectedEquipmentId || !bookingDate || !startTime || !endTime) return;
    if (endTime <= startTime) return;

    let isMounted = true;
    setCheckingAvailability(true);

    api.checkAvailability(selectedEquipmentId, bookingDate, startTime, endTime, quantity)
      .then(res => {
        if (isMounted && res.success) {
          setAvailability(res.data);
          setError('');
        }
      })
      .catch(err => {
        if (isMounted) {
          setAvailability(null);
        }
      })
      .finally(() => {
        if (isMounted) setCheckingAvailability(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedEquipmentId, bookingDate, startTime, endTime, quantity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEquipment) {
      setError('Please select an equipment asset.');
      return;
    }

    if (bookingDate < todayStr) {
      setError('Cannot book dates in the past.');
      return;
    }

    if (endTime <= startTime) {
      setError('End time must be later than start time.');
      return;
    }

    if (quantity <= 0) {
      setError('Requested quantity must be at least 1 unit.');
      return;
    }

    if (!purpose.trim()) {
      setError('Please provide the academic purpose or course description.');
      return;
    }

    if (availability && !availability.canFulfillRequest) {
      setError(`Requested quantity (${quantity}) exceeds available units (${availability.availableQuantity}) for this slot.`);
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const res = await api.createBooking({
        equipmentId: selectedEquipment.id,
        bookingDate,
        startTime,
        endTime,
        quantity,
        purpose,
      });

      if (res.success && res.data) {
        onSuccess(res.data.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Equipment Catalog</span>
        </button>
        <span className="text-xs text-slate-500 font-mono">
          User: <strong>{user?.name}</strong> ({user?.role?.toUpperCase()})
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Booking Form (Left 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Create Equipment Reservation
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select date, operational hours, and specify the academic purpose for administrator verification.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Equipment selection */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Select Equipment Asset <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedEquipmentId}
                onChange={(e) => setSelectedEquipmentId(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white"
              >
                {equipmentList.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name} ({eq.category}) — {eq.location}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Booking Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  min={todayStr}
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            {/* Time Slot Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Start Time <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  End Time <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Requested Units <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  min="1"
                  max={selectedEquipment?.totalQuantity || 10}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                  className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-mono"
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Academic Purpose & Venue <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Software Agile sprint demonstration in Seminar Hall 2, or Lab Practical session..."
                className="w-full text-xs rounded-xl border border-slate-300 p-3 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* Real-time backend concurrency feedback */}
            {availability && (
              <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                availability.canFulfillRequest
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center gap-2">
                  {availability.canFulfillRequest ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold">
                      {availability.canFulfillRequest ? 'Slot Available' : 'Insufficient Units'}
                    </span>
                    <span className="block text-[11px] text-slate-600 font-mono tabular-nums">
                      Remaining for this slot: {availability.availableQuantity} of {availability.totalQuantity} (Reserved: {availability.reservedQuantity})
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || (availability !== null && !availability.canFulfillRequest)}
              className={`w-full py-3 px-4 text-xs font-semibold rounded-xl shadow-xs transition-colors mt-2 ${
                availability?.canFulfillRequest !== false
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Submitting Reservation...' : 'Submit Booking Request'}
            </button>
          </form>
        </div>

        {/* Selected Equipment Summary Sidebar (Right 5 cols) */}
        {selectedEquipment && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Selected Equipment Profile
            </h3>

            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-44">
              <img
                src={selectedEquipment.image}
                alt={selectedEquipment.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-base">{selectedEquipment.name}</h4>
              <span className="text-[11px] text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded inline-block mt-1">
                {selectedEquipment.category}
              </span>
              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                {selectedEquipment.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-medium text-slate-900 truncate max-w-[180px]">{selectedEquipment.location}</span>
              </div>
              <div className="flex justify-between">
                <span>Condition:</span>
                <span className="font-medium text-slate-900">{selectedEquipment.condition}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Pool:</span>
                <span className="font-mono font-medium text-slate-900">{selectedEquipment.totalQuantity} units</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                Booking Rule Governance:
              </div>
              <p>• Requests are held in pending status until reviewed by campus admins.</p>
              <p>• Cancel anytime prior to collection to release inventory back to other students and faculty.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
