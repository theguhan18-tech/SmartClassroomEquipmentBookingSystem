import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Edit2
} from 'lucide-react';
import { User, UserRole } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getUsers();
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchDept = u.department?.toLowerCase().includes(q);
      const matchId = u.studentIdOrStaffId?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchDept && !matchId) return false;
    }

    if (roleFilter !== 'All' && u.role !== roleFilter) {
      return false;
    }

    return true;
  });

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await api.updateUserRoleOrStatus(user.id, { status: nextStatus });
      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Account for ${user.name} is now ${nextStatus}.`,
        });
        fetchUsers();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to update user status.' });
    }
  };

  const handleChangeRole = async (user: User, newRole: UserRole) => {
    try {
      const res = await api.updateUserRoleOrStatus(user.id, { role: newRole });
      if (res.success) {
        setFeedback({
          type: 'success',
          text: `${user.name}'s role updated to ${newRole}.`,
        });
        fetchUsers();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to change role.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Campus Directory Governance</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Registered Users Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit campus student and faculty accounts, configure academic departments, and maintain access permissions.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors self-start sm:self-auto"
          title="Refresh user directory"
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
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, department, or student roll number..."
            className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-xs rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600 bg-white w-full sm:w-48"
        >
          <option value="All">All Roles</option>
          <option value="student">Students Only</option>
          <option value="faculty">Faculty Only</option>
          <option value="admin">Administrators Only</option>
        </select>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">User Profile</th>
                <th className="py-3 px-4">Academic ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Administrative Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-800">
                    {u.studentIdOrStaffId || '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {u.department}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      disabled={u.email === 'admin@college.edu'}
                      onChange={(e) => handleChangeRole(u, e.target.value as UserRole)}
                      className="text-xs rounded-lg border border-slate-200 py-1 px-2 font-medium capitalize bg-white focus:border-indigo-600 outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={u.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.email !== 'admin@college.edu' ? (
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                          u.status === 'active'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend Account' : 'Reactivate'}
                      </button>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-400 italic">Root Admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
