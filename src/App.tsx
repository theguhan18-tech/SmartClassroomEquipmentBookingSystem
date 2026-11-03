import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NotificationDrawer } from './components/NotificationDrawer';
import { EquipmentDetailsModal } from './pages/EquipmentDetailsModal';
import { BookingDetailsModal } from './pages/BookingDetailsModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutProjectPage } from './pages/AboutProjectPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { EquipmentCatalogPage } from './pages/EquipmentCatalogPage';
import { CreateBookingPage } from './pages/CreateBookingPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminEquipmentPage } from './pages/AdminEquipmentPage';
import { AdminBookingsPage } from './pages/AdminBookingsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminReportsPage } from './pages/AdminReportsPage';

// Types & Services
import { Equipment, Booking, NotificationItem } from './types';
import { api } from './services/api';

function MainApp() {
  const { user, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  
  // Data states
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);

  // Modal inspection states
  const [selectedEquipmentForDetails, setSelectedEquipmentForDetails] = useState<Equipment | null>(null);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);
  const [bookingPrefill, setBookingPrefill] = useState<{
    equipment: Equipment | null;
    date: string;
    startTime: string;
    endTime: string;
    quantity: number;
  } | null>(null);

  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // Load equipment catalog
  const loadEquipment = async () => {
    try {
      const res = await api.getEquipment();
      if (res.success) {
        setEquipmentList(res.data);
      }
    } catch (err) {
      console.error('Failed to load equipment catalog:', err);
    }
  };

  // Load user bookings
  const loadUserBookings = async () => {
    if (!user) {
      setUserBookings([]);
      return;
    }
    try {
      const res = await api.getMyBookings();
      if (res.success) {
        setUserBookings(res.data);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    }
  };

  // Load notifications
  const loadNotifications = async () => {
    if (!user) {
      setNotifications([]);
      setUnreadNotifCount(0);
      return;
    }
    try {
      const res = await api.getNotifications();
      if (res.success) {
        setNotifications(res.data);
        setUnreadNotifCount(res.unreadCount);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserBookings();
      loadNotifications();
    }
  }, [user]);

  // Notification actions
  const handleMarkNotifRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      loadNotifications();
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const handleMarkAllNotifsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      loadNotifications();
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    }
  };

  // Booking handlers
  const handleStartBooking = (
    equipment: Equipment,
    prefill?: { date: string; startTime: string; endTime: string; quantity: number }
  ) => {
    if (!user) {
      setCurrentView('login');
      return;
    }

    setBookingPrefill({
      equipment,
      date: prefill?.date || '',
      startTime: prefill?.startTime || '',
      endTime: prefill?.endTime || '',
      quantity: prefill?.quantity || 1,
    });
    setCurrentView('create-booking');
  };

  const handleBookingCreatedSuccess = (bookingId: string) => {
    loadUserBookings();
    loadNotifications();
    setCurrentView('my-bookings');
  };

  const handleViewBookingById = async (bookingId: string) => {
    try {
      const res = await api.getBookingById(bookingId);
      if (res.success) {
        setSelectedBookingForDetails(res.data);
        setNotificationDrawerOpen(false);
      }
    } catch (err) {
      console.error('Failed to retrieve booking:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Connecting to Campus Infrastructure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          // Guard admin views
          if (view.startsWith('admin-') && user?.role !== 'admin') {
            setCurrentView('login');
            return;
          }
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unreadCount={unreadNotifCount}
        onOpenNotifications={() => setNotificationDrawerOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={setCurrentView}
            featuredEquipment={equipmentList}
            onViewEquipment={(eq) => setSelectedEquipmentForDetails(eq)}
          />
        )}

        {currentView === 'about' && (
          <AboutProjectPage />
        )}

        {currentView === 'login' && (
          <LoginPage
            onNavigate={setCurrentView}
            onSuccessNavigate={(view) => {
              if (user?.role === 'admin') {
                setCurrentView('admin-dashboard');
              } else {
                setCurrentView(view);
              }
            }}
          />
        )}

        {currentView === 'register' && (
          <RegisterPage onNavigate={setCurrentView} />
        )}

        {currentView === 'catalog' && (
          <EquipmentCatalogPage
            equipmentList={equipmentList}
            onViewDetails={(item) => setSelectedEquipmentForDetails(item)}
            onBookNow={(item) => handleStartBooking(item)}
            onAddEquipment={() => setCurrentView('admin-equipment')}
            onEditEquipment={() => setCurrentView('admin-equipment')}
          />
        )}

        {currentView === 'create-booking' && (
          <CreateBookingPage
            equipment={bookingPrefill?.equipment || null}
            equipmentList={equipmentList}
            onBack={() => setCurrentView('catalog')}
            onSuccess={handleBookingCreatedSuccess}
            prefill={bookingPrefill ? {
              date: bookingPrefill.date,
              startTime: bookingPrefill.startTime,
              endTime: bookingPrefill.endTime,
              quantity: bookingPrefill.quantity,
            } : undefined}
          />
        )}

        {currentView === 'dashboard' && (
          <UserDashboardPage
            bookings={userBookings}
            equipmentList={equipmentList}
            onNavigate={setCurrentView}
            onViewBooking={(b) => setSelectedBookingForDetails(b)}
            onViewEquipment={(eq) => handleStartBooking(eq)}
          />
        )}

        {currentView === 'my-bookings' && (
          <MyBookingsPage
            bookings={userBookings}
            onRefresh={loadUserBookings}
            onNavigateToCatalog={() => setCurrentView('catalog')}
            onViewBookingDetails={(b) => setSelectedBookingForDetails(b)}
          />
        )}

        {currentView === 'profile' && (
          <UserProfilePage />
        )}

        {/* Administrator Suite */}
        {currentView === 'admin-dashboard' && (
          <AdminDashboardPage
            onNavigate={setCurrentView}
            onViewBooking={(b) => setSelectedBookingForDetails(b)}
          />
        )}

        {currentView === 'admin-equipment' && (
          <AdminEquipmentPage
            equipmentList={equipmentList}
            onRefresh={loadEquipment}
            onViewDetails={(item) => setSelectedEquipmentForDetails(item)}
          />
        )}

        {currentView === 'admin-bookings' && (
          <AdminBookingsPage
            onViewBookingDetails={(b) => setSelectedBookingForDetails(b)}
          />
        )}

        {currentView === 'admin-users' && (
          <AdminUsersPage />
        )}

        {currentView === 'admin-reports' && (
          <AdminReportsPage />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentView} />

      {/* Equipment Details & Live Availability Modal */}
      <EquipmentDetailsModal
        equipment={selectedEquipmentForDetails}
        isOpen={selectedEquipmentForDetails !== null}
        onClose={() => setSelectedEquipmentForDetails(null)}
        onProceedToBook={(equipment, prefill) => {
          setSelectedEquipmentForDetails(null);
          handleStartBooking(equipment, prefill);
        }}
      />

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBookingForDetails}
        isOpen={selectedBookingForDetails !== null}
        onClose={() => setSelectedBookingForDetails(null)}
      />

      {/* In-App Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        notifications={notifications}
        unreadCount={unreadNotifCount}
        onMarkRead={handleMarkNotifRead}
        onMarkAllRead={handleMarkAllNotifsRead}
        onSelectBooking={handleViewBookingById}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
