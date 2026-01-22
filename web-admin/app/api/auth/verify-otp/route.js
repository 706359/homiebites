import connectDB from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import jwt from 'jsonwebtoken';
import { rateLimit } from '../../../../lib/middleware/security.js';

function getAdminCredentials() {
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be set in production');
  }
  return { JWT_SECRET: process.env.JWT_SECRET || 'homiebites_secret' };
}

export async function POST(request) {
  try {
    const ok = rateLimit(15, 15 * 60 * 1000)(request);
    if (!ok) {
      return Response.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

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

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return Response.json(
        { success: false, error: 'Invalid email or OTP' },
        { status: 401 }
      );
    }

    if (!user.otp || !user.otpExpiresAt) {
      return Response.json(
        {
          success: false,
          error: 'OTP not found or expired. Please request a new OTP.',
        },
        { status: 401 }
      );
    }

    if (new Date() > user.otpExpiresAt) {
      user.otp = null;
      user.otpExpiresAt = null;
      await user.save();

      return Response.json(
        { success: false, error: 'OTP has expired. Please request a new OTP.' },
        { status: 401 }
      );
    }

    if (user.otp !== normalizedOTP) {
      return Response.json(
        { success: false, error: 'Invalid OTP' },
        { status: 401 }
      );
    }

    const adminCreds = getAdminCredentials();
    const verificationToken = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
        purpose: 'password-reset-verification',
      },
      adminCreds.JWT_SECRET,
      { expiresIn: '30m' }
    );

    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return Response.json({
      success: true,
      message: 'OTP verified successfully',
      verificationToken,
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development')
      console.error('[Verify OTP API] Error:', error);
    if (error.message && error.message.includes('connect')) {
      return Response.json(
        {
          success: false,
          error: 'Database connection failed. Please try again later.',
          details:
            process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { status: 503 }
      );
    }

    return Response.json(
      {
        success: false,
        error: error.message || 'Failed to verify OTP. Please try again.',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
