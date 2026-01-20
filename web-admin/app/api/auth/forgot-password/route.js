
import connectDB from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../../../../lib/services/emailService.js';
import { rateLimit } from '../../../../lib/middleware/security.js';

export async function POST(request) {
  try {
    const ok = rateLimit(15, 15 * 60 * 1000)(request);
    if (!ok) {
      return Response.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    await connectDB();

    const body = await request.json();
    const { email } = body;

    if (!email || !email.trim()) {
      return Response.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user = await User.findOne({ email: normalizedEmail });

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || (process.env.NODE_ENV === 'production' ? '' : '706359@gmail.com');
    const ADMIN_MOBILE = process.env.ADMIN_MOBILE || (process.env.NODE_ENV === 'production' ? '' : '8958111112');

    if (!user && ADMIN_EMAIL && normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
      
      user = new User({
        email: normalizedEmail,
        phone: ADMIN_MOBILE,
        mobile: ADMIN_MOBILE,
        name: 'Admin',
        role: 'Admin',
        isActive: true,
        loginAttempts: 0,
        isTemporaryPassword: false,
      });
      await user.save();
    }

    if (!user) {
      
      return Response.json({
        success: true,
        message: 'If an account exists, a password reset link has been sent to your email'
      });
    }

    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); 
    await user.save();

    const FRONTEND_URL = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000');
    if (process.env.NODE_ENV === 'production' && !FRONTEND_URL) {
      return Response.json({ success: false, error: 'Server misconfiguration. Please contact support.' }, { status: 503 });
    }
    const resetUrl = `${FRONTEND_URL}/admin/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(user.email, resetUrl, user.name || 'User');
      if (process.env.NODE_ENV === 'development') {
        console.log('[Forgot Password] Reset link generated for:', user.email);
        console.log('[Forgot Password] Reset URL:', resetUrl);
      }
    } catch (emailError) {
      if (process.env.NODE_ENV === 'development') console.error('[Forgot Password] Email sending error:', emailError);
    }

    return Response.json({
      success: true,
      message: 'If an account exists, a password reset link has been sent to your email'
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('[Forgot Password API] Error:', error);
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
        error: error.message || 'Server error during password reset request',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
