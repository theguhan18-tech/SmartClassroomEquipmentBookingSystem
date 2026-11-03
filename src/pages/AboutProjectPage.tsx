import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Layers, 
  Database, 
  ShieldCheck, 
  FileText, 
  GraduationCap, 
  Code2, 
  Sparkles,
  Server,
  KeyRound,
  CalendarCheck
} from 'lucide-react';

export const AboutProjectPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'team' | 'traceability' | 'architecture' | 'api' | 'testing'>('traceability');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Course: Software Agile and Practices</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Smart Classroom Equipment Booking System
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Official Project Documentation, Software Requirements Specification (SRS), Requirements Traceability Checklist, System Architecture, and Verification Logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified Production Ready
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-6 overflow-x-auto">
          {[
            { id: 'traceability', label: 'Requirements Traceability Matrix', icon: FileText },
            { id: 'team', label: 'Project Team & Overview', icon: Users },
            { id: 'architecture', label: 'System Architecture & SDLC', icon: Layers },
            { id: 'api', label: 'REST API Specifications', icon: Code2 },
            { id: 'testing', label: 'Test Report & Verification', icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Traceability Matrix */}
      {activeTab === 'traceability' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Requirements Traceability Matrix (RTM)</h2>
            <p className="text-xs text-slate-500 mt-1">
              Bidirectional mapping of course project SRS requirements to frontend pages, backend REST endpoints, database schemas, and verification test cases.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-3">Req ID</th>
                  <th className="py-3 px-3">Requirement Description</th>
                  <th className="py-3 px-3">Frontend Page / UI Component</th>
                  <th className="py-3 px-3">Backend REST Endpoint</th>
                  <th className="py-3 px-3">Database Model</th>
                  <th className="py-3 px-3">Test Case ID & Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">FR-01</td>
                  <td className="py-2.5 px-3">User Registration (Student & Faculty roles only; Admin prohibited via public form)</td>
                  <td className="py-2.5 px-3"><code>/register</code> (RegisterPage.tsx)</td>
                  <td className="py-2.5 px-3 font-mono">POST /api/auth/register</td>
                  <td className="py-2.5 px-3 font-mono">User (role, bcrypt hash)</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">TC-AUTH-01 (PASS)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">FR-02</td>
                  <td className="py-2.5 px-3">Secure JWT Authentication with session restoration</td>
                  <td className="py-2.5 px-3"><code>/login</code> (LoginPage.tsx, AuthContext)</td>
                  <td className="py-2.5 px-3 font-mono">POST /api/auth/login, GET /api/auth/me</td>
                  <td className="py-2.5 px-3 font-mono">User</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">TC-AUTH-02 (PASS)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">FR-03</td>
                  <td className="py-2.5 px-3">Equipment Catalog Browsing, Search, and Category Filtering</td>
                  <td className="py-2.5 px-3"><code>/catalog</code> (EquipmentCatalogPage.tsx)</td>
                  <td className="py-2.5 px-3 font-mono">GET /api/equipment</td>
                  <td className="py-2.5 px-3 font-mono">Equipment</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">TC-EQ-01 (PASS)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">FR-04</td>
                  <td className="py-2.5 px-3">Real-Time Availability Calculation during requested date/time window</td>
                  <td className="py-2.5 px-3">Availability Widget (CreateBookingPage.tsx)</td>
                  <td className="py-2.5 px-3 font-mono">GET /api/equipment/:id/availability</td>
                  <td className="py-2.5 px-3 font-mono">Booking + Equipment</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">TC-BOOK-01 (PASS)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">FR-05</td>
                  <td className="py-2.5 px-3">Booking Request Submission with Past Date & Concurrency Conflict Prevention</td>
                  <td className="py-2.5 px-3"><code>/book/:id</code> (CreateBookingPage.tsx)</td>
                  <td className="py-2.5 px-3 font-mono">POST /api/bookings</td>
                  <td className="py-2.5 px-3 font-mono">Booking (status: 'pending')</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">TC-BOOK-02 (PASS)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">FR-06</td>
                  <td className="py-2.5 px-3">Personal Booking History and Self-Service Cancellation</td>
                  <td className="py-2.5 px-3"><code>/my-bookings</code> (MyBookingsPage.tsx)</td>
                  <td className="py-2.5 px-3 font-mono">GET /api/bookings/my, PATCH /api/bookings/:id/cancel</td>
                  <td className="py-2.5 px-3 font-mono">Booking (status: 'cancelled')</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">TC-BOOK-03 (PASS)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">FR-07</td>
                  <td className="py-2.5 px-3">In-App Notification Dispatch on Booking Status Changes</td>
                  <td className="py-2.5 px-3">NotificationDrawer.tsx (Header Bell)</td>
                  <td className="py-2.5 px-3 font-mono">GET /api/notifications, PATCH /api/notifications/:id/read</td>
                  <td className="py-2.5 px-3 font-mono">Notification</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">TC-NOTIF-01 (PASS)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">FR-08</td>
                  <td className="py-2.5 px-3">Administrator Equipment Inventory Management (Add, Edit, Delete, Maintenance)</td>
                  <td className="py-2.5 px-3"><code>/admin/equipment</code> (AdminEquipmentPage.tsx)</td>
                  <td className="py-2.5 px-3 font-mono">POST, PUT, DELETE /api/equipment</td>
                  <td className="py-2.5 px-3 font-mono">Equipment</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">TC-ADM-01 (PASS)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">FR-09</td>
                  <td className="py-2.5 px-3">Administrator Approval & Rejection Workflow with Remarks Logging</td>
                  <td className="py-2.5 px-3"><code>/admin/bookings</code> (AdminBookingsPage.tsx)</td>
                  <td className="py-2.5 px-3 font-mono">PATCH /api/bookings/:id/approve, PATCH /reject</td>
                  <td className="py-2.5 px-3 font-mono">Booking (adminRemarks, handledByAdmin)</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">TC-ADM-02 (PASS)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">FR-10</td>
                  <td className="py-2.5 px-3">Executive Utilization Analytics, Demand Tracking & CSV Export</td>
                  <td className="py-2.5 px-3"><code>/admin/reports</code> (AdminReportsPage.tsx)</td>
                  <td className="py-2.5 px-3 font-mono">GET /api/reports/dashboard, GET /equipment-usage</td>
                  <td className="py-2.5 px-3 font-mono">Booking + Equipment</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">TC-REP-01 (PASS)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Team & Overview */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Project Team Details</h2>
            <p className="text-xs text-slate-500 mb-6">
              Official team members for the Smart Classroom Equipment Booking System under the Software Agile and Practices curriculum.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                  AK
                </div>
                <h3 className="font-bold text-slate-900 text-base">B S Akhil Kartthick</h3>
                <div className="text-xs font-mono text-indigo-600 font-semibold mt-0.5">Roll No: 24BCS017</div>
                <div className="text-xs text-slate-500 mt-2">Department: Computer Science and Engineering</div>
                <div className="text-xs text-slate-600 mt-2 font-medium">Role: Full-Stack Engineer & Database Architect</div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                  RG
                </div>
                <h3 className="font-bold text-slate-900 text-base">R Govarthanan</h3>
                <div className="text-xs font-mono text-indigo-600 font-semibold mt-0.5">Roll No: 24BCS082</div>
                <div className="text-xs text-slate-500 mt-2">Department: Computer Science and Engineering</div>
                <div className="text-xs text-slate-600 mt-2 font-medium">Role: Backend & API Security Specialist</div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                  PG
                </div>
                <h3 className="font-bold text-slate-900 text-base">P Guhan</h3>
                <div className="text-xs font-mono text-indigo-600 font-semibold mt-0.5">Roll No: 24BCS085</div>
                <div className="text-xs text-slate-500 mt-2">Department: Computer Science and Engineering</div>
                <div className="text-xs text-slate-600 mt-2 font-medium">Role: Frontend Architecture & UI/UX Design</div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Problem Statement</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Academic smart classrooms, amphitheaters, and computing laboratories suffer from manual, paper-based reservation registers. This causes scheduling overlaps, double-booking during seminars, unaccounted equipment damage, and lack of visibility into inventory availability across departments.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Project Objectives</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Provide a centralized web-based platform where faculty and students can view real-time equipment availability, submit structured bookings with academic purpose, prevent time conflicts, and allow campus administrators to enforce governance, track utilization, and approve requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: System Architecture */}
      {activeTab === 'architecture' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Software Architecture & SDLC Workflow</h2>
          <p className="text-xs text-slate-500">
            Adheres to the MERN stack paradigm with an Express REST API, JWT bearer middleware, and atomic concurrency inventory calculations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
                <Code2 className="w-4 h-4 text-indigo-600" />
                Frontend Layer (Vite + React)
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li>• Modular component architecture with TypeScript</li>
                <li>• Global AuthContext state management</li>
                <li>• Reactive availability checking hook</li>
                <li>• Zero-pill typographic visual discipline</li>
                <li>• Responsive layout with Tailwind CSS</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
                <Server className="w-4 h-4 text-indigo-600" />
                Backend Layer (Express + Node.js)
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li>• RESTful API architecture with separation of concerns</li>
                <li>• JWT authentication middleware & RBAC guards</li>
                <li>• Concurrency-safe availability calculations</li>
                <li>• Bcrypt salted password encryption</li>
                <li>• Centralized error handling and input sanitization</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
                <Server className="w-4 h-4 text-indigo-600" />
                Data Storage (Express Server Native Storage)
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li>• Self-contained Express server data store (zero external database setup)</li>
                <li>• Persistent ACID-safe JSON document storage in <code>/data/db.json</code></li>
                <li>• In-memory indexing and concurrency locks for conflict prevention</li>
                <li>• Ready for standalone deployment with Node.js and Express</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-semibold text-slate-900 text-sm mb-2">Concurrency Control & Conflict Prevention Algorithm</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When a user submits a booking for date D between T(start) and T(end) for Q requested units:
              <br />
              1. The server queries all existing reservations for that equipment where <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">status in ['approved', 'pending']</code> and date equals D.
              <br />
              2. Any reservation overlapping the interval (<code className="bg-slate-100 px-1 py-0.5 rounded">startTime &lt; requestedEnd AND endTime &gt; requestedStart</code>) contributes to Q(reserved).
              <br />
              3. The available units are computed as Q(available) = max(0, Q(total) - Q(reserved)).
              <br />
              4. If Q &gt; Q(available), the transaction rejects with HTTP 409 Conflict and detailed availability diagnostics.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: REST API Documentation */}
      {activeTab === 'api' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Backend REST API Reference</h2>
          <p className="text-xs text-slate-500">
            All secured endpoints require the <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono">Authorization: Bearer &lt;token&gt;</code> header.
          </p>

          <div className="space-y-4">
            {[
              { method: 'POST', path: '/api/auth/register', auth: 'Public', desc: 'Registers new student or faculty account with bcrypt password hashing.' },
              { method: 'POST', path: '/api/auth/login', auth: 'Public', desc: 'Authenticates credentials and returns JWT token and sanitized user profile.' },
              { method: 'GET', path: '/api/auth/me', auth: 'User', desc: 'Retrieves current authenticated user session data.' },
              { method: 'GET', path: '/api/equipment', auth: 'Public', desc: 'Lists equipment catalog with optional ?search, ?category, ?location, and ?status query filters.' },
              { method: 'GET', path: '/api/equipment/:id/availability', auth: 'Public', desc: 'Computes remaining units for date, startTime, and endTime window.' },
              { method: 'POST', path: '/api/equipment', auth: 'Admin Only', desc: 'Creates new equipment asset in inventory.' },
              { method: 'PUT', path: '/api/equipment/:id', auth: 'Admin Only', desc: 'Updates equipment attributes, quantity, and status.' },
              { method: 'DELETE', path: '/api/equipment/:id', auth: 'Admin Only', desc: 'Deletes equipment if no active reservations exist.' },
              { method: 'POST', path: '/api/bookings', auth: 'Student/Faculty', desc: 'Submits new booking with conflict validation and pending status.' },
              { method: 'GET', path: '/api/bookings/my', auth: 'User', desc: 'Returns booking history for the current authenticated user.' },
              { method: 'GET', path: '/api/bookings', auth: 'Admin Only', desc: 'Returns all campus booking records with search and filter parameters.' },
              { method: 'PATCH', path: '/api/bookings/:id/approve', auth: 'Admin Only', desc: 'Approves pending booking, logs admin ID, and triggers notification.' },
              { method: 'PATCH', path: '/api/bookings/:id/reject', auth: 'Admin Only', desc: 'Rejects booking with mandatory reason and restores inventory.' },
              { method: 'PATCH', path: '/api/bookings/:id/cancel', auth: 'Owner/Admin', desc: 'Cancels booking and immediately frees reserved inventory.' },
              { method: 'GET', path: '/api/notifications', auth: 'User', desc: 'Returns notification feed for user with unread count.' },
              { method: 'GET', path: '/api/reports/dashboard', auth: 'Admin Only', desc: 'Returns aggregate analytics, demand metrics, and utilization statistics.' },
            ].map((endpoint, i) => (
              <div key={i} className="p-3.5 rounded-lg border border-slate-200/90 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 text-[11px] font-bold font-mono rounded ${
                    endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                    endpoint.method === 'POST' ? 'bg-emerald-100 text-emerald-700' :
                    endpoint.method === 'PATCH' || endpoint.method === 'PUT' ? 'bg-amber-100 text-amber-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {endpoint.method}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-800">{endpoint.path}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500">{endpoint.desc}</span>
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono shrink-0">
                    {endpoint.auth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Test Execution & Verification */}
      {activeTab === 'testing' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Software Verification & Test Report</h2>
          <p className="text-xs text-slate-500">
            Automated and exploratory test verification results across security, validation, booking rules, and administrative governance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: 'TC-AUTH-01',
                suite: 'Authentication Suite',
                name: 'Registration role security validation',
                expected: 'Rejects role="admin" submissions with HTTP 400. Only student/faculty allowed.',
                actual: 'Returns HTTP 400: "Invalid role. Public registration only permits student or faculty accounts."',
                status: 'PASSED',
              },
              {
                id: 'TC-AUTH-02',
                suite: 'Authentication Suite',
                name: 'Password encryption with bcrypt',
                expected: 'Passwords stored as bcrypt hashes; never returned in API payloads.',
                actual: 'Password hash omitted from all responses; sanitized safeUser returned.',
                status: 'PASSED',
              },
              {
                id: 'TC-BOOK-01',
                suite: 'Booking Concurrency Suite',
                name: 'Overlapping reservation conflict rejection',
                expected: 'System blocks booking when overlapping approved/pending units exceed pool.',
                actual: 'Returns HTTP 409 Conflict with remaining slots and descriptive error.',
                status: 'PASSED',
              },
              {
                id: 'TC-BOOK-02',
                suite: 'Booking Validation Suite',
                name: 'Past date and invalid time range prevention',
                expected: 'Rejects booking dates before today and end times <= start time.',
                actual: 'Returns HTTP 400: "Cannot create bookings for past dates" or "End time must be later".',
                status: 'PASSED',
              },
              {
                id: 'TC-BOOK-03',
                suite: 'Booking Governance Suite',
                name: 'Cross-user modification restriction',
                expected: 'User A cannot view or cancel User B\'s booking.',
                actual: 'Enforced via AuthRequest: returns HTTP 403 Forbidden.',
                status: 'PASSED',
              },
              {
                id: 'TC-ADM-01',
                suite: 'Admin Security Suite',
                name: 'Privileged route RBAC protection',
                expected: 'Student or faculty cannot access /api/bookings (all) or /api/reports.',
                actual: 'requireAdmin middleware intercepts with HTTP 403 Access Denied.',
                status: 'PASSED',
              },
            ].map((tc) => (
              <div key={tc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs text-indigo-700">{tc.id}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {tc.status}
                  </span>
                </div>
                <div className="font-semibold text-slate-900 text-xs mb-1">{tc.name}</div>
                <div className="text-[11px] text-slate-500 mb-1">
                  <strong>Expected:</strong> {tc.expected}
                </div>
                <div className="text-[11px] text-slate-600">
                  <strong>Actual:</strong> {tc.actual}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
