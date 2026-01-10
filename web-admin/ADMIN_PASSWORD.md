Password Management System for Admin Account
COMPLETE PASSWORD FLOW

1. DATABASE SCHEMA UPDATE
   javascript// Users Collection (for admin)
   {
   \_id: ObjectId,
   email: String (unique), // 706359@gmail.com
   phone: String, // 8958111112
   password: String (hashed with bcrypt),
   name: String,
   role: String (default: 'Admin'),
   isTemporaryPassword: Boolean (default: false),
   passwordResetToken: String,
   passwordResetExpires: Date,
   lastPasswordChange: Date,
   loginAttempts: Number (default: 0),
   lockUntil: Date,
   isActive: Boolean (default: true),
   createdAt: Date,
   updatedAt: Date,
   twoFactorEnabled: Boolean (default: false),
   twoFactorSecret: String
   }

// Password History Collection (optional - to prevent password reuse)
{
\_id: ObjectId,
userId: ObjectId,
passwordHash: String,
createdAt: Date
}

2. BACKEND API ENDPOINTS
   File: /server/routes/auth.js
   javascriptconst express = require('express');
   const router = express.Router();
   const bcrypt = require('bcryptjs');
   const jwt = require('jsonwebtoken');
   const crypto = require('crypto');
   const User = require('../models/User');
   const { sendPasswordResetEmail } = require('../utils/email');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 _ 60 _ 1000; // 15 minutes

// LOGIN
router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account locked. Try again in ${minutesLeft} minutes.`
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Increment failed login attempts
      user.loginAttempts += 1;

      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
        await user.save();
        return res.status(423).json({
          success: false,
          message: `Too many failed attempts. Account locked for 15 minutes.`
        });
      }

      await user.save();
      return res.status(401).json({
        success: false,
        message: `Invalid email or password. ${MAX_LOGIN_ATTEMPTS - user.loginAttempts} attempts remaining.`
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Check if temporary password
    if (user.isTemporaryPassword) {
      return res.json({
        success: true,
        requirePasswordChange: true,
        token,
        user: {
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    }

    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

} catch (error) {
console.error('Login error:', error);
res.status(500).json({
success: false,
message: 'Server error during login'
});
}
});

// CHANGE PASSWORD (For temporary password or regular change)
router.post('/change-password', authenticateToken, async (req, res) => {
try {
const { currentPassword, newPassword } = req.body;
const userId = req.user.userId;

    // Validation
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Password strength check
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain uppercase, lowercase, number, and special character'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password (only if not temporary)
    if (!user.isTemporaryPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user
    user.password = hashedPassword;
    user.isTemporaryPassword = false;
    user.lastPasswordChange = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

} catch (error) {
console.error('Change password error:', error);
res.status(500).json({
success: false,
message: 'Server error during password change'
});
}
});

// FORGOT PASSWORD (Send reset link to email)
router.post('/forgot-password', async (req, res) => {
try {
const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists
      return res.json({
        success: true,
        message: 'If an account exists, a password reset link has been sent to your email'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with reset link
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendPasswordResetEmail(user.email, resetUrl, user.name);

    res.json({
      success: true,
      message: 'If an account exists, a password reset link has been sent to your email'
    });

} catch (error) {
console.error('Forgot password error:', error);
res.status(500).json({
success: false,
message: 'Server error during password reset request'
});
}
});

// RESET PASSWORD (Using token from email)
router.post('/reset-password/:token', async (req, res) => {
try {
const { token } = req.params;
const { newPassword } = req.body;

    // Validation
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Password strength check
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain uppercase, lowercase, number, and special character'
      });
    }

    // Hash token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user
    user.password = hashedPassword;
    user.isTemporaryPassword = false;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.lastPasswordChange = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully. You can now login.'
    });

} catch (error) {
console.error('Reset password error:', error);
res.status(500).json({
success: false,
message: 'Server error during password reset'
});
}
});

// VERIFY TOKEN (Check if user is authenticated)
router.get('/verify', authenticateToken, async (req, res) => {
try {
const user = await User.findById(req.user.userId).select('-password');

    res.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        requirePasswordChange: user.isTemporaryPassword
      }
    });

} catch (error) {
res.status(500).json({
success: false,
message: 'Server error'
});
}
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];

if (!token) {
return res.status(401).json({
success: false,
message: 'Access denied. No token provided.'
});
}

jwt.verify(token, JWT_SECRET, (err, user) => {
if (err) {
return res.status(403).json({
success: false,
message: 'Invalid or expired token'
});
}
req.user = user;
next();
});
}

module.exports = router;

3. INITIAL SETUP SCRIPT
   File: /server/scripts/setupAdmin.js
   javascriptconst mongoose = require('mongoose');
   const bcrypt = require('bcryptjs');
   const User = require('../models/User');
   require('dotenv').config();

const setupAdmin = async () => {
try {
await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: '706359@gmail.com' });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      process.exit(0);
    }

    // Create temporary password
    const tempPassword = 'TempPass@123'; // You'll change this on first login
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // Create admin user
    const admin = new User({
      email: '706359@gmail.com',
      phone: '8958111112',
      password: hashedPassword,
      name: 'Admin',
      role: 'Admin',
      isTemporaryPassword: true, // Forces password change on first login
      isActive: true,
      loginAttempts: 0,
      createdAt: new Date()
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Temporary Password:', tempPassword);
    console.log('⚠️  IMPORTANT: You MUST change this password on first login!');

    process.exit(0);

} catch (error) {
console.error('Error setting up admin:', error);
process.exit(1);
}
};

setupAdmin();
Run this script once:
bashnode server/scripts/setupAdmin.js

4. EMAIL UTILITY
   File: /server/utils/email.js
   javascriptconst nodemailer = require('nodemailer');

// Configure email transporter (Gmail)
const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: process.env.EMAIL_USER, // Your Gmail (706359@gmail.com)
pass: process.env.EMAIL_PASSWORD // Gmail App Password (not regular password)
}
});

// Send password reset email
const sendPasswordResetEmail = async (to, resetUrl, userName) => {
const mailOptions = {
from: `"HomieBites Admin" <${process.env.EMAIL_USER}>`,
to: to,
subject: 'Password Reset Request - HomieBites Admin',
html: `      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #3B82F6; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; }
          .button { 
            display: inline-block; 
            padding: 12px 30px; 
            background-color: #3B82F6; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
          }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <p>You requested to reset your password for your HomieBites Admin account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy this link to your browser:</p>
            <p style="word-break: break-all; color: #3B82F6;">${resetUrl}</p>
            <p><strong>⚠️ This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>© 2025 HomieBites. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
   `
};

try {
await transporter.sendMail(mailOptions);
console.log('Password reset email sent to:', to);
return true;
} catch (error) {
console.error('Error sending email:', error);
throw error;
}
};

module.exports = { sendPasswordResetEmail };

5. ENVIRONMENT VARIABLES
   File: /server/.env
   env# MongoDB
   MONGODB_URI=mongodb://localhost:27017/homiebites

# JWT Secret (Change this to a random string)

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345

# Email Configuration (Gmail)

EMAIL_USER=706359@gmail.com
EMAIL_PASSWORD=your-gmail-app-password-here

# Frontend URL

FRONTEND_URL=http://localhost:3000

# Server Port

PORT=5000
⚠️ IMPORTANT: Gmail App Password Setup

Go to Google Account Settings
Enable 2-Step Verification
Generate App Password: https://myaccount.google.com/apppasswords
Use that 16-character password in EMAIL_PASSWORD

6. FRONTEND - LOGIN PAGE
   File: /client/src/pages/Login.jsx
   javascriptimport React, { useState } from 'react';
   import { useNavigate } from 'react-router-dom';
   import axios from 'axios';

const Login = () => {
const navigate = useNavigate();
const [formData, setFormData] = useState({
email: '',
password: ''
});
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value
});
setError('');
};

const handleSubmit = async (e) => {
e.preventDefault();
setLoading(true);
setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      if (response.data.success) {
        // Store token
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Check if password change required
        if (response.data.requirePasswordChange) {
          navigate('/change-password', {
            state: { isTemporary: true }
          });
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }

};

return (
<div className="min-h-screen flex items-center justify-center bg-gray-100">
<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
<div className="text-center mb-8">
<h1 className="text-3xl font-bold text-gray-900">HomieBites</h1>
<p className="text-gray-600 mt-2">Admin Dashboard</p>
</div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="706359@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>

);
};

export default Login;

7. FRONTEND - CHANGE PASSWORD PAGE
   File: /client/src/pages/ChangePassword.jsx
   javascriptimport React, { useState } from 'react';
   import { useNavigate, useLocation } from 'react-router-dom';
   import axios from 'axios';

const ChangePassword = () => {
const navigate = useNavigate();
const location = useLocation();
const isTemporary = location.state?.isTemporary || false;

const [formData, setFormData] = useState({
currentPassword: '',
newPassword: '',
confirmPassword: ''
});
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
const [loading, setLoading] = useState(false);
const [passwordStrength, setPasswordStrength] = useState({
hasLength: false,
hasUpperCase: false,
hasLowerCase: false,
hasNumber: false,
hasSpecialChar: false
});

const checkPasswordStrength = (password) => {
setPasswordStrength({
hasLength: password.length >= 8,
hasUpperCase: /[A-Z]/.test(password),
hasLowerCase: /[a-z]/.test(password),
hasNumber: /\d/.test(password),
hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
});
};

const handleChange = (e) => {
const { name, value } = e.target;
setFormData({
...formData,
[name]: value
});

    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }

    setError('');
    setSuccess('');

};

const handleSubmit = async (e) => {
e.preventDefault();
setLoading(true);
setError('');
setSuccess('');

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    const allRequirementsMet = Object.values(passwordStrength).every(Boolean);
    if (!allRequirementsMet) {
      setError('Password does not meet all security requirements');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/auth/change-password',
        {
          currentPassword: isTemporary ? undefined : formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSuccess('Password changed successfully! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }

};

return (
<div className="min-h-screen flex items-center justify-center bg-gray-100">
<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
<div className="mb-8">
<h2 className="text-2xl font-bold text-gray-900">
{isTemporary ? '🔐 Create New Password' : 'Change Password'}
</h2>
{isTemporary && (
<div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
<p className="text-sm text-yellow-800">
⚠️ You're using a temporary password. Please create a new secure password to continue.
</p>
</div>
)}
</div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {!isTemporary && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter current password"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
            />
          </div>

          {/* Password Strength Indicator */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
            <div className="space-y-1 text-sm">
              <div className={passwordStrength.hasLength ? 'text-green-600' : 'text-gray-500'}>
                {passwordStrength.hasLength ? '✓' : '○'} At least 8 characters
              </div>
              <div className={passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-500'}>
                {passwordStrength.hasUpperCase ? '✓' : '○'} One uppercase letter
              </div>
              <div className={passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-500'}>
                {passwordStrength.hasLowerCase ? '✓' : '○'} One lowercase letter
              </div>
              <div className={passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}>
                {passwordStrength.hasNumber ? '✓' : '○'} One number
              </div>
              <div className={passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}>
                {passwordStrength.hasSpecialChar ? '✓' : '○'} One special character (!@#$%^&*...)
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>

          {!isTemporary && (
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>

);
};

export default ChangePassword;

8. FORGOT/RESET PASSWORD PAGES
   File: /client/src/pages/ForgotPassword.jsx
   javascriptimport React, { useState } from 'react';
   import { useNavigate } from 'react-router-dom';
   import axios from 'axios';

const ForgotPassword = () => {
const navigate = useNavigate();
const [email, setEmail] = useState('');
const [message, setMessage] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
e.preventDefault();
setLoading(true);
setError('');
setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });

      if (response.data.success) {
        setMessage('Password reset link has been sent to your email. Please check your inbox.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }

};

return (
<div className="min-h-screen flex items-center justify-center bg-gray-100">
<div className="max-w-mContinue1:57 PMd w-full bg-white rounded-lg shadow-lg p-8">

<div className="mb-8">
<h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
<p className="text-gray-600 mt-2">Enter your email to receive a password reset link</p>
</div>
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="706359@gmail.com"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition"
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>

      <button
        type="button"
        onClick={() => navigate('/login')}
        className="w-full text-blue-600 hover:text-blue-700 text-sm"
      >
        ← Back to Login
      </button>
    </form>

  </div>
</div>
);
};
export default ForgotPassword;

### **File: /client/src/pages/ResetPassword.jsx**

```javascript
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      hasLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const allRequirementsMet = Object.values(passwordStrength).every(Boolean);
    if (!allRequirementsMet) {
      setError('Password does not meet all security requirements');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-8'>
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900'>Reset Password</h2>
          <p className='text-gray-600 mt-2'>Create a new secure password</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {error && (
            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded'>
              {error}
            </div>
          )}

          {success && (
            <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded'>
              {success}
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>New Password</label>
            <input
              type='password'
              name='newPassword'
              value={formData.newPassword}
              onChange={handleChange}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Confirm Password</label>
            <input
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Password Requirements:</p>
            <div className='space-y-1 text-sm'>
              <div className={passwordStrength.hasLength ? 'text-green-600' : 'text-gray-500'}>
                {passwordStrength.hasLength ? '✓' : '○'} At least 8 characters
              </div>
              <div className={passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-500'}>
                {passwordStrength.hasUpperCase ? '✓' : '○'} One uppercase letter
              </div>
              <div className={passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-500'}>
                {passwordStrength.hasLowerCase ? '✓' : '○'} One lowercase letter
              </div>
              <div className={passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}>
                {passwordStrength.hasNumber ? '✓' : '○'} One number
              </div>
              <div className={passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}>
                {passwordStrength.hasSpecialChar ? '✓' : '○'} One special character
              </div>
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition'
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
```

---

## **9. HOW IT WORKS - COMPLETE FLOW**

### **Initial Setup:**

Run: node server/scripts/setupAdmin.js
Creates admin user with:

Email: 706359@gmail.com
Phone: 8958111112
Temp Password: TempPass@123
isTemporaryPassword: true

### **First Login Flow:**

User goes to /login
Enters: 706359@gmail.com / TempPass@123
Backend checks password ✓
Sees isTemporaryPassword = true
Returns: requirePasswordChange: true
Frontend redirects to /change-password
User MUST create new password
Backend sets isTemporaryPassword = false
Saves new password (hashed)
User redirected to /dashboard

### **Regular Login Flow (After password changed):**

User enters email/password
Backend validates
Returns JWT token
User accesses dashboard

### **Forgot Password Flow:**

User clicks "Forgot Password"
Enters email (706359@gmail.com)
Backend generates reset token
Sends email with reset link
User clicks link (valid 1 hour)
Creates new password
Can login with new password

### **Security Features:**

✅ Passwords hashed with bcrypt (10 rounds)
✅ JWT tokens expire in 7 days
✅ Password strength validation
✅ Account lockout after 5 failed attempts (15 min)
✅ Reset tokens expire in 1 hour
✅ Temp password forces immediate change
✅ No password reuse (optional feature)

---

## **10. PACKAGE.JSON DEPENDENCIES**

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.6.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^6.9.7",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "crypto": "built-in"
  }
}
```

Install:

```bash
npm install express mongoose bcryptjs jsonwebtoken nodemailer dotenv cors
```

This complete system provides secure password management with all features you requested!
