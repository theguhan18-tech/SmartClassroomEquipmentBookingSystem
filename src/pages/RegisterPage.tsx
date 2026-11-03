import React, { useState } from 'react';
import { Building2, Lock, Mail, User as UserIcon, GraduationCap, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RegisterPageProps {
  onNavigate: (view: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [department, setDepartment] = useState('Computer Science and Engineering');
  const [studentIdOrStaffId, setStudentIdOrStaffId] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await register({
        name,
        email,
        role,
        department,
        studentIdOrStaffId,
        phone,
        password,
        confirmPassword,
      });
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Academic Account</h1>
          <p className="text-xs text-slate-500 mt-1">
            Register as student or faculty to reserve classroom and laboratory equipment
          </p>
        </div>

        {/* Security Rule Warning */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
          <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-slate-800">RBAC Security Notice:</strong> Public registration is strictly limited to <strong>Student</strong> and <strong>Faculty</strong> roles. Administrator accounts are provisioned exclusively through authorized campus infrastructure controls.
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. B S Akhil Kartthick"
                  className="w-full text-xs rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Academic Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full text-xs rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Role Classification <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    role === 'student'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('faculty')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    role === 'faculty'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Faculty
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {role === 'student' ? 'Student Roll Number' : 'Staff Employee ID'}
              </label>
              <input
                type="text"
                value={studentIdOrStaffId}
                onChange={(e) => setStudentIdOrStaffId(e.target.value)}
                placeholder={role === 'student' ? 'e.g. 24BCS017' : 'e.g. FAC-CSE-085'}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Department / Program
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white"
              >
                <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Science & Humanities">Science & Humanities</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full text-xs rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full text-xs rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors mt-2"
          >
            {submitting ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already registered on the platform?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
