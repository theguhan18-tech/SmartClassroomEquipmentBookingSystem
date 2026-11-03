import {
  User,
  Equipment,
  Booking,
  NotificationItem,
  AvailabilityResult,
  DashboardReportData,
} from '../types';

const TOKEN_KEY = 'smart_classroom_jwt_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  register: (payload: any) => apiRequest<{ success: boolean; token: string; user: User; message?: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  login: (payload: { email: string; password: string }) => apiRequest<{ success: boolean; token: string; user: User; message?: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getCurrentUser: () => apiRequest<{ success: boolean; user: User }>('/api/auth/me'),

  // Equipment
  getEquipment: (params?: { search?: string; category?: string; location?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.location) query.append('location', params.location);
    if (params?.status) query.append('status', params.status);
    return apiRequest<{ success: boolean; count: number; data: Equipment[] }>(`/api/equipment?${query.toString()}`);
  },
  getEquipmentById: (id: string) => apiRequest<{ success: boolean; data: Equipment }>(`/api/equipment/${id}`),
  checkAvailability: (id: string, date: string, startTime: string, endTime: string, quantity: number) => {
    const query = new URLSearchParams({
      date,
      startTime,
      endTime,
      quantity: quantity.toString(),
    });
    return apiRequest<{ success: boolean; data: AvailabilityResult }>(`/api/equipment/${id}/availability?${query.toString()}`);
  },
  createEquipment: (payload: Partial<Equipment>) => apiRequest<{ success: boolean; data: Equipment; message: string }>('/api/equipment', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateEquipment: (id: string, payload: Partial<Equipment>) => apiRequest<{ success: boolean; data: Equipment; message: string }>(`/api/equipment/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  deleteEquipment: (id: string) => apiRequest<{ success: boolean; message: string }>(`/api/equipment/${id}`, {
    method: 'DELETE',
  }),

  // Bookings
  createBooking: (payload: {
    equipmentId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    quantity: number;
    purpose: string;
  }) => apiRequest<{ success: boolean; data: Booking; message: string }>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getMyBookings: () => apiRequest<{ success: boolean; count: number; data: Booking[] }>('/api/bookings/my'),
  getAllBookings: (params?: { status?: string; date?: string; equipmentId?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.date) query.append('date', params.date);
    if (params?.equipmentId) query.append('equipmentId', params.equipmentId);
    if (params?.search) query.append('search', params.search);
    return apiRequest<{ success: boolean; count: number; data: Booking[] }>(`/api/bookings?${query.toString()}`);
  },
  getBookingById: (id: string) => apiRequest<{ success: boolean; data: Booking }>(`/api/bookings/${id}`),
  cancelBooking: (id: string, reason?: string) => apiRequest<{ success: boolean; data: Booking; message: string }>(`/api/bookings/${id}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  }),
  approveBooking: (id: string, adminRemarks?: string) => apiRequest<{ success: boolean; data: Booking; message: string }>(`/api/bookings/${id}/approve`, {
    method: 'PATCH',
    body: JSON.stringify({ adminRemarks }),
  }),
  rejectBooking: (id: string, reason?: string) => apiRequest<{ success: boolean; data: Booking; message: string }>(`/api/bookings/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  }),

  // Users (Admin)
  getUsers: (params?: { role?: string; status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.role) query.append('role', params.role);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    return apiRequest<{ success: boolean; count: number; data: User[] }>(`/api/users?${query.toString()}`);
  },
  updateUserProfile: (id: string, payload: Partial<User>) => apiRequest<{ success: boolean; data: User; message: string }>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  updateUserRoleOrStatus: (id: string, payload: { role?: string; status?: string }) => apiRequest<{ success: boolean; data: User; message: string }>(`/api/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }),

  // Notifications
  getNotifications: () => apiRequest<{ success: boolean; unreadCount: number; data: NotificationItem[] }>('/api/notifications'),
  markNotificationRead: (id: string) => apiRequest<{ success: boolean; message: string }>(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  }),
  markAllNotificationsRead: () => apiRequest<{ success: boolean; message: string; count: number }>('/api/notifications/read-all', {
    method: 'PATCH',
  }),

  // Reports
  getDashboardSummary: () => apiRequest<{ success: boolean; data: DashboardReportData }>('/api/reports/dashboard'),
  getEquipmentUsageReport: () => apiRequest<{ success: boolean; count: number; data: any[] }>('/api/reports/equipment-usage'),
};
