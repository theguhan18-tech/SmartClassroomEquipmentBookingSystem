import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  requireReason?: boolean;
  reasonPlaceholder?: string;
  onConfirm: (reason?: string) => void;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  requireReason = false,
  reasonPlaceholder = 'Please enter remarks or reason...',
  onConfirm,
  onClose,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) {
      setError('A reason or remark is required to proceed.');
      return;
    }
    setError('');
    onConfirm(reason.trim());
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-lg">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            {message}
          </p>

          {requireReason && (
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Admin Remarks / Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                rows={3}
                placeholder={reasonPlaceholder}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
