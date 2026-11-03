import React, { useState } from 'react';
import { Building2, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onNavigate: (view: string) => void;
  onSuccessNavigate?: (view: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onSuccessNavigate }) => {
  const { login, switchDemoUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      if (onSuccessNavigate) {
        onSuccessNavigate('dashboard');
      } else {
        onNavigate('dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string, targetView: string) => {
    setError('');
    setSubmitting(true);
    try {
      await switchDemoUser(demoEmail, demoPass);
      onNavigate(targetView);
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Portal Login</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access smart classroom & laboratory equipment booking
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Campus Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu"
                className="w-full text-xs rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Account Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Login Personas for Course Testing */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Instant Evaluation Personas
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@college.edu', 'Admin@123', 'admin-dashboard')}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-200 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-slate-900">Dr. K. S. Ramanathan</div>
                <div className="text-[11px] text-slate-500">Administrator Console</div>
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded">
                Admin
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('akhil.24bcs017@college.edu', 'Student@123', 'dashboard')}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-200 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-slate-900">B S Akhil Kartthick</div>
                <div className="text-[11px] text-slate-500">Student (24BCS017)</div>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded">
                Student
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('prof.guhan@college.edu', 'Faculty@123', 'dashboard')}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-200 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-slate-900">Prof. P. Guhan</div>
                <div className="text-[11px] text-slate-500">Faculty (CSE Dept)</div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded">
                Faculty
              </span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an academic account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};
