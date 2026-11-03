import React from 'react';
import { Building2, Shield, Users, Layers, GraduationCap } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: System Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Smart Classroom Equipment Booking System
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-4">
              A centralized web-based MERN platform designed for smart classroom, laboratory, and audio-visual equipment reservation with automated concurrency checks and inventory governance.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 px-3 py-1.5 rounded-md">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Course: <strong>Software Agile and Practices</strong></span>
            </div>
          </div>

          {/* Col 2: Project Team Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              Project Team
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex flex-col">
                <span className="font-medium text-slate-200">B S Akhil Kartthick</span>
                <span className="font-mono text-slate-400 text-[11px]">Roll No: 24BCS017</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium text-slate-200">R Govarthanan</span>
                <span className="font-mono text-slate-400 text-[11px]">Roll No: 24BCS082</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium text-slate-200">P Guhan</span>
                <span className="font-mono text-slate-400 text-[11px]">Roll No: 24BCS085</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Modules & Docs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-white transition-colors"
                >
                  Equipment Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  SRS & Traceability Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  Architecture & API Specs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="hover:text-white transition-colors"
                >
                  Campus Portal Login
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom border & copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Smart Classroom Equipment Booking System. Developed for Software Agile and Practices.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-[11px]">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              MERN Stack Architecture
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
