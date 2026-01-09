/**
 * Rate limiting - Prevent brute force attacks
 */
const rateLimitMap = new Map();

export function rateLimit(maxRequests = 100, windowMs = 15 * 60 * 1000) {
  return (request) => {
    const ip = getClientIP(request);
    const now = Date.now();
    const key = `${ip}-${request.url}`;

    const record = rateLimitMap.get(key);

    if (!record) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (now > record.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  };
}

/**
 * Get client IP address
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
 * Validate API key (for server-to-server communication)
 */
export function validateAPIKey(request) {
  const apiKey = request.headers.get('x-api-key');
  const validAPIKey = process.env.API_KEY;

  if (!validAPIKey) {
    return true;
  }

  if (!apiKey || apiKey !== validAPIKey) {
    throw { status: 401, message: 'Invalid API key' };
  }

  return true;
}

/**
 * Check if request is from allowed origin
 */
export function validateOrigin(request) {
  const origin = request.headers.get('origin') || request.headers.get('referer');
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:5050', 'https://homiebites.com'];

  if (!origin) {
    return true;
  }
  const isAllowed = allowedOrigins.some(
    (allowed) => origin.startsWith(allowed) || origin.includes(allowed)
  );

  if (!isAllowed) {
    throw { status: 403, message: 'Origin not allowed' };
  }

  return true;
}

/**
 * Sanitize input to prevent injection attacks
 */
export function sanitizeInput(input) {
  if (typeof input === 'string') {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item));
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized = {};
    for (const key in input) {
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }

  return input;
}

/**
 * Validate request size to prevent DoS attacks
 */
export function validateRequestSize(request, maxSize = 10 * 1024 * 1024) {
  const contentLength = request.headers.get('content-length');

  if (contentLength && parseInt(contentLength) > maxSize) {
    throw { status: 413, message: 'Request too large' };
  }

  return true;
}

/**
 * Security headers middleware
 */
export function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}

/**
 * Comprehensive security check for API routes
 */
export async function secureAPI(request, options = {}) {
  const {
    requireAuth = false,
    requireAdmin = false,
    maxRequests = 100,
    checkOrigin = true,
    checkAPIKey = false,
  } = options;

  try {
    if (checkOrigin) {
      validateOrigin(request);
    }

    if (checkAPIKey) {
      validateAPIKey(request);
    }

    const rateLimitCheck = rateLimit(maxRequests);
    if (!rateLimitCheck(request)) {
      throw { status: 429, message: 'Too many requests. Please try again later.' };
    }

    validateRequestSize(request);
    if (requireAuth || requireAdmin) {
      const { isAdmin } = await import('./auth.js');
      if (requireAdmin) {
        await isAdmin(request);
      } else {
        const { authenticate } = await import('./auth.js');
        await authenticate(request);
      }
    }

    return true;
  } catch (error) {
    throw error;
  }
}
