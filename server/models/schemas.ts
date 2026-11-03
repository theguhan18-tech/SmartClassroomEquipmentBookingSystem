/**
 * Mongoose Models Reference for Standalone MongoDB Atlas Deployment
 * These schemas provide exact Mongoose ODM validation for production clusters.
 */

export const UserModelSchemaDefinition = {
  name: { type: 'String', required: true, trim: true },
  email: { type: 'String', required: true, unique: true, lowercase: true, index: true },
  password: { type: 'String', required: true },
  role: { type: 'String', enum: ['student', 'faculty', 'admin'], default: 'student', index: true },
  department: { type: 'String', default: 'General Academics' },
  studentIdOrStaffId: { type: 'String' },
  phone: { type: 'String' },
  status: { type: 'String', enum: ['active', 'suspended'], default: 'active' },
  timestamps: true,
};

export const EquipmentModelSchemaDefinition = {
  name: { type: 'String', required: true, trim: true, index: true },
  category: { 
    type: 'String', 
    required: true, 
    enum: ['Projectors', 'Smart Boards', 'Laptops', 'Audio & Microphones', 'Cables & AV', 'Laboratory Kits', 'Presentation Remotes'],
    index: true 
  },
  description: { type: 'String', default: '' },
  image: { type: 'String', default: '' },
  totalQuantity: { type: 'Number', required: true, min: 1 },
  availableQuantity: { type: 'Number', default: 0 },
  location: { type: 'String', required: true, index: true },
  condition: { type: 'String', enum: ['Excellent', 'Good', 'Needs Maintenance'], default: 'Good' },
  status: { type: 'String', enum: ['Available', 'Under Maintenance', 'Decommissioned'], default: 'Available', index: true },
  modelNumber: { type: 'String' },
  specifications: [{ type: 'String' }],
  timestamps: true,
};

export const BookingModelSchemaDefinition = {
  user: { type: 'ObjectId', ref: 'User', required: true, index: true },
  equipment: { type: 'ObjectId', ref: 'Equipment', required: true, index: true },
  bookingDate: { type: 'String', required: true, index: true },
  startTime: { type: 'String', required: true },
  endTime: { type: 'String', required: true },
  quantity: { type: 'Number', required: true, min: 1 },
  purpose: { type: 'String', required: true },
  status: { type: 'String', enum: ['pending', 'approved', 'rejected', 'cancelled', 'returned'], default: 'pending', index: true },
  adminRemarks: { type: 'String' },
  approvedOrRejectedBy: { type: 'ObjectId', ref: 'User' },
  timestamps: true,
};

export const NotificationModelSchemaDefinition = {
  recipientUser: { type: 'ObjectId', ref: 'User', required: true, index: true },
  title: { type: 'String', required: true },
  message: { type: 'String', required: true },
  type: { 
    type: 'String', 
    enum: ['booking_created', 'booking_approved', 'booking_rejected', 'booking_cancelled', 'system_alert'],
    default: 'booking_created'
  },
  relatedBooking: { type: 'ObjectId', ref: 'Booking' },
  read: { type: 'Boolean', default: false, index: true },
  timestamps: true,
};
