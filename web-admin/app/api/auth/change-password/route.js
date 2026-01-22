import connectDB from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import {
  hashPassword,
  verifyPassword,
} from '../../../../lib/utils/password.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'homiebites_secret';

function authenticateToken(authHeader) {
  if (!authHeader) {
    throw new Error('Access denied. No token provided.');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    let decoded;
    try {
      decoded = authenticateToken(authHeader);
    } catch (authError) {
      return Response.json(
        { success: false, error: authError.message },
        { status: authError.message.includes('denied') ? 401 : 403 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 8) {
      return Response.json(
        {
          success: false,
          error: 'Password must be at least 8 characters long',
        },
        { status: 400 }
      );
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return Response.json(
        {
          success: false,
          error:
            'Password must contain uppercase, lowercase, number, and special character',
        },
        { status: 400 }
      );
    }

    const userId = decoded.userId;
    const user = await User.findById(userId);

    if (!user) {
      return Response.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    if (!user.isTemporaryPassword) {
      if (!currentPassword) {
        return Response.json(
          {
            success: false,
            error: 'Current password is required',
          },
          { status: 400 }
        );
      }

      if (!user.password) {
        return Response.json(
          {
            success: false,
            error: 'No password set. Please use password reset.',
          },
          { status: 400 }
        );
      }

      const isMatch = await verifyPassword(currentPassword, user.password);
      if (!isMatch) {
        return Response.json(
          {
            success: false,
            error: 'Current password is incorrect',
          },
          { status: 401 }
        );
      }
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    user.isTemporaryPassword = false;
    user.lastPasswordChange = new Date();
    await user.save();

    return Response.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('[Change Password API] Error:', error);

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
        error: error.message || 'Server error during password change',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: error.status || 500 }
    );
  }
}
