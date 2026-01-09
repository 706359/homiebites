/**
 * Next.js API Route: Forgot Password
 * Generates and sends OTP to user's email address (Gmail)
 */
import connectDB from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import jwt from 'jsonwebtoken';
import { sendOTPEmail } from '../../../../lib/services/emailService.js';

// Helper function to get admin credentials
function getAdminCredentials() {
  return {
    JWT_SECRET: process.env.JWT_SECRET || 'homiebites_secret',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || '706359@gmail.com',
    ADMIN_MOBILE: process.env.ADMIN_MOBILE || '8958111112',
  };
}

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email } = body;

    if (!email || !email.trim()) {
      return Response.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const adminCreds = getAdminCredentials();
    const normalizedEmail = email.trim().toLowerCase();

    // Check if it's the admin email
    const isAdminEmail = normalizedEmail === adminCreds.ADMIN_EMAIL.toLowerCase();

    let user;
    if (isAdminEmail) {
      // For admin, create or update a user record
      user = await User.findOneAndUpdate(
        { email: normalizedEmail },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // Update admin fields if not set
      if (!user.mobile) {
        user.mobile = adminCreds.ADMIN_MOBILE;
      }
      if (!user.name) {
        user.name = 'Admin User';
      }
      if (!user.role) {
        user.role = 'admin';
      }
      await user.save();
    } else {
      // Find regular user
      user = await User.findOne({ email: normalizedEmail });
      
      if (!user) {
        // Don't reveal if email exists for security
        return Response.json(
          { success: false, error: 'If this email exists, an OTP will be sent to your registered email address' },
          { status: 404 }
        );
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in user record
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    // Clear previous verification and reset tokens
    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;
    user.resetToken = null;
    user.resetTokenExpiresAt = null;
    await user.save();

    // Send OTP via Email (Gmail)
    let otpSent = false;
    let emailError = null;
    let isDevMode = false;
    
    if (user.email) {
      try {
        const emailResult = await sendOTPEmail(user.email, otp, 'HomieBites');
        if (emailResult.success) {
          // Check if it's dev mode (email logged but not sent)
          isDevMode = emailResult.devMode === true;
          otpSent = true;
          if (isDevMode) {
            console.warn('[Forgot Password] Development mode - Email sending disabled. Set ENABLE_EMAIL_IN_DEV=true to enable.');
            console.log(`[Forgot Password] OTP for ${user.email}: ${otp}`);
          } else {
            console.log('[Forgot Password] OTP sent via email to', user.email);
          }
        } else {
          emailError = emailResult.error || 'Email sending failed';
          console.error('[Forgot Password] Email sending failed:', emailError);
        }
      } catch (emailErr) {
        emailError = emailErr.message || 'Email sending error';
        console.error('[Forgot Password] Email sending error:', emailErr);
      }
    } else {
      emailError = 'User email not found';
    }
    
    // In production or when email should work, return error if email failed
    if (!otpSent && !isDevMode) {
      return Response.json(
        { 
          success: false, 
          error: emailError || 'Failed to send OTP email. Please check your email configuration.',
          details: process.env.NODE_ENV === 'development' ? `OTP: ${otp} (check server logs)` : undefined
        },
        { status: 500 }
      );
    }

    // Prepare response
    const response = {
      success: true,
      message: isDevMode
        ? 'OTP generated. Check server console for OTP (email disabled in dev mode). Set ENABLE_EMAIL_IN_DEV=true in .env to enable email sending.'
        : 'OTP sent to your registered email address',
    };

    // Log OTP in development mode (server-side only, not sent to client)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Forgot Password] OTP for ${email}: ${otp}`);
    }

    return Response.json(response);
  } catch (error) {
    console.error('[Forgot Password API] Error:', error);
    
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
        error: error.message || 'Failed to send OTP. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
