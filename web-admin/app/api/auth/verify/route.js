import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'homiebites_secret';

export async function GET(request) {
  try {
    await connectDB();

    // Try to get token from Authorization header first
    let token;
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.split(' ')[1]) {
      token = authHeader.split(' ')[1];
    }

    // If no Authorization header, try to get from HttpOnly cookie
    if (!token) {
      const cookies = request.headers.get('cookie');
      if (cookies) {
        const cookieArray = cookies.split(';');
        for (const cookie of cookieArray) {
          const [name, value] = cookie.trim().split('=');
          if (name === 'homiebites_admin_token') {
            token = value;
            break;
          }
        }
      }
    }

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
        requirePasswordChange: user.isTemporaryPassword,
      },
    });
  } catch (error) {
    console.error('[Verify API] Error:', error);

    return Response.json(
      {
        success: false,
        error: error.message || 'Server error',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
