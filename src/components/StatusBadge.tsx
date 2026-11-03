import React from 'react';
import { BookingStatus } from '../types';

interface StatusBadgeProps {
  status: BookingStatus | 'Available' | 'Under Maintenance' | 'Decommissioned' | 'active' | 'suspended';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyles = () => {
    switch (status) {
      case 'approved':
      case 'Available':
      case 'active':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'pending':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'rejected':
      case 'suspended':
      case 'Decommissioned':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'cancelled':
        return 'text-slate-600 bg-slate-100 border-slate-200';
      case 'Under Maintenance':
        return 'text-amber-800 bg-amber-100/70 border-amber-300';
      case 'returned':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'pending': return 'Pending Review';
      case 'rejected': return 'Declined';
      case 'cancelled': return 'Cancelled';
      case 'returned': return 'Returned';
      case 'Available': return 'Available';
      case 'Under Maintenance': return 'Under Maintenance';
      case 'Decommissioned': return 'Decommissioned';
      case 'active': return 'Active';
      case 'suspended': return 'Suspended';
      default: return status;
    }
  };

  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-medium rounded-md border ${getStyles()} ${pad} whitespace-nowrap`}>
      {getLabel()}
    </span>
  );
};
