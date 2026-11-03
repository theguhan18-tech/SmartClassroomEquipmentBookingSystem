import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Calendar, 
  Clock, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { Equipment, AvailabilityResult } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';

interface EquipmentDetailsModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToBook: (equipment: Equipment, prefill?: { date: string; startTime: string; endTime: string; quantity: number }) => void;
}

export const EquipmentDetailsModal: React.FC<EquipmentDetailsModalProps> = ({
  equipment,
  isOpen,
  onClose,
  onProceedToBook,
}) => {
  if (!isOpen || !equipment) return null;

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [checkDate, setCheckDate] = useState(tomorrow);
  const [checkStartTime, setCheckStartTime] = useState('09:00');
  const [checkEndTime, setCheckEndTime] = useState('11:00');
  const [checkQuantity, setCheckQuantity] = useState(1);
  const [checking, setChecking] = useState(false);
  const [availResult, setAvailResult] = useState<AvailabilityResult | null>(null);
  const [checkError, setCheckError] = useState('');

  const handleRunAvailabilityCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkEndTime <= checkStartTime) {
      setCheckError('End time must be later than start time.');
      return;
    }

    setCheckError('');
    setChecking(true);
    try {
      const res = await api.checkAvailability(
        equipment.id,
        checkDate,
        checkStartTime,
        checkEndTime,
        checkQuantity
      );
      if (res.success) {
        setAvailResult(res.data);
      }
    } catch (err: any) {
      setCheckError(err.message || 'Failed to check availability.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-8">
        {/* Header bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <StatusBadge status={equipment.status} size="sm" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {equipment.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Visual & Info */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
            <div className="sm:col-span-5">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-48 sm:h-56">
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="sm:col-span-7 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {equipment.name}
              </h2>
              {equipment.modelNumber && (
                <div className="text-xs font-mono text-indigo-700 bg-indigo-50 inline-block px-2 py-0.5 rounded">
                  Model: {equipment.modelNumber}
                </div>
              )}
              <p className="text-xs text-slate-600 leading-relaxed">
                {equipment.description}
              </p>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span><strong>Location:</strong> {equipment.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                  <span><strong>Physical Condition:</strong> {equipment.condition}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-400 shrink-0" />
                  <span><strong>Total Inventory Pool:</strong> <span className="font-mono tabular-nums">{equipment.totalQuantity} units</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          {equipment.specifications && equipment.specifications.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                Technical Specifications & Highlights
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                {equipment.specifications.map((spec, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interactive Real-Time Availability Checker */}
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                Live Slot Availability Calculator
              </h3>
              <span className="text-[11px] text-slate-500">Backend concurrency verified</span>
            </div>

            <form onSubmit={handleRunAvailabilityCheck} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={checkDate}
                  onChange={(e) => setCheckDate(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">From</label>
                <input
                  type="time"
                  required
                  value={checkStartTime}
                  onChange={(e) => setCheckStartTime(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">To</label>
                <input
                  type="time"
                  required
                  value={checkEndTime}
                  onChange={(e) => setCheckEndTime(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Units</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max={equipment.totalQuantity}
                    required
                    value={checkQuantity}
                    onChange={(e) => setCheckQuantity(parseInt(e.target.value, 10) || 1)}
                    className="w-16 text-xs rounded-lg border border-slate-300 p-2 bg-white outline-none focus:border-indigo-600 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={checking}
                    className="flex-1 py-2 px-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {checking ? 'Checking...' : 'Check'}
                  </button>
                </div>
              </div>
            </form>

            {checkError && (
              <p className="text-xs text-rose-600">{checkError}</p>
            )}

            {availResult && (
              <div className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                availResult.canFulfillRequest
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="space-y-0.5">
                  <div className="font-semibold flex items-center gap-1.5">
                    {availResult.canFulfillRequest ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                    <span>
                      {availResult.canFulfillRequest
                        ? 'Selected Time Slot is Available'
                        : 'Slot Partially / Fully Reserved'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono tabular-nums">
                    Available Units: <strong>{availResult.availableQuantity}</strong> of {availResult.totalQuantity} (Reserved: {availResult.reservedQuantity})
                  </div>
                </div>

                {availResult.canFulfillRequest && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onProceedToBook(equipment, {
                        date: checkDate,
                        startTime: checkStartTime,
                        endTime: checkEndTime,
                        quantity: checkQuantity,
                      });
                    }}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-xs transition-colors shrink-0"
                  >
                    Lock This Slot →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onProceedToBook(equipment);
            }}
            disabled={equipment.status !== 'Available'}
            className={`px-5 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors ${
              equipment.status === 'Available'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Proceed to Reservation Form</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
