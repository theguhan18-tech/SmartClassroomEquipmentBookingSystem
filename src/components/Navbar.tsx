import React, { useState } from 'react';
import { 
  Building2, 
  Bell, 
  UserCircle, 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  BookOpen, 
  CalendarDays,
  Sparkles,
  Database,
  Server,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  unreadCount,
  onOpenNotifications,
}) => {
  const { user, logout, switchDemoUser } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single Brand Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left shrink-0 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg whitespace-nowrap">
            Smart Classroom Hub
          </span>
        </button>

        {/* Zone 2: 4-5 Clean Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('home')}
            className={`whitespace-nowrap transition-colors ${
              currentView === 'home' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('catalog')}
            className={`whitespace-nowrap transition-colors ${
              currentView === 'catalog' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Equipment
          </button>

          {user && (
            <button
              onClick={() => onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'dashboard')}
              className={`whitespace-nowrap transition-colors ${
                currentView === 'dashboard' || currentView === 'admin-dashboard' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>
          )}

          {user && user.role !== 'admin' && (
            <button
              onClick={() => onNavigate('my-bookings')}
              className={`whitespace-nowrap transition-colors ${
                currentView === 'my-bookings' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
              }`}
            >
              My Bookings
            </button>
          )}

          {user && user.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin-bookings')}
              className={`whitespace-nowrap transition-colors ${
                currentView === 'admin-bookings' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Approvals
            </button>
          )}

          <button
            onClick={() => onNavigate('about')}
            className={`whitespace-nowrap transition-colors ${
              currentView === 'about' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Project & Team
          </button>
        </nav>

        {/* Zone 3: Primary Action & User Profile Zone */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Live Express Server Database Status Badge */}
          <div 
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-[11px] font-medium"
            title="Express Server Database Active: Built-in persistent storage (/data/db.json). Zero external database setup needed!"
          >
            <Server className="w-3.5 h-3.5 text-emerald-600" />
            <span>Express DB: Active</span>
          </div>

          {/* Quick Demo Switcher Button for Testing Evaluation */}
          <div className="relative">
            <button
              onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors whitespace-nowrap"
              title="Switch demo role instantly"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Demo Role:</span>
              <span className="font-semibold capitalize text-indigo-700">
                {user ? user.role : 'Guest'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {demoDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs"
                onMouseLeave={() => setDemoDropdownOpen(false)}
              >
                <div className="px-3 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Instant Test Personas
                </div>
                <button
                  onClick={async () => {
                    await switchDemoUser('admin@college.edu', 'Admin@123');
                    setDemoDropdownOpen(false);
                    onNavigate('admin-dashboard');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-indigo-50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900">Dr. K. S. Ramanathan</div>
                    <div className="text-slate-500 text-[11px]">Administrator (Full Control)</div>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-700 font-medium px-1.5 py-0.5 rounded">Admin</span>
                </button>
                <button
                  onClick={async () => {
                    await switchDemoUser('akhil.24bcs017@college.edu', 'Student@123');
                    setDemoDropdownOpen(false);
                    onNavigate('dashboard');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-indigo-50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900">B S Akhil Kartthick</div>
                    <div className="text-slate-500 text-[11px]">Student (24BCS017)</div>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-medium px-1.5 py-0.5 rounded">Student</span>
                </button>
                <button
                  onClick={async () => {
                    await switchDemoUser('prof.guhan@college.edu', 'Faculty@123');
                    setDemoDropdownOpen(false);
                    onNavigate('dashboard');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-indigo-50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900">Prof. P. Guhan</div>
                    <div className="text-slate-500 text-[11px]">Faculty (CSE Dept)</div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-medium px-1.5 py-0.5 rounded">Faculty</span>
                </button>
              </div>
            )}
          </div>

          {user ? (
            <>
              {/* Notification Bell */}
              <button
                onClick={onOpenNotifications}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-600 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 rounded-lg hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-medium text-slate-800 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                      <p className="text-slate-500 text-[11px] truncate">{user.email}</p>
                      <span className="mt-1 inline-block capitalize font-medium text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {user.role} role
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('profile');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <UserCircle className="w-4 h-4 text-slate-400" />
                      User Profile
                    </button>

                    {user.role === 'admin' ? (
                      <>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onNavigate('admin-dashboard');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4 text-slate-400" />
                          Admin Console
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onNavigate('admin-equipment');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                        >
                          <Building2 className="w-4 h-4 text-slate-400" />
                          Asset Inventory
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate('my-bookings');
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                      >
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                        My Reservations
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        onNavigate('home');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-indigo-600 transition-colors whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === 'home' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('catalog');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === 'catalog' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Equipment Catalog
            </button>
            {user && (
              <button
                onClick={() => {
                  onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  currentView === 'dashboard' || currentView === 'admin-dashboard' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Dashboard
              </button>
            )}
            {user && user.role !== 'admin' && (
              <button
                onClick={() => {
                  onNavigate('my-bookings');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  currentView === 'my-bookings' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                My Bookings
              </button>
            )}
            {user && user.role === 'admin' && (
              <button
                onClick={() => {
                  onNavigate('admin-bookings');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  currentView === 'admin-bookings' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Booking Approvals
              </button>
            )}
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === 'about' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Project & Team Docs
            </button>
          </div>

          {/* Mobile Instant Role Switcher */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Switch Test Role
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={async () => {
                  await switchDemoUser('akhil.24bcs017@college.edu', 'Student@123');
                  setMobileMenuOpen(false);
                  onNavigate('dashboard');
                }}
                className="py-1.5 px-2 bg-blue-50 text-blue-700 rounded font-semibold text-center hover:bg-blue-100"
              >
                Student
              </button>
              <button
                onClick={async () => {
                  await switchDemoUser('prof.guhan@college.edu', 'Faculty@123');
                  setMobileMenuOpen(false);
                  onNavigate('dashboard');
                }}
                className="py-1.5 px-2 bg-emerald-50 text-emerald-700 rounded font-semibold text-center hover:bg-emerald-100"
              >
                Faculty
              </button>
              <button
                onClick={async () => {
                  await switchDemoUser('admin@college.edu', 'Admin@123');
                  setMobileMenuOpen(false);
                  onNavigate('admin-dashboard');
                }}
                className="py-1.5 px-2 bg-purple-50 text-purple-700 rounded font-semibold text-center hover:bg-purple-100"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
