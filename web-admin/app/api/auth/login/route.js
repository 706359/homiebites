/**
 * Next.js API Route: Auth Login
 * Complete password management system - following ADMIN_PASSWORD.md
 */
import connectDB from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import jwt from 'jsonwebtoken';
import { verifyPassword } from '../../../../lib/utils/password.js';

const JWT_SECRET = process.env.JWT_SECRET || 'homiebites_secret';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

export async function POST(request) {
  try {
    // Connect to database first
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
    
    const body = await request.json();
    const { email, password } = body;

    // Following ADMIN_PASSWORD.md - use email for login
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const trimmedPassword = String(password || '').trim();

    console.log('[Login API] Login attempt:', { 
      email: normalizedEmail, 
      passwordLength: trimmedPassword.length,
      timestamp: new Date().toISOString()
    });

    if (!normalizedEmail || !trimmedPassword) {
      console.error('[Login API] Missing credentials:', { 
        hasEmail: !!normalizedEmail, 
        hasPassword: !!trimmedPassword 
      });
      return Response.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email (following ADMIN_PASSWORD.md)
    let user;
    try {
      user = await User.findOne({ email: normalizedEmail });
      console.log('[Login API] User lookup result:', { 
        found: !!user, 
        email: normalizedEmail,
        userId: user?._id?.toString(),
        isActive: user?.isActive,
        loginAttempts: user?.loginAttempts,
        isLocked: !!(user?.lockUntil && user.lockUntil > Date.now())
      });
    } catch (dbQueryError) {
      console.error('[Login API] Database query error:', {
        error: dbQueryError.message,
        stack: dbQueryError.stack,
        email: normalizedEmail
      });
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
      console.error('[Login API] User not found:', { email: normalizedEmail });
      const errorResponse = { 
        success: false, 
        error: 'Invalid email or password',
        code: 'USER_NOT_FOUND',
        timestamp: new Date().toISOString()
      };
      console.log('[Login API] Returning error response:', errorResponse);
      return Response.json(errorResponse, { status: 401 });
    }

    // Check if account is locked (following ADMIN_PASSWORD.md)
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      console.error('[Login API] Account locked:', {
        email: normalizedEmail,
        userId: user._id.toString(),
        lockUntil: user.lockUntil.toISOString(),
        minutesLeft,
        loginAttempts: user.loginAttempts
      });
      return Response.json(
        {
          success: false,
          error: `Account locked. Try again in ${minutesLeft} minutes.`
        },
        { status: 423 }
      );
    }

    // Verify password
    let isMatch = false;
    if (user.password) {
      try {
        isMatch = await verifyPassword(trimmedPassword, user.password);
        console.log('[Login API] Password verification:', {
          email: normalizedEmail,
          userId: user._id.toString(),
          isMatch,
          hasPassword: !!user.password
        });
      } catch (verifyError) {
        console.error('[Login API] Password verification error:', {
          error: verifyError.message,
          stack: verifyError.stack,
          email: normalizedEmail,
          userId: user._id.toString()
        });
        isMatch = false;
      }
    } else {
      console.error('[Login API] User has no password set:', {
        email: normalizedEmail,
        userId: user._id.toString()
      });
    }

    if (!isMatch) {
      // Increment failed login attempts
      const previousAttempts = user.loginAttempts || 0;
      user.loginAttempts = previousAttempts + 1;

      console.error('[Login API] Password mismatch:', {
        email: normalizedEmail,
        userId: user._id.toString(),
        previousAttempts,
        currentAttempts: user.loginAttempts,
        maxAttempts: MAX_LOGIN_ATTEMPTS
      });

      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME);
        await user.save();
        console.error('[Login API] Account locked due to too many failed attempts:', {
          email: normalizedEmail,
          userId: user._id.toString(),
          loginAttempts: user.loginAttempts,
          lockUntil: user.lockUntil.toISOString(),
          lockDurationMinutes: LOCK_TIME / 60000
        });
        return Response.json(
          {
            success: false,
            error: `Too many failed attempts. Account locked for 15 minutes.`
          },
          { status: 423 }
        );
      }

      await user.save();
      const attemptsRemaining = MAX_LOGIN_ATTEMPTS - user.loginAttempts;
      console.warn('[Login API] Failed login attempt recorded:', {
        email: normalizedEmail,
        userId: user._id.toString(),
        attemptsRemaining,
        totalAttempts: user.loginAttempts
      });
      const errorResponse = {
        success: false,
        error: `Invalid email or password. ${attemptsRemaining} attempts remaining.`,
        code: 'PASSWORD_MISMATCH',
        attemptsRemaining,
        timestamp: new Date().toISOString()
      };
      console.log('[Login API] Returning password mismatch error:', errorResponse);
      return Response.json(errorResponse, { status: 401 });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Generate JWT token
    let token;
    try {
      token = jwt.sign(
        { userId: user._id.toString(), email: user.email, role: user.role || 'user' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
    } catch (tokenError) {
      console.error('[Login API] JWT token generation error:', {
        error: tokenError.message,
        stack: tokenError.stack,
        email: normalizedEmail,
        userId: user._id.toString()
      });
      return Response.json(
        { 
          success: false, 
          error: 'Token generation failed. Please try again.',
          details: process.env.NODE_ENV === 'development' ? tokenError.message : undefined
        },
        { status: 500 }
      );
    }

    // Check if temporary password
    if (user.isTemporaryPassword) {
      console.log('[Login API] Successful login with temporary password:', {
        email: normalizedEmail,
        userId: user._id.toString(),
        name: user.name,
        role: user.role
      });
      const successResponse = {
        success: true,
        requirePasswordChange: true,
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || 'user',
        }
      };
      console.log('[Login API] Returning success response (temp password):', {
        ...successResponse,
        token: '***REDACTED***'
      });
      return Response.json(successResponse);
    }

    console.log('[Login API] Successful login:', {
      email: normalizedEmail,
      userId: user._id.toString(),
      name: user.name,
      role: user.role,
      isTemporaryPassword: false
    });

    const successResponse = {
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || 'user',
      }
    };
    console.log('[Login API] Returning success response:', {
      ...successResponse,
      token: '***REDACTED***'
    });

    return Response.json(successResponse);

  } catch (error) {
    console.error('[Login API] Unexpected error:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      timestamp: new Date().toISOString()
    });
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      console.error('[Login API] Validation error:', {
        errors: Object.values(error.errors || {}).map(e => e.message),
        fields: Object.keys(error.errors || {})
      });
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
      console.error('[Login API] Database connection error:', {
        error: errorMessage,
        code: error.code,
        mongoUri: process.env.MONGODB_URI ? '***configured***' : 'missing'
      });
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
      console.error('[Login API] JSON parsing error:', {
        error: errorMessage,
        body: typeof body !== 'undefined' ? 'received' : 'missing'
      });
      return Response.json(
        { 
          success: false, 
          error: 'Invalid request format'
        },
        { status: 400 }
      );
    }
    
    console.error('[Login API] Unhandled error response:', {
      status: error.status || 500,
      message: errorMessage || 'Login failed. Please try again.',
      type: typeof error
    });
    
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
