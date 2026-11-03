import React from 'react';
import { MapPin, CheckCircle2, AlertTriangle, ArrowRight, Layers, ShieldCheck } from 'lucide-react';
import { Equipment } from '../types';
import { StatusBadge } from './StatusBadge';

interface EquipmentCardProps {
  equipment: Equipment;
  onViewDetails: (equipment: Equipment) => void;
  onBookNow?: (equipment: Equipment) => void;
  onEdit?: (equipment: Equipment) => void;
  isAdmin?: boolean;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  equipment,
  onViewDetails,
  onBookNow,
  onEdit,
  isAdmin = false,
}) => {
  const isAvailable = equipment.status === 'Available' && equipment.availableQuantity > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Image container */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={equipment.image}
          alt={equipment.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
          onError={(e) => {
            // Fallback gradient with icon
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={equipment.status} size="sm" />
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-medium text-slate-700 shadow-xs">
          {equipment.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {equipment.name}
          </h3>

          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {equipment.description}
          </p>

          <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{equipment.location}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Inventory Pool:</span>
              </div>
              <span className="font-mono tabular-nums font-medium text-slate-800">
                {equipment.totalQuantity} units
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {isAvailable ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>Base Available:</span>
              </div>
              <span className={`font-mono tabular-nums font-semibold ${isAvailable ? 'text-emerald-700' : 'text-amber-700'}`}>
                {equipment.availableQuantity} of {equipment.totalQuantity}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => onViewDetails(equipment)}
            className="flex-1 py-2 px-3 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-center"
          >
            Details & Specs
          </button>

          {isAdmin ? (
            <button
              onClick={() => onEdit && onEdit(equipment)}
              className="py-2 px-3 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
            >
              Edit Asset
            </button>
          ) : (
            <button
              onClick={() => onBookNow && onBookNow(equipment)}
              disabled={equipment.status !== 'Available'}
              className={`py-2 px-3 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors ${
                equipment.status === 'Available'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Book</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
