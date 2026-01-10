/**
 * Next.js API Route: Verify Token
 * Check if user is authenticated
 * Following ADMIN_PASSWORD.md - GET /api/auth/verify
 */
import connectDB from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'homiebites_secret';

export async function GET(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return Response.json(
        { success: false, error: 'Access denied. No token provided.' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return Response.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 403 }
      );
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || 'user',
        requirePasswordChange: user.isTemporaryPassword
      }
    });

  } catch (error) {
    console.error('[Verify API] Error:', error);
    
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
