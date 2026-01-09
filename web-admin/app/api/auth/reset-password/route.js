/**
 * Next.js API Route: Reset Password
 * Resets the user's password using the reset token
 */
import connectDB from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Helper function to get admin credentials
function getAdminCredentials() {
  return {
    JWT_SECRET: process.env.JWT_SECRET || 'homiebites_secret',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || '706359@gmail.com',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Bless@@!!##12',
  };
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, resetToken, newPassword } = body;

    if (!email || !email.trim()) {
      return Response.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!resetToken || !resetToken.trim()) {
      return Response.json(
        { success: false, error: 'Reset token is required' },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return Response.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return Response.json(
        { success: false, error: 'Invalid email or reset token' },
        { status: 401 }
      );
    }

    // Verify reset token
    if (!user.resetToken || !user.resetTokenExpiresAt) {
      return Response.json(
        { success: false, error: 'Reset token not found or expired. Please start the process again.' },
        { status: 401 }
      );
    }

    if (new Date() > user.resetTokenExpiresAt) {
      // Clear expired token
      user.resetToken = null;
      user.resetTokenExpiresAt = null;
      await user.save();
      
      return Response.json(
        { success: false, error: 'Reset token has expired. Please start the process again.' },
        { status: 401 }
      );
    }

    if (user.resetToken !== resetToken) {
      return Response.json(
        { success: false, error: 'Invalid reset token' },
        { status: 401 }
      );
    }

    // Verify JWT token as well (double verification)
    const adminCreds = getAdminCredentials();
    let decoded;
    try {
      decoded = jwt.verify(resetToken, adminCreds.JWT_SECRET);
      if (decoded.email !== normalizedEmail || decoded.purpose !== 'password-reset') {
        return Response.json(
          { success: false, error: 'Invalid reset token' },
          { status: 401 }
        );
      }
    } catch (jwtError) {
      return Response.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 401 }
      );
    }

    // Reset password
    const adminCredsForPassword = getAdminCredentials();
    const isAdminEmail = normalizedEmail === adminCredsForPassword.ADMIN_EMAIL.toLowerCase();

    if (isAdminEmail) {
      // For admin, we can't hash the password if it's stored in env
      // But we can update it if needed - for now, just clear the reset token
      // In a real scenario, you might want to update ADMIN_PASSWORD in env or a secure config
      // For this implementation, we'll just clear the tokens
      user.resetToken = null;
      user.resetTokenExpiresAt = null;
      await user.save();
      
      return Response.json({
        success: true,
        message: 'Password reset successful. Please update your ADMIN_PASSWORD environment variable.',
        note: 'For admin accounts, the password is managed via environment variables. Please update ADMIN_PASSWORD in your .env file.',
      });
    } else {
      // For regular users, hash and store the new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      user.password = hashedPassword;
      // Clear reset token after successful password reset
      user.resetToken = null;
      user.resetTokenExpiresAt = null;
      // Also clear OTP and verification tokens
      user.otp = null;
      user.otpExpiresAt = null;
      user.verificationToken = null;
      user.verificationTokenExpiresAt = null;
      await user.save();

      return Response.json({
        success: true,
        message: 'Password reset successfully',
      });
    }
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
        error: error.message || 'Failed to reset password. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
