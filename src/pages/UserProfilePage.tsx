import React, { useState } from 'react';
import { User as UserIcon, Mail, Building2, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const UserProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [studentIdOrStaffId, setStudentIdOrStaffId] = useState(user?.studentIdOrStaffId || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await api.updateUserProfile(user.id, {
        name,
        department,
        phone,
        studentIdOrStaffId,
      });

      if (res.success) {
        setMessage({ type: 'success', text: 'Profile details updated successfully.' });
        refreshUser();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-xs">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
            <span className="mt-1.5 inline-block capitalize font-semibold text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
              {user.role} Account · Status: {user.status}
            </span>
          </div>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-xl border text-xs ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-600 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-500 font-mono"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Campus email is bound to your account and cannot be altered.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {user.role === 'student' ? 'Student Roll Number' : 'Employee ID'}
              </label>
              <input
                type="text"
                value={studentIdOrStaffId}
                onChange={(e) => setStudentIdOrStaffId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-600 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors mt-2"
          >
            {saving ? 'Updating Profile...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
