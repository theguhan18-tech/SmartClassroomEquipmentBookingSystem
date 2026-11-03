import React from 'react';
import { 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Users, 
  Laptop, 
  Tv, 
  Mic2, 
  CheckCircle,
  Sparkles,
  Search,
  Layers
} from 'lucide-react';
import { Equipment } from '../types';

interface HomePageProps {
  onNavigate: (view: string) => void;
  featuredEquipment: Equipment[];
  onViewEquipment: (equipment: Equipment) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  featuredEquipment,
  onViewEquipment,
}) => {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Software Agile and Practices Course Project</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Smart Equipment Booking. <br />
                <span className="text-indigo-600">Smarter Classrooms.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Discover, reserve, and manage classroom and laboratory equipment through one centralized platform. Designed with real-time conflict prevention and academic role governance.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('catalog')}
                  className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
                >
                  <span>Explore Equipment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('register')}
                  className="px-6 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all"
                >
                  Get Started
                </button>
              </div>

              {/* Quick trust metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                <div>
                  <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">100%</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Automated Concurrency</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">&lt;2s</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Availability Check</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">3 Roles</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Student, Faculty & Admin</div>
                </div>
              </div>
            </div>

            {/* Right Image Feature */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 group bg-slate-900">
                <img
                  src="/src/assets/images/hero_smart_classroom_1793676017098.jpg"
                  alt="Modern Smart Classroom Lecture Hall"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-500 opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <div className="text-white font-semibold text-base">Campus Smart Lecture Hall Beta</div>
                  <p className="text-slate-300 text-xs mt-1">Equipped with 4K laser projectors, 20-point smart whiteboards, and digital lapel mics.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              Resource Inventory
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Equipment Categories
            </h3>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Browse All Categories →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Projectors', icon: Tv, desc: 'Laser 4K & ceiling units', count: '6 Units' },
            { name: 'Smart Boards', icon: Layers, desc: 'Interactive touchscreens', count: '4 Units' },
            { name: 'Audio & Mic', icon: Mic2, desc: 'Wireless UHF lavaliers', count: '10 Units' },
            { name: 'Laptops', icon: Laptop, desc: 'Workstations with CAD', count: '8 Units' },
            { name: 'Cables & AV', icon: ShieldCheck, desc: 'HDMI & Thunderbolt kits', count: '15 Units' },
            { name: 'Lab Kits', icon: Sparkles, desc: 'IoT & sensor bundles', count: '12 Units' },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => onNavigate('catalog')}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{cat.desc}</div>
                <div className="text-[11px] font-mono text-indigo-600 font-medium mt-2">{cat.count}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Equipment Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              Popular Equipment
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Smart Classroom Assets
            </h3>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View Full Inventory →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEquipment.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-xs font-semibold px-2 py-0.5 rounded text-indigo-700">
                    {item.category}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-slate-900 text-base">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Location: {item.location}</span>
                    <span className="font-mono font-medium text-emerald-700">{item.availableQuantity} available</span>
                  </div>
                </div>
              </div>
              <div className="p-4 pt-0">
                <button
                  onClick={() => onViewEquipment(item)}
                  className="w-full py-2 px-3 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-center"
                >
                  Check Availability & Specs
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works - 5 Step Process */}
      <section className="bg-slate-900 text-white py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
              Workflow Lifecycle
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              How the Booking System Works
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              From authentication to real-time inventory locking and administrator verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                title: 'Browse & Select',
                desc: 'Explore available classroom projectors, interactive boards, and lab gear.',
              },
              {
                step: '02',
                title: 'Check Schedule',
                desc: 'System calculates overlapping reservations and validates slot availability.',
              },
              {
                step: '03',
                title: 'Submit Request',
                desc: 'Provide academic purpose and submit booking request into the queue.',
              },
              {
                step: '04',
                title: 'Admin Verification',
                desc: 'Administrator reviews purpose, verifies inventory, and approves with remarks.',
              },
              {
                step: '05',
                title: 'Collect & Return',
                desc: 'Receive in-app notification and collect equipment from designated room.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-5 relative"
              >
                <div className="text-xs font-mono font-bold text-indigo-400 mb-2">{item.step}.</div>
                <h4 className="font-semibold text-slate-100 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Team Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                College Mini-Project
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Software Agile and Practices Course Team
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Developed as a comprehensive MERN software engineering submission.
              </p>
            </div>
            <button
              onClick={() => onNavigate('about')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              View Full SRS & Test Reports
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
              <div className="text-xs font-mono font-semibold text-indigo-600 uppercase">Team Member 01</div>
              <div className="text-base font-bold text-slate-900 mt-1">B S Akhil Kartthick</div>
              <div className="text-xs font-mono text-slate-500 mt-0.5">Roll No: 24BCS017</div>
              <div className="text-xs text-slate-600 mt-3">Computer Science and Engineering</div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
              <div className="text-xs font-mono font-semibold text-indigo-600 uppercase">Team Member 02</div>
              <div className="text-base font-bold text-slate-900 mt-1">R Govarthanan</div>
              <div className="text-xs font-mono text-slate-500 mt-0.5">Roll No: 24BCS082</div>
              <div className="text-xs text-slate-600 mt-3">Computer Science and Engineering</div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
              <div className="text-xs font-mono font-semibold text-indigo-600 uppercase">Team Member 03</div>
              <div className="text-base font-bold text-slate-900 mt-1">P Guhan</div>
              <div className="text-xs font-mono text-slate-500 mt-0.5">Roll No: 24BCS085</div>
              <div className="text-xs text-slate-600 mt-3">Computer Science and Engineering</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
