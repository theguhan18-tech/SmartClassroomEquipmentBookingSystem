export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  studentIdOrStaffId?: string;
  phone?: string;
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export type EquipmentCategory =
  | 'Projectors'
  | 'Smart Boards'
  | 'Laptops'
  | 'Audio & Microphones'
  | 'Cables & AV'
  | 'Laboratory Kits'
  | 'Presentation Remotes';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  description: string;
  image: string;
  totalQuantity: number;
  availableQuantity: number;
  location: string;
  condition: 'Excellent' | 'Good' | 'Needs Maintenance';
  status: 'Available' | 'Under Maintenance' | 'Decommissioned';
  modelNumber?: string;
  specifications?: string[];
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'returned';

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  quantity: number;
  purpose: string;
  status: BookingStatus;
  adminRemarks?: string;
  handledByAdminId?: string;
  handledByAdminName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking_created' | 'booking_approved' | 'booking_rejected' | 'booking_cancelled' | 'system_alert';
  relatedBookingId?: string;
  read: boolean;
  createdAt: string;
}

export interface AvailabilityResult {
  totalQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  isAvailable: boolean;
  requestedQuantity: number;
  canFulfillRequest: boolean;
}

export interface DashboardReportData {
  equipment: {
    total: number;
    totalInventoryUnits: number;
    underMaintenance: number;
    availableTypes: number;
  };
  users: {
    total: number;
    students: number;
    faculty: number;
    admins: number;
  };
  bookings: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
  };
  mostBooked: Array<{
    name: string;
    count: number;
    category: string;
    unitsRequested: number;
  }>;
  bookingsByCategory: Record<string, number>;
  recentBookings: Booking[];
}
