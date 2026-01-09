/**
 * Next.js API Route: Verify OTP
 * Verifies the OTP and returns a verification token for identity verification
 */
import connectDB from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import jwt from 'jsonwebtoken';

// Helper function to get admin credentials
function getAdminCredentials() {
  return {
    JWT_SECRET: process.env.JWT_SECRET || 'homiebites_secret',
  };
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !email.trim()) {
      return Response.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!otp || !otp.trim()) {
      return Response.json(
        { success: false, error: 'OTP is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOTP = otp.trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return Response.json(
        { success: false, error: 'Invalid email or OTP' },
        { status: 401 }
      );
    }

    // Check if OTP exists and hasn't expired
    if (!user.otp || !user.otpExpiresAt) {
      return Response.json(
        { success: false, error: 'OTP not found or expired. Please request a new OTP.' },
        { status: 401 }
      );
    }

    if (new Date() > user.otpExpiresAt) {
      // Clear expired OTP
      user.otp = null;
      user.otpExpiresAt = null;
      await user.save();
      
      return Response.json(
        { success: false, error: 'OTP has expired. Please request a new OTP.' },
        { status: 401 }
      );
    }

    // Verify OTP
    if (user.otp !== normalizedOTP) {
      return Response.json(
        { success: false, error: 'Invalid OTP' },
        { status: 401 }
      );
    }

    // OTP is valid, generate verification token
    const adminCreds = getAdminCredentials();
    const verificationToken = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
        purpose: 'password-reset-verification',
      },
      adminCreds.JWT_SECRET,
      { expiresIn: '30m' } // 30 minutes
    );

    // Store verification token
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return Response.json({
      success: true,
      message: 'OTP verified successfully',
      verificationToken,
    });
  } catch (error) {
    console.error('[Verify OTP API] Error:', error);
    
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
        error: error.message || 'Failed to verify OTP. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
