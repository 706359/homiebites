/**
 * Next.js API Route: Auth Login
 * Migrated from Express backend
 */
import connectDB from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import jwt from 'jsonwebtoken';
import { verifyPassword, isBcryptHash } from '../../../../lib/utils/password.js';

// Helper function to get admin credentials
function getAdminCredentials() {
  // SECURE: Prefer ADMIN_PASSWORD_HASH (bcrypt hash) over ADMIN_PASSWORD (plain text)
  // If ADMIN_PASSWORD_HASH is set, use it (most secure)
  // Otherwise, fall back to ADMIN_PASSWORD if set
  // No default password - must be set in environment variables
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const adminPasswordPlain = process.env.ADMIN_PASSWORD?.trim();
  
  // Require at least one password method to be configured
  if (!adminPasswordHash && !adminPasswordPlain) {
    throw new Error('ADMIN_PASSWORD_HASH or ADMIN_PASSWORD must be set in environment variables');
  }
  
  // Log security warning if using plain text password
  if (!adminPasswordHash && process.env.NODE_ENV === 'development') {
    console.warn('[Admin Credentials] Using plain text password. For better security, set ADMIN_PASSWORD_HASH environment variable. Run: node scripts/generate-admin-hash.js');
  }
  
  return {
    JWT_SECRET: process.env.JWT_SECRET || 'homiebites_secret',
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'adminHomieBites',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || '706359@gmail.com',
    // Store both hash and plain text (for migration support)
    ADMIN_PASSWORD_HASH: adminPasswordHash,
    ADMIN_PASSWORD: adminPasswordPlain,
    ADMIN_FIRSTNAME: process.env.ADMIN_FIRSTNAME || 'Admin',
    ADMIN_LASTNAME: process.env.ADMIN_LASTNAME || 'User',
    ADMIN_MOBILE: process.env.ADMIN_MOBILE || '8958111112',
  };
}

export async function POST(request) {
  try {
    // Connect to database first - if this fails, return appropriate error
    try {
      await connectDB();
    } catch (dbError) {
      console.error('[Login API] Database connection error:', dbError.message);
      return Response.json(
        { 
          success: false, 
          error: 'Database connection failed. Please check your MongoDB connection.',
          details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        },
        { status: 503 }
      );
    }
    
    const adminCreds = getAdminCredentials();
    const body = await request.json();
    const { email, password, username } = body;

    // Normalize login identifier
    const loginUsername = String(username || email || '').trim();
    const trimmedPassword = String(password || '').trim();

    // Normalize mobile numbers - remove all non-digit characters for comparison
    const normalizeMobile = (mobile) => {
      return String(mobile || '').replace(/\D/g, ''); // Remove all non-digits
    };

    // Check admin credentials
    const normalizedMobile = normalizeMobile(adminCreds.ADMIN_MOBILE);
    const normalizedUsername = String(adminCreds.ADMIN_USERNAME).trim().toLowerCase();
    const normalizedEmail = String(adminCreds.ADMIN_EMAIL || '').trim().toLowerCase();
    const normalizedLoginUsername = loginUsername.toLowerCase();
    const normalizedLoginMobile = normalizeMobile(loginUsername);
    
    const usernameMatch = normalizedLoginUsername === normalizedUsername;
    const emailMatch = !!(normalizedEmail && normalizedLoginUsername === normalizedEmail);
    const mobileMatch = !!(normalizedMobile && normalizedLoginMobile === normalizedMobile);
    const isAdminIdentifier = usernameMatch || emailMatch || mobileMatch;
    
    // SECURE: Verify password using bcrypt if hash is available, otherwise fall back to plain text comparison
    let passwordMatch = false;
    if (isAdminIdentifier) {
      if (adminCreds.ADMIN_PASSWORD_HASH && isBcryptHash(adminCreds.ADMIN_PASSWORD_HASH)) {
        // Use secure bcrypt comparison
        passwordMatch = await verifyPassword(trimmedPassword, adminCreds.ADMIN_PASSWORD_HASH);
      } else {
        // Fallback to plain text comparison (for migration - not recommended for production)
        const expectedPassword = String(adminCreds.ADMIN_PASSWORD).trim();
        passwordMatch = trimmedPassword === expectedPassword;
        
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Admin Login] Using plain text password comparison. Set ADMIN_PASSWORD_HASH for secure authentication.');
        }
      }
    }

    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      const usingHash = !!(adminCreds.ADMIN_PASSWORD_HASH && isBcryptHash(adminCreds.ADMIN_PASSWORD_HASH));
      console.log('[Login Debug]', {
        loginUsername,
        normalizedLoginUsername,
        normalizedLoginMobile,
        normalizedUsername,
        normalizedEmail,
        normalizedMobile,
        usernameMatch,
        emailMatch,
        mobileMatch,
        isAdminIdentifier,
        passwordLength: trimmedPassword.length,
        passwordMatch,
        usingSecureHash: usingHash,
        hasEnvPasswordHash: !!adminCreds.ADMIN_PASSWORD_HASH,
        hasEnvPassword: !!process.env.ADMIN_PASSWORD,
      });
    }

    if (isAdminIdentifier && passwordMatch) {
      const adminName = `${adminCreds.ADMIN_FIRSTNAME} ${adminCreds.ADMIN_LASTNAME}`.trim() || 'Admin';
      const adminEmail = adminCreds.ADMIN_EMAIL || 'admin@homiebites.com';
      const token = jwt.sign(
        {
          id: 'admin',
          username: adminCreds.ADMIN_USERNAME,
          email: adminEmail,
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
          email: adminEmail,
          role: 'admin',
          isAdmin: true,
          firstName: adminCreds.ADMIN_FIRSTNAME,
          lastName: adminCreds.ADMIN_LASTNAME,
          mobile: adminCreds.ADMIN_MOBILE,
        },
      });
    }

    // If admin identifier matched but password didn't, provide specific error
    if (isAdminIdentifier && !passwordMatch) {
      const usingHash = !!(adminCreds.ADMIN_PASSWORD_HASH && isBcryptHash(adminCreds.ADMIN_PASSWORD_HASH));
      const errorMessage = 'Invalid admin password. Please check your credentials.';
      
      return Response.json(
        { 
          success: false, 
          error: errorMessage,
          hint: process.env.NODE_ENV === 'development' 
            ? (usingHash 
                ? 'Password does not match the hashed password in ADMIN_PASSWORD_HASH.'
                : 'Password does not match. Consider using ADMIN_PASSWORD_HASH for secure authentication.')
            : undefined
        },
        { status: 401 }
      );
    }

    // Try to find user in database
    let user;
    try {
      user = await User.findOne({
        $or: [{ email: loginUsername }, { username: loginUsername }],
      });
    } catch (dbQueryError) {
      console.error('[Login API] Database query error:', dbQueryError.message);
      return Response.json(
        { 
          success: false, 
          error: 'Database error occurred. Please try again later.',
          details: process.env.NODE_ENV === 'development' ? dbQueryError.message : undefined
        },
        { status: 503 }
      );
    }

    if (!user) {
      return Response.json(
        { success: false, error: 'Invalid credentials. Please check your username and password.' },
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
    console.error('[Login API] Unexpected error:', error);
    
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
    const errorMessage = error.message || '';
    if (errorMessage.includes('connect') || 
        errorMessage.includes('ECONNREFUSED') || 
        errorMessage.includes('Database connection') ||
        errorMessage.includes('MONGOURI')) {
      return Response.json(
        { 
          success: false, 
          error: 'Database connection failed. Please check your MongoDB connection and ensure the server is running.',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        },
        { status: 503 }
      );
    }
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError || errorMessage.includes('JSON')) {
      return Response.json(
        { 
          success: false, 
          error: 'Invalid request format'
        },
        { status: 400 }
      );
    }
    
    return Response.json(
      { 
        success: false, 
        error: errorMessage || 'Login failed. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}

