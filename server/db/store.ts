import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'faculty' | 'admin';
  department: string;
  studentIdOrStaffId?: string;
  phone?: string;
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface IEquipment {
  id: string;
  name: string;
  category: 'Projectors' | 'Smart Boards' | 'Laptops' | 'Audio & Microphones' | 'Cables & AV' | 'Laboratory Kits' | 'Presentation Remotes';
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

export interface IBooking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'student' | 'faculty' | 'admin';
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string;   // HH:mm (24h)
  endTime: string;     // HH:mm (24h)
  quantity: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'returned';
  adminRemarks?: string;
  handledByAdminId?: string;
  handledByAdminName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface INotification {
  id: string;
  userId: string;
  message: string;
  title: string;
  type: 'booking_created' | 'booking_approved' | 'booking_rejected' | 'booking_cancelled' | 'system_alert';
  relatedBookingId?: string;
  read: boolean;
  createdAt: string;
}

interface DatabaseSchema {
  users: IUser[];
  equipment: IEquipment[];
  bookings: IBooking[];
  notifications: INotification[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Error reading DB file, reseeding initial data:', err);
      }
    }
    const initial = this.getSeedData();
    this.persist(initial);
    return initial;
  }

  private persist(dataToSave?: DatabaseSchema) {
    try {
      const payload = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  private getSeedData(): DatabaseSchema {
    const salt = bcrypt.genSaltSync(10);
    const adminPasswordHash = bcrypt.hashSync('Admin@123', salt);
    const facultyPasswordHash = bcrypt.hashSync('Faculty@123', salt);
    const studentPasswordHash = bcrypt.hashSync('Student@123', salt);

    const now = new Date().toISOString();

    const users: IUser[] = [
      {
        id: 'usr_admin_1',
        name: 'Dr. K. S. Ramanathan',
        email: 'admin@college.edu',
        passwordHash: adminPasswordHash,
        role: 'admin',
        department: 'Smart Campus Infrastructure & IT',
        studentIdOrStaffId: 'ADM-2024-001',
        phone: '+91 98765 43210',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'usr_faculty_1',
        name: 'Prof. P. Guhan',
        email: 'prof.guhan@college.edu',
        passwordHash: facultyPasswordHash,
        role: 'faculty',
        department: 'Computer Science and Engineering',
        studentIdOrStaffId: '24BCS085',
        phone: '+91 98765 43211',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'usr_student_1',
        name: 'B S Akhil Kartthick',
        email: 'akhil.24bcs017@college.edu',
        passwordHash: studentPasswordHash,
        role: 'student',
        department: 'Computer Science and Engineering',
        studentIdOrStaffId: '24BCS017',
        phone: '+91 98765 43212',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'usr_student_2',
        name: 'R Govarthanan',
        email: 'govarthanan.24bcs082@college.edu',
        passwordHash: studentPasswordHash,
        role: 'student',
        department: 'Computer Science and Engineering',
        studentIdOrStaffId: '24BCS082',
        phone: '+91 98765 43213',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
    ];

    const equipment: IEquipment[] = [
      {
        id: 'eq_proj_4k',
        name: 'Optoma 4K UHD Academic Laser Projector',
        category: 'Projectors',
        description: 'High-brightness 5000 Lumens laser classroom projector with dual HDMI 2.1, wireless screen mirroring, and HDR10 support. Optimized for large lecture amphitheaters and smart rooms.',
        image: '/src/assets/images/equipment_laser_projector_1793676017444.jpg',
        totalQuantity: 6,
        availableQuantity: 6,
        location: 'AV Resource Hub - Block A, Room 102',
        condition: 'Excellent',
        status: 'Available',
        modelNumber: 'OPT-ZH406-UHD',
        specifications: ['4K UHD Resolution', '5000 ANSI Lumens', '20,000 hrs laser diode', 'Auto Keystone & Lens Shift'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'eq_smart_board_75',
        name: 'ViewSonic 75" Interactive Digital Touch Board',
        category: 'Smart Boards',
        description: '75-inch 4K UHD interactive digital smart touch screen on heavy-duty mobile rolling stand. Features 20-point multi-touch, wireless casting, and integrated digital whiteboarding software.',
        image: '/src/assets/images/equipment_smartboard_1793676018403.jpg',
        totalQuantity: 4,
        availableQuantity: 4,
        location: 'Innovation Lab - Block B, 2nd Floor',
        condition: 'Excellent',
        status: 'Available',
        modelNumber: 'VS-IFP7550-V3',
        specifications: ['75" 4K UHD Display', '20-point touch with dual pens', 'Integrated Android & PC module', 'Anti-glare 7H tempered glass'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'eq_audio_lapel_kit',
        name: 'Sennheiser Pro Wireless Audio & Lapel Mic Kit',
        category: 'Audio & Microphones',
        description: 'Broadcast-grade wireless UHF lavalier microphone set with digital receiver, lapel transmitter, bodypack, and high-precision presentation slide remote with digital timer.',
        image: '/src/assets/images/equipment_audio_kit_1793676018282.jpg',
        totalQuantity: 10,
        availableQuantity: 10,
        location: 'Media Production Office - Block C, Ground Floor',
        condition: 'Excellent',
        status: 'Available',
        modelNumber: 'SENN-EW112P-G4',
        specifications: ['True Diversity receiver', '1680 tunable UHF frequencies', '100m operating range', 'Rechargeable AA battery packs'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'eq_laptop_dell_workstation',
        name: 'Dell Precision Mobile Engineering Workstation',
        category: 'Laptops',
        description: 'Intel Core i7 13th Gen, 32GB DDR5 RAM, 1TB NVMe SSD, NVIDIA RTX A2000 GPU. Preloaded with CAD, MATLAB, Python Data Suite, and IDEs for lab practicals and hackathons.',
        image: '/src/assets/images/equipment_laser_projector_1793676017444.jpg',
        totalQuantity: 8,
        availableQuantity: 8,
        location: 'CS Department Hardware Depot - Room 304',
        condition: 'Good',
        status: 'Available',
        modelNumber: 'DELL-P3580-WS',
        specifications: ['Core i7-13800H', '32GB RAM / 1TB SSD', 'NVIDIA RTX A2000 6GB', 'Wi-Fi 6E + RJ45 LAN'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'eq_hdmi_av_accessories',
        name: 'Professional AV Adapter & 4K HDMI Extension Kit',
        category: 'Cables & AV',
        description: 'Complete AV connectivity pouch: 15m fiber HDMI 2.1 cable, USB-C to dual HDMI hubs, DisplayPort adapters, audio 3.5mm splitters, and cable management grips.',
        image: '/src/assets/images/equipment_audio_kit_1793676018282.jpg',
        totalQuantity: 15,
        availableQuantity: 15,
        location: 'Central IT Store - Admin Building',
        condition: 'Good',
        status: 'Available',
        modelNumber: 'AV-KIT-PRO-4K',
        specifications: ['48Gbps 4K@120Hz support', 'Gold-plated connectors', 'Type-C Thunderbolt 4 compatibility', 'Protective canvas carry case'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'eq_iot_robotics_kit',
        name: 'Embedded Systems & IoT Laboratory Sensor Kit',
        category: 'Laboratory Kits',
        description: 'Standard academic embedded development kit containing ESP32 Wi-Fi/BLE modules, sensor array (environmental, ultrasonic, IMU), OLED display, breadboards, and logic probes.',
        image: '/src/assets/images/equipment_smartboard_1793676018403.jpg',
        totalQuantity: 12,
        availableQuantity: 12,
        location: 'IoT & Embedded Systems Lab - Block B, Room 208',
        condition: 'Excellent',
        status: 'Available',
        modelNumber: 'IOT-ADV-KIT-V2',
        specifications: ['ESP32-S3 Dual Core MCU', '30+ industrial sensor modules', 'Breadboard and jumpers included', 'USB-C programmable'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'eq_logitech_spotlight',
        name: 'Logitech Spotlight Presentation Remote with Pointer',
        category: 'Presentation Remotes',
        description: 'Advanced presentation clicker with virtual digital laser pointer, magnification mode, haptic countdown timer alerts, and up to 30 meters wireless operating range.',
        image: '/src/assets/images/equipment_audio_kit_1793676018282.jpg',
        totalQuantity: 8,
        availableQuantity: 8,
        location: 'AV Resource Hub - Block A, Room 102',
        condition: 'Good',
        status: 'Available',
        modelNumber: 'LOGI-SPOT-GOLD',
        specifications: ['30m wireless range', 'Haptic vibration alerts', 'Rechargeable via USB-C', 'Compatible with PowerPoint, Keynote, Google Slides'],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const todayDate = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const bookings: IBooking[] = [
      {
        id: 'bk_demo_101',
        userId: 'usr_student_1',
        userName: 'B S Akhil Kartthick',
        userEmail: 'akhil.24bcs017@college.edu',
        userRole: 'student',
        equipmentId: 'eq_proj_4k',
        equipmentName: 'Optoma 4K UHD Academic Laser Projector',
        equipmentCategory: 'Projectors',
        bookingDate: tomorrow,
        startTime: '10:00',
        endTime: '12:00',
        quantity: 1,
        purpose: 'Software Agile and Practices Sprint Review Presentation in Seminar Hall 2',
        status: 'approved',
        adminRemarks: 'Approved for Sprint review. Please collect from Block A Room 102 15 minutes before the session.',
        handledByAdminId: 'usr_admin_1',
        handledByAdminName: 'Dr. K. S. Ramanathan',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'bk_demo_102',
        userId: 'usr_faculty_1',
        userName: 'Prof. P. Guhan',
        userEmail: 'prof.guhan@college.edu',
        userRole: 'faculty',
        equipmentId: 'eq_smart_board_75',
        equipmentName: 'ViewSonic 75" Interactive Digital Touch Board',
        equipmentCategory: 'Smart Boards',
        bookingDate: tomorrow,
        startTime: '14:00',
        endTime: '16:00',
        quantity: 1,
        purpose: 'Interactive lecture on System Architecture and Design Patterns for 3rd Year CSE',
        status: 'approved',
        adminRemarks: 'Equipment checked and allocated to Block B Room 204.',
        handledByAdminId: 'usr_admin_1',
        handledByAdminName: 'Dr. K. S. Ramanathan',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'bk_demo_103',
        userId: 'usr_student_2',
        userName: 'R Govarthanan',
        userEmail: 'govarthanan.24bcs082@college.edu',
        userRole: 'student',
        equipmentId: 'eq_audio_lapel_kit',
        equipmentName: 'Sennheiser Pro Wireless Audio & Lapel Mic Kit',
        equipmentCategory: 'Audio & Microphones',
        bookingDate: tomorrow,
        startTime: '09:00',
        endTime: '11:00',
        quantity: 2,
        purpose: 'College Technical Symposium - Keynote Session Audio Setup',
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      },
    ];

    const notifications: INotification[] = [
      {
        id: 'notif_1',
        userId: 'usr_student_1',
        title: 'Booking Approved',
        message: 'Your booking for Optoma 4K Laser Projector on ' + tomorrow + ' (10:00 - 12:00) has been approved by administrator Dr. K. S. Ramanathan.',
        type: 'booking_approved',
        relatedBookingId: 'bk_demo_101',
        read: false,
        createdAt: now,
      },
      {
        id: 'notif_2',
        userId: 'usr_faculty_1',
        title: 'Booking Approved',
        message: 'Your booking for ViewSonic 75" Interactive Digital Touch Board on ' + tomorrow + ' (14:00 - 16:00) has been confirmed.',
        type: 'booking_approved',
        relatedBookingId: 'bk_demo_102',
        read: true,
        createdAt: now,
      },
      {
        id: 'notif_3',
        userId: 'usr_student_2',
        title: 'Booking Request Submitted',
        message: 'Your booking request for 2 Sennheiser Wireless Audio Kits is pending administrator approval.',
        type: 'booking_created',
        relatedBookingId: 'bk_demo_103',
        read: false,
        createdAt: now,
      },
    ];

    return { users, equipment, bookings, notifications };
  }

  // User operations
  findUserByEmail(email: string): IUser | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): IUser | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getAllUsers(): IUser[] {
    return this.data.users;
  }

  createUser(user: IUser): IUser {
    this.data.users.push(user);
    this.persist();
    return user;
  }

  updateUser(id: string, updates: Partial<IUser>): IUser | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.data.users[idx];
  }

  // Equipment operations
  getAllEquipment(): IEquipment[] {
    return this.data.equipment;
  }

  findEquipmentById(id: string): IEquipment | undefined {
    return this.data.equipment.find(e => e.id === id);
  }

  createEquipment(item: IEquipment): IEquipment {
    this.data.equipment.push(item);
    this.persist();
    return item;
  }

  updateEquipment(id: string, updates: Partial<IEquipment>): IEquipment | null {
    const idx = this.data.equipment.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.data.equipment[idx] = {
      ...this.data.equipment[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.data.equipment[idx];
  }

  deleteEquipment(id: string): boolean {
    const initialLen = this.data.equipment.length;
    this.data.equipment = this.data.equipment.filter(e => e.id !== id);
    if (this.data.equipment.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // Availability calculation
  // Determines reserved quantity during requested date + time window
  getEquipmentAvailability(equipmentId: string, date: string, startTime: string, endTime: string): {
    totalQuantity: number;
    reservedQuantity: number;
    availableQuantity: number;
    isAvailable: boolean;
  } {
    const eq = this.findEquipmentById(equipmentId);
    if (!eq || eq.status !== 'Available') {
      return { totalQuantity: eq ? eq.totalQuantity : 0, reservedQuantity: 0, availableQuantity: 0, isAvailable: false };
    }

    // Find active overlapping bookings: status 'approved' or 'pending' for the same date and overlapping hours
    const overlappingBookings = this.data.bookings.filter(b => {
      if (b.equipmentId !== equipmentId) return false;
      if (b.bookingDate !== date) return false;
      if (b.status !== 'approved' && b.status !== 'pending') return false;

      // Overlap condition: startA < endB and endA > startB
      return startTime < b.endTime && endTime > b.startTime;
    });

    const reservedQuantity = overlappingBookings.reduce((sum, b) => sum + b.quantity, 0);
    const availableQuantity = Math.max(0, eq.totalQuantity - reservedQuantity);

    return {
      totalQuantity: eq.totalQuantity,
      reservedQuantity,
      availableQuantity,
      isAvailable: availableQuantity > 0,
    };
  }

  // Bookings operations
  getAllBookings(): IBooking[] {
    return this.data.bookings;
  }

  getBookingsByUserId(userId: string): IBooking[] {
    return this.data.bookings.filter(b => b.userId === userId);
  }

  findBookingById(id: string): IBooking | undefined {
    return this.data.bookings.find(b => b.id === id);
  }

  createBooking(booking: IBooking): IBooking {
    this.data.bookings.push(booking);
    this.persist();
    return booking;
  }

  updateBooking(id: string, updates: Partial<IBooking>): IBooking | null {
    const idx = this.data.bookings.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.bookings[idx] = {
      ...this.data.bookings[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.data.bookings[idx];
  }

  // Notifications
  getNotificationsByUserId(userId: string): INotification[] {
    return this.data.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createNotification(notif: INotification): INotification {
    this.data.notifications.push(notif);
    this.persist();
    return notif;
  }

  markNotificationAsRead(id: string, userId: string): boolean {
    const notif = this.data.notifications.find(n => n.id === id && n.userId === userId);
    if (notif) {
      notif.read = true;
      this.persist();
      return true;
    }
    return false;
  }

  markAllNotificationsAsRead(userId: string): number {
    let count = 0;
    this.data.notifications.forEach(n => {
      if (n.userId === userId && !n.read) {
        n.read = true;
        count++;
      }
    });
    if (count > 0) this.persist();
    return count;
  }

  getDatabaseStatus() {
    return {
      connected: true,
      engine: 'Express Native Persistent Data Engine',
      storage: 'Local Express Server Storage (/data/db.json)',
      mode: 'Self-Contained Express Backend (No External MongoDB Required)',
      syncMode: 'active',
      collections: ['users', 'equipment', 'bookings', 'notifications'],
      stats: {
        totalEquipment: this.data.equipment.length,
        totalUsers: this.data.users.length,
        totalBookings: this.data.bookings.length,
        totalNotifications: this.data.notifications.length,
      },
      lastSyncedAt: new Date().toISOString(),
    };
  }
}

export const dbStore = new DatabaseStore();
