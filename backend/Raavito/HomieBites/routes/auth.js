import crypto from 'crypto';
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// In-memory OTP storage (in production, use Redis or database)
const otpStore = new Map(); // { email: { otp, expires, attempts } }

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const user = await User.create({ name, email, phone, password });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Step 1: Request password reset - Verify email and send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (!user) {
      // Don't reveal if admin exists or not for security
      return res.json({
        success: true,
        message: 'If an admin account exists with this email, verification steps will be sent.',
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore.set(email.toLowerCase(), {
      otp,
      expires,
      attempts: 0,
      userId: user._id.toString(),
    });

    // In production, send OTP via SMS/Email service
    // For now, we'll return it in development mode only
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 OTP for ${email}: ${otp} (expires in 10 minutes)`);
    }

    res.json({
      success: true,
      message: 'Verification OTP sent to registered mobile number',
      // Only include OTP in development
      ...(process.env.NODE_ENV === 'development' && { otp }),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Step 2: Verify OTP and return verification token
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and OTP are required' });
    }

    const stored = otpStore.get(email.toLowerCase());
    if (!stored) {
      return res.status(400).json({ success: false, error: 'OTP not found or expired' });
    }

    if (Date.now() > stored.expires) {
      otpStore.delete(email.toLowerCase());
      return res.status(400).json({ success: false, error: 'OTP expired' });
    }

    if (stored.attempts >= 3) {
      otpStore.delete(email.toLowerCase());
      return res
        .status(400)
        .json({ success: false, error: 'Too many attempts. Please request a new OTP.' });
    }

    if (stored.otp !== otp) {
      stored.attempts += 1;
      return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }

    // OTP verified - generate verification token for next step
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 30 * 60 * 1000; // 30 minutes

    // Store verification token
    otpStore.set(`verify_${email.toLowerCase()}`, {
      token: verificationToken,
      expires,
      userId: stored.userId,
    });

    // Clear OTP
    otpStore.delete(email.toLowerCase());

    res.json({
      success: true,
      message: 'OTP verified successfully',
      verificationToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Step 3: Verify PAN card and admin ID
router.post('/verify-identity', async (req, res) => {
  try {
    const { email, verificationToken, panCard, adminId } = req.body;

    if (!email || !verificationToken || !panCard || !adminId) {
      return res
        .status(400)
        .json({ success: false, error: 'All verification fields are required' });
    }

    const stored = otpStore.get(`verify_${email.toLowerCase()}`);
    if (!stored || stored.token !== verificationToken) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid or expired verification token' });
    }

    if (Date.now() > stored.expires) {
      otpStore.delete(`verify_${email.toLowerCase()}`);
      return res.status(400).json({ success: false, error: 'Verification token expired' });
    }

    const user = await User.findById(stored.userId);
    if (!user || user.role !== 'admin') {
      return res.status(404).json({ success: false, error: 'Admin account not found' });
    }

    // Verify admin ID
    if (user.adminId !== adminId.trim()) {
      return res.status(400).json({ success: false, error: 'Invalid Admin ID' });
    }

    // Verify PAN card
    const panMatch = await user.comparePanCard(panCard);
    if (!panMatch) {
      return res.status(400).json({ success: false, error: 'Invalid PAN card' });
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(resetExpires);
    await user.save();

    // Clear verification token
    otpStore.delete(`verify_${email.toLowerCase()}`);

    res.json({
      success: true,
      message: 'Identity verified successfully',
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Step 4: Reset password with reset token
router.post('/reset-password', async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: Date.now() },
      role: 'admin',
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all users (admin only)
router.get('/users', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password -panCardHash -passwordResetToken -passwordResetExpires')
      .sort({ createdAt: -1 });

    // Format users to match frontend expectations
    const formattedUsers = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses || [],
      createdAt: user.createdAt,
      profilePicture: user.profilePicture || null,
    }));

    res.json({
      success: true,
      data: formattedUsers,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
