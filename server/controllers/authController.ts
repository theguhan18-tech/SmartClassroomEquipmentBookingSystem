import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { dbStore, IUser } from '../db/store.js';
import { generateToken, AuthRequest } from '../middleware/auth.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword, role, department, studentIdOrStaffId, phone } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Password and confirm password do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Role security rule: Public registration only allows student or faculty
    if (role !== 'student' && role !== 'faculty') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Public registration only permits student or faculty accounts.',
      });
    }

    // Check duplicate email
    const existing = dbStore.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const now = new Date().toISOString();
    const newUser: IUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role,
      department: department?.trim() || 'General Academics',
      studentIdOrStaffId: studentIdOrStaffId?.trim(),
      phone: phone?.trim(),
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    dbStore.createUser(newUser);

    const token = generateToken(newUser);

    // Create a welcome notification
    dbStore.createNotification({
      id: 'notif_' + Date.now(),
      userId: newUser.id,
      title: 'Welcome to Smart Classroom Booking',
      message: `Welcome ${newUser.name}! Your ${newUser.role} account has been created. You can now browse equipment and submit booking requests.`,
      type: 'system_alert',
      read: false,
      createdAt: now,
    });

    const { passwordHash: _, ...safeUser } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = dbStore.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Contact campus admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const { passwordHash: _, ...safeUser } = req.user;
    return res.status(200).json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
