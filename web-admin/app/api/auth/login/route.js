import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/db.js';
import { generateCSRFToken } from '../../../../lib/middleware/csrf.js';
import { rateLimit } from '../../../../lib/middleware/security.js';
import User from '../../../../lib/models/User.js';
import { verifyPassword } from '../../../../lib/utils/password.js';

const JWT_SECRET = process.env.JWT_SECRET || 'homiebites_secret';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

export async function POST(request) {
  try {
    if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
      return Response.json(
        { success: false, error: 'Server misconfiguration.' },
        { status: 503 }
      );
    }
    const ok = rateLimit(20, 15 * 60 * 1000)(request);
    if (!ok) {
      return Response.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    try {
      await connectDB();
    } catch (dbError) {
      if (process.env.NODE_ENV === 'development')
        console.error(
          '[Login API] Database connection error:',
          dbError.message
        );
      return Response.json(
        {
          success: false,
          error:
            'Database connection failed. Please check your MongoDB connection.',
          details:
            process.env.NODE_ENV === 'development'
              ? dbError.message
              : undefined,
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { email, username, password } = body;

    const emailOrUsername = String(email || username || '').trim();
    const trimmedPassword = String(password || '').trim();

    if (process.env.NODE_ENV === 'development')
      console.log('[Login API] Login attempt:', {
        emailOrUsername: emailOrUsername ? '(provided)' : '(empty)',
        passwordLength: trimmedPassword.length,
        timestamp: new Date().toISOString(),
      });

    if (!emailOrUsername || !trimmedPassword) {
      if (process.env.NODE_ENV === 'development')
        console.error('[Login API] Missing credentials:', {
          hasInput: !!emailOrUsername,
          hasPassword: !!trimmedPassword,
        });
      return Response.json(
        { success: false, error: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    const esc = emailOrUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const usernameRegex = new RegExp('^' + esc + '$', 'i');
    const emailLower = emailOrUsername.toLowerCase();

    // Normalize phone number (remove spaces, dashes, etc.)
    const normalizedPhone = emailOrUsername.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = new RegExp(
      '^' + normalizedPhone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$',
      'i'
    );

    let user;
    try {
      user = await User.findOne({
        $or: [
          { email: emailLower },
          { username: usernameRegex },
          { phone: phoneRegex },
          { mobile: phoneRegex },
        ],
      });
      if (process.env.NODE_ENV === 'development')
        console.log('[Login API] User lookup result:', {
          found: !!user,
          input: emailOrUsername ? '(provided)' : '(empty)',
          userId: user?._id?.toString(),
          isActive: user?.isActive,
          loginAttempts: user?.loginAttempts,
          isLocked: !!(user?.lockUntil && user.lockUntil > Date.now()),
        });
    } catch (dbQueryError) {
      if (process.env.NODE_ENV === 'development')
        console.error('[Login API] Database query error:', {
          error: dbQueryError.message,
          stack: dbQueryError.stack,
          input: emailOrUsername ? '(provided)' : '(empty)',
        });
      return Response.json(
        {
          success: false,
          error: 'Database error occurred. Please try again later.',
          details:
            process.env.NODE_ENV === 'development'
              ? dbQueryError.message
              : undefined,
        },
        { status: 503 }
      );
    }

    if (!user) {
      if (process.env.NODE_ENV === 'development')
        console.error('[Login API] User not found:', {
          input: emailOrUsername ? '(provided)' : '(empty)',
        });
      const errorResponse = {
        success: false,
        error: 'Invalid email or password',
        code: 'USER_NOT_FOUND',
        timestamp: new Date().toISOString(),
      };
      if (process.env.NODE_ENV === 'development')
        console.log('[Login API] Returning error response:', errorResponse);
      return Response.json(errorResponse, { status: 401 });
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutesLeft = Math.ceil(
        (user.lockUntil.getTime() - Date.now()) / 60000
      );
      if (process.env.NODE_ENV === 'development')
        console.error('[Login API] Account locked:', {
          email: user?.email || emailOrUsername,
          userId: user._id.toString(),
          lockUntil: user.lockUntil.toISOString(),
          minutesLeft,
          loginAttempts: user.loginAttempts,
        });
      return Response.json(
        {
          success: false,
          error: `Account locked. Try again in ${minutesLeft} minutes.`,
        },
        { status: 423 }
      );
    }

    let isMatch = false;
    if (user.password) {
      try {
        isMatch = await verifyPassword(trimmedPassword, user.password);
        if (process.env.NODE_ENV === 'development')
          console.log('[Login API] Password verification:', {
            email: user?.email || emailOrUsername,
            userId: user._id.toString(),
            isMatch,
            hasPassword: !!user.password,
          });
      } catch (verifyError) {
        if (process.env.NODE_ENV === 'development')
          console.error('[Login API] Password verification error:', {
            error: verifyError.message,
            stack: verifyError.stack,
            email: user?.email || emailOrUsername,
            userId: user._id.toString(),
          });
        isMatch = false;
      }
    } else {
      if (process.env.NODE_ENV === 'development')
        console.error('[Login API] User has no password set:', {
          email: user?.email || emailOrUsername,
          userId: user._id.toString(),
        });
    }

    if (!isMatch) {
      const previousAttempts = user.loginAttempts || 0;
      user.loginAttempts = previousAttempts + 1;

      if (process.env.NODE_ENV === 'development')
        console.error('[Login API] Password mismatch:', {
          email: user?.email || emailOrUsername,
          userId: user._id.toString(),
          previousAttempts,
          currentAttempts: user.loginAttempts,
          maxAttempts: MAX_LOGIN_ATTEMPTS,
        });

      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME);
        await user.save();
        if (process.env.NODE_ENV === 'development')
          console.error(
            '[Login API] Account locked due to too many failed attempts:',
            {
              email: user?.email || emailOrUsername,
              userId: user._id.toString(),
              loginAttempts: user.loginAttempts,
              lockUntil: user.lockUntil.toISOString(),
              lockDurationMinutes: LOCK_TIME / 60000,
            }
          );
        return Response.json(
          {
            success: false,
            error: `Too many failed attempts. Account locked for 15 minutes.`,
          },
          { status: 423 }
        );
      }

      await user.save();
      const attemptsRemaining = MAX_LOGIN_ATTEMPTS - user.loginAttempts;
      if (process.env.NODE_ENV === 'development')
        console.warn('[Login API] Failed login attempt recorded:', {
          email: user?.email || emailOrUsername,
          userId: user._id.toString(),
          attemptsRemaining,
          totalAttempts: user.loginAttempts,
        });
      const errorResponse = {
        success: false,
        error: `Invalid email or password. ${attemptsRemaining} attempts remaining.`,
        code: 'PASSWORD_MISMATCH',
        attemptsRemaining,
        timestamp: new Date().toISOString(),
      };
      if (process.env.NODE_ENV === 'development')
        console.log(
          '[Login API] Returning password mismatch error:',
          errorResponse
        );
      return Response.json(errorResponse, { status: 401 });
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    let token;
    try {
      token = jwt.sign(
        {
          userId: user._id.toString(),
          email: user.email,
          role: user.role || 'user',
          isAdmin:
            user.role &&
            (user.role.toLowerCase() === 'admin' || user.role === 'Admin'),
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
    } catch (tokenError) {
      if (process.env.NODE_ENV === 'development')
        console.error('[Login API] JWT token generation error:', {
          error: tokenError.message,
          stack: tokenError.stack,
          email: user?.email || emailOrUsername,
          userId: user._id.toString(),
        });
      return Response.json(
        {
          success: false,
          error: 'Token generation failed. Please try again.',
          details:
            process.env.NODE_ENV === 'development'
              ? tokenError.message
              : undefined,
        },
        { status: 500 }
      );
    }

    // Generate CSRF token for form submissions
    const csrfToken = generateCSRFToken();

    // Create response with secure cookies
    const response = new Response(
      JSON.stringify({
        success: true,
        requirePasswordChange: user.isTemporaryPassword,
        token, // Still send token for client-side API calls
        csrfToken, // CSRF token for form submissions
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || 'user',
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Set secure HttpOnly cookie for token (cannot be accessed by JavaScript)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    response.headers.set(
      'Set-Cookie',
      `homiebites_admin_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expiresAt.toUTCString()}`
    );

    // Set admin flag cookie (non-HttpOnly for client-side checks)
    response.headers.append(
      'Set-Cookie',
      `homiebites_admin=true; Path=/; SameSite=Strict; Expires=${expiresAt.toUTCString()}`
    );

    // Set CSRF token cookie (readable by JavaScript but cannot be modified by scripts)
    response.headers.append(
      'Set-Cookie',
      `homiebites_csrf_token=${csrfToken}; Path=/; SameSite=Strict; Expires=${expiresAt.toUTCString()}`
    );

    if (process.env.NODE_ENV === 'development') {
      console.log('[Login API] Successful login with secure cookies:', {
        email: user?.email || emailOrUsername,
        userId: user._id.toString(),
        name: user.name,
        role: user.role,
        tokenSet: !!token,
        csrfTokenSet: !!csrfToken,
      });
    }

    return response;
  } catch (error) {
    if (process.env.NODE_ENV === 'development')
      console.error('[Login API] Unexpected error:', {
        error: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
        timestamp: new Date().toISOString(),
      });

    if (error.name === 'ValidationError') {
      if (process.env.NODE_ENV === 'development')
        console.error('[Login API] Validation error:', {
          errors: Object.values(error.errors || {}).map((e) => e.message),
          fields: Object.keys(error.errors || {}),
        });
      return Response.json(
        {
          success: false,
          error: 'Validation failed',
          details: Object.values(error.errors || {})
            .map((e) => e.message)
            .join(', '),
        },
        { status: 400 }
      );
    }

    const errorMessage = error.message || '';
    if (
      errorMessage.includes('connect') ||
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('Database connection') ||
      errorMessage.includes('MONGOURI')
    ) {
      if (process.env.NODE_ENV === 'development')
        console.error('[Login API] Database connection error:', {
          error: errorMessage,
          code: error.code,
          mongoUri: process.env.MONGODB_URI ? '***configured***' : 'missing',
        });
      return Response.json(
        {
          success: false,
          error:
            'Database connection failed. Please check your MongoDB connection and ensure the server is running.',
          details:
            process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        },
        { status: 503 }
      );
    }

    if (error instanceof SyntaxError || errorMessage.includes('JSON')) {
      if (process.env.NODE_ENV === 'development')
        console.error('[Login API] JSON parsing error:', {
          error: errorMessage,
          body: typeof body !== 'undefined' ? 'received' : 'missing',
        });
      return Response.json(
        {
          success: false,
          error: 'Invalid request format',
        },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV === 'development')
      console.error('[Login API] Unhandled error response:', {
        status: error.status || 500,
        message: errorMessage || 'Login failed. Please try again.',
        type: typeof error,
      });

    return Response.json(
      {
        success: false,
        error: errorMessage || 'Login failed. Please try again.',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: error.status || 500 }
    );
  }
}
