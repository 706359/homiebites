import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'homiebites_secret';

/**
 * Comprehensive API route protection middleware
 * - Verifies JWT token
 * - Checks admin role
 * - Prevents unauthorized access
 */
export function requireAdminAuth(handler) {
  return async (request, context) => {
    try {
      // Enforce JWT_SECRET in production
      if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
        return Response.json(
          {
            success: false,
            error: 'Server misconfiguration: JWT_SECRET not set',
          },
          { status: 500 }
        );
      }

      // Get token from Authorization header
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return Response.json(
          { success: false, error: 'No authorization token provided' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7); // Remove "Bearer " prefix

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(
            '[Auth Middleware] Token verification failed:',
            error.message
          );
        }
        return Response.json(
          { success: false, error: 'Invalid or expired token' },
          { status: 403 }
        );
      }

      // Verify user has admin role
      const userRole = decoded?.role?.toLowerCase();
      if (
        !decoded ||
        !(
          userRole === 'admin' ||
          decoded.role === 'Admin' ||
          decoded.isAdmin === true
        )
      ) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Auth Middleware] Admin access required:', {
            userId: decoded?.userId,
            role: decoded?.role,
          });
        }
        return Response.json(
          { success: false, error: 'Admin access required' },
          { status: 403 }
        );
      }

      // Verify token has not been tampered with (additional security)
      if (!decoded.userId || !decoded.email) {
        return Response.json(
          { success: false, error: 'Invalid token structure' },
          { status: 403 }
        );
      }

      // Attach user info to request for handler use
      request.user = decoded;

      // Call the actual handler with decoded user info
      return handler(request, context);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Auth Middleware] Unexpected error:', error);
      }
      return Response.json(
        { success: false, error: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}

/**
 * Verify JWT token and return decoded payload
 */
export function verifyToken(token) {
  try {
    if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw {
      status: 403,
      message: 'Invalid or expired token',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    };
  }
}

/**
 * Check if user is admin
 */
export function isAdminUser(decoded) {
  if (!decoded) return false;

  const userRole = decoded?.role?.toLowerCase();
  return (
    userRole === 'admin' || decoded.role === 'Admin' || decoded.isAdmin === true
  );
}

/**
 * Rate limit middleware for API endpoints
 * Prevents brute force attacks
 */
export function createRateLimitMiddleware(
  maxRequests = 100,
  windowMs = 15 * 60 * 1000
) {
  const requests = new Map();

  return (request) => {
    const ip = getClientIP(request);
    const endpoint = request.url;
    const key = `${ip}-${endpoint}`;
    const now = Date.now();

    const record = requests.get(key);

    if (!record) {
      requests.set(key, { count: 1, resetTime: now + windowMs });
      return { allowed: true };
    }

    if (now > record.resetTime) {
      requests.set(key, { count: 1, resetTime: now + windowMs });
      return { allowed: true };
    }

    if (record.count >= maxRequests) {
      return {
        allowed: false,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      };
    }

    record.count++;
    return { allowed: true };
  };
}

/**
 * Get client IP address (handles proxies)
 */
function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  return 'unknown';
}

/**
 * Validate request origin (CORS)
 */
export function validateOrigin(request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://localhost:5050'];

  if (!origin) {
    return true; // Allow requests without origin (like same-origin)
  }

  return allowedOrigins.some(
    (allowed) => origin === allowed || origin.endsWith(allowed)
  );
}

/**
 * Sanitize error messages for production
 */
export function sanitizeError(error, isDev = false) {
  if (isDev) {
    return {
      error: error.message,
      details: error.details || error.stack,
    };
  }

  // Generic message for production
  return {
    error: 'An error occurred. Please try again later.',
  };
}
