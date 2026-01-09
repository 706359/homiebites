/**
 * Next.js API Route: Auth Login
 * Migrated from Express backend
 */
import connectDB from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import jwt from 'jsonwebtoken';

// Helper function to get admin credentials
function getAdminCredentials() {
  return {
    JWT_SECRET: process.env.JWT_SECRET || 'homiebites_secret',
    ADMIN_USERNAME: 'adminHomieBites',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Bless@@!!##12',
    ADMIN_FIRSTNAME: process.env.ADMIN_FIRSTNAME || 'Admin',
    ADMIN_LASTNAME: process.env.ADMIN_LASTNAME || 'User',
    ADMIN_MOBILE: process.env.ADMIN_MOBILE || '8958111112',
  };
}

export async function POST(request) {
  try {
    await connectDB();
    const adminCreds = getAdminCredentials();
    const body = await request.json();
    const { email, password, username } = body;

    // Normalize login identifier
    const loginUsername = String(username || email || '').trim();
    const trimmedPassword = String(password || '').trim();

    // Check admin credentials
    const normalizedMobile = String(adminCreds.ADMIN_MOBILE || '').trim();
    const normalizedUsername = String(adminCreds.ADMIN_USERNAME).trim();
    const usernameMatch = loginUsername === normalizedUsername;
    const mobileMatch = !!(normalizedMobile && loginUsername === normalizedMobile);
    const isAdminIdentifier = usernameMatch || mobileMatch;
    const expectedPassword = String(adminCreds.ADMIN_PASSWORD).trim();
    const passwordMatch = trimmedPassword === expectedPassword;

    if (isAdminIdentifier && passwordMatch) {
      const adminName = `${adminCreds.ADMIN_FIRSTNAME} ${adminCreds.ADMIN_LASTNAME}`.trim() || 'Admin';
      const token = jwt.sign(
        {
          id: 'admin',
          username: adminCreds.ADMIN_USERNAME,
          email: 'admin@homiebites.com',
          role: 'admin',
          isAdmin: true,
          firstName: adminCreds.ADMIN_FIRSTNAME,
          lastName: adminCreds.ADMIN_LASTNAME,
          mobile: adminCreds.ADMIN_MOBILE,
        },
        adminCreds.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return Response.json({
        success: true,
        token,
        user: {
          id: 'admin',
          name: adminName,
          email: 'admin@homiebites.com',
          role: 'admin',
          isAdmin: true,
          firstName: adminCreds.ADMIN_FIRSTNAME,
          lastName: adminCreds.ADMIN_LASTNAME,
          mobile: adminCreds.ADMIN_MOBILE,
        },
      });
    }

    // Try to find user in database
    const user = await User.findOne({
      $or: [{ email: loginUsername }, { username: loginUsername }],
    });

    if (!user) {
      return Response.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role || 'user',
        isAdmin: user.role === 'admin',
      },
      adminCreds.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return Response.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        isAdmin: user.role === 'admin',
      },
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return Response.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: Object.values(error.errors || {}).map(e => e.message).join(', ')
        },
        { status: 400 }
      );
    }
    // Handle database connection errors
    if (error.message && (error.message.includes('connect') || error.message.includes('ECONNREFUSED'))) {
      return Response.json(
        { 
          success: false, 
          error: 'Database connection failed. Please check your database configuration.'
        },
        { status: 503 }
      );
    }
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Login failed. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}

