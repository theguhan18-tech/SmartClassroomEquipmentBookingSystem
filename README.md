# Smart Classroom Equipment Booking System

**Course:** Software Agile and Practices  
**Academic Submission:** College Mini-Project  

### Project Team Members
1. **B S Akhil Kartthick** — Roll No: `24BCS017`
2. **R Govarthanan** — Roll No: `24BCS082`
3. **P Guhan** — Roll No: `24BCS085`

---

## 1. Project Overview & Problem Statement

Academic smart classrooms, seminar halls, and computing laboratories suffer from paper registers and decentralized coordination. This leads to double-booking during guest lectures, conflicting reservations, unaccounted hardware damage, and total lack of real-time inventory visibility.

The **Smart Classroom Equipment Booking System** is a centralized web-based MERN application providing real-time availability checking, automated conflict prevention, student/faculty self-service booking, and administrator governance.

---

## 2. Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React icons, Plus Jakarta Sans & JetBrains Mono typography.
- **Backend:** Node.js, Express.js REST API architecture, JWT authentication (`jsonwebtoken`), password hashing (`bcryptjs`), input sanitization.
- **Server Data Engine:** Integrated native persistent document store in `server/db/store.ts` (`data/db.json`). Runs completely self-contained on the Express server with zero external database configuration or cloud dependencies required.
- **Tools:** Visual Studio Code, Postman, Git.

---

## 3. Pre-Configured Demo Accounts

For immediate evaluation, the following pre-seeded accounts are active:

| Role | Name | Email | Password |
|---|---|---|---|
| **Administrator** | Dr. K. S. Ramanathan | `admin@college.edu` | `Admin@123` |
| **Faculty** | Prof. P. Guhan | `prof.guhan@college.edu` | `Faculty@123` |
| **Student** | B S Akhil Kartthick | `akhil.24bcs017@college.edu` | `Student@123` |
| **Student** | R Govarthanan | `govarthanan.24bcs082@college.edu` | `Student@123` |

*Note: You can also use the **"Demo Role" switcher** in the top navigation bar to test each role instantly with one click!*

---

## 4. Key Modules & Functional Workflows

1. **Authentication & RBAC:**
   - Public registration strictly permits `student` or `faculty` accounts.
   - Administrator accounts cannot be created publicly and are protected by backend guards (`requireAdmin`).
   - Passwords salted and hashed with `bcryptjs`.
2. **Equipment Management:**
   - Full CRUD: Add, update, delete assets, update quantity, mark condition and status (`Available`, `Under Maintenance`, `Decommissioned`).
   - Deletion safety: Blocks deletion if active reservations exist.
3. **Real-Time Availability & Concurrency:**
   - Availability calculated on backend by cross-referencing total quantity against overlapping `pending` and `approved` reservations for the requested time window ($T_{start} < B_{end} \land T_{end} > B_{start}$).
   - Prevents past date bookings and ensures $T_{end} > T_{start}$.
4. **Booking Lifecycle & Approvals:**
   - Submission: User submits request $\rightarrow$ status `pending`.
   - Admin Review: Administrator reviews purpose, approves with remarks or rejects with mandatory reason.
   - User Cancellation: Requester can cancel active reservations, which atomically frees units.
5. **In-App Notification Dispatcher:**
   - Real-time alerts when bookings are created, approved, rejected, or cancelled.
6. **Analytics & Auditing:**
   - Equipment demand statistics, category distributions, utilization scores, and one-click **CSV export**.

---

## 5. Local Installation & Startup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps to Run
```bash
# 1. Clone repository
git clone https://github.com/your-org/smart-classroom-booking.git
cd smart-classroom-booking

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start Full-Stack Development Server (Express API + Vite Frontend on port 3000)
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 6. REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register student/faculty |
| `POST` | `/api/auth/login` | Public | Login & receive JWT |
| `GET` | `/api/auth/me` | User | Get current profile |
| `GET` | `/api/equipment` | Public | List equipment with search & filters |
| `GET` | `/api/equipment/:id/availability` | Public | Check remaining units for slot |
| `POST` | `/api/equipment` | Admin | Create new equipment asset |
| `PUT` | `/api/equipment/:id` | Admin | Update equipment parameters |
| `DELETE` | `/api/equipment/:id` | Admin | Delete asset |
| `POST` | `/api/bookings` | Student/Faculty | Submit booking request |
| `GET` | `/api/bookings/my` | User | User's personal bookings |
| `GET` | `/api/bookings` | Admin | Master booking registry |
| `PATCH` | `/api/bookings/:id/approve` | Admin | Approve pending booking |
| `PATCH` | `/api/bookings/:id/reject` | Admin | Decline request with reason |
| `PATCH` | `/api/bookings/:id/cancel` | User/Admin | Cancel booking & release stock |
| `GET` | `/api/notifications` | User | In-app notification feed |
| `GET` | `/api/reports/dashboard` | Admin | Executive summary & utilization |

---

## 7. Requirements Traceability Checklist

- [x] **FR-01: Public Student & Faculty Registration** (Admin restricted)
- [x] **FR-02: Secure JWT Authentication & bcrypt Hashing**
- [x] **FR-03: Equipment Catalog with Search & Category Filters**
- [x] **FR-04: Real-Time Availability Engine & Overlap Prevention**
- [x] **FR-05: Booking Request Submission & Validation**
- [x] **FR-06: Self-Service Booking History & Cancellation**
- [x] **FR-07: In-App Notification System with Unread Badges**
- [x] **FR-08: Admin Equipment CRUD & Maintenance State**
- [x] **FR-09: Admin Booking Approval/Rejection with Remarks**
- [x] **FR-10: Admin User Management & Role Configuration**
- [x] **FR-11: Utilization Analytics & CSV Report Export**
- [x] **FR-12: Full Academic Team Documentation & RTM Tab**
