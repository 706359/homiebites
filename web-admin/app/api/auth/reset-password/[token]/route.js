/**
 * Next.js API Route: Reset Password (Using token from email)
 * Following ADMIN_PASSWORD.md - POST /api/auth/reset-password/:token
 */
import connectDB from '../../../../../lib/db.js';
import User from '../../../../../lib/models/User.js';
import { hashPassword } from '../../../../../lib/utils/password.js';
import crypto from 'crypto';

export async function POST(request, { params }) {
  try {
    await connectDB();
    
    // Resolve params (Next.js 15+ compatibility)
    const resolvedParams = params && typeof params.then === 'function' ? await params : params;
    const { token } = resolvedParams || {};

    if (!token) {
      return Response.json(
        { success: false, error: 'Reset token is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { newPassword } = body;

    // Validation
    if (!newPassword || newPassword.length < 8) {
      return Response.json(
        {
          success: false,
          error: 'Password must be at least 8 characters long'
        },
        { status: 400 }
      );
    }

    // Password strength check
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return Response.json(
        {
          success: false,
          error: 'Password must contain uppercase, lowercase, number, and special character'
        },
        { status: 400 }
      );
    }

    // Hash token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token and not expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          error: 'Invalid or expired reset token'
        },
        { status: 400 }
      );
    }

    // Hash new password using bcrypt (10 rounds as per ADMIN_PASSWORD.md)
    const hashedPassword = await hashPassword(newPassword);

    // Update user - store password in database (following ADMIN_PASSWORD.md)
    user.password = hashedPassword;
    user.isTemporaryPassword = false;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.lastPasswordChange = new Date();
    // Also clear login attempts and lock on successful reset
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    return Response.json({
      success: true,
      message: 'Password reset successfully. You can now login.'
    });

  } catch (error) {
    console.error('[Reset Password API] Error:', error);
    
    if (error.message && error.message.includes('connect')) {
      return Response.json(
        { 
          success: false, 
          error: 'Database connection failed. Please try again later.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 503 }
      );
    }

    return Response.json(
      { 
        success: false, 
        error: error.message || 'Server error during password reset',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
