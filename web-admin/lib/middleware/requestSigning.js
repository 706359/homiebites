import crypto from 'crypto';

const REQUEST_SIGNING_SECRET =
  process.env.REQUEST_SIGNING_SECRET || 'dev-request-signing-secret';

/**
 * Generate request signature for sensitive operations
 * Prevents request tampering and replay attacks
 */
export function generateRequestSignature(body = {}, timestamp = null) {
  const ts = timestamp || Date.now();
  const bodyString = typeof body === 'string' ? body : JSON.stringify(body);

  const payload = `${bodyString}${ts}`;
  const signature = crypto
    .createHmac('sha256', REQUEST_SIGNING_SECRET)
    .update(payload)
    .digest('hex');

  return {
    signature,
    timestamp: ts,
  };
}

/**
 * Verify request signature
 * Should be called before processing sensitive operations
 */
export function verifyRequestSignature(signature, body = {}, timestamp) {
  if (!signature || !timestamp) {
    return false;
  }

  // Check if request is too old (5 minutes max)
  const now = Date.now();
  const age = now - timestamp;
  if (age > 5 * 60 * 1000) {
    return false; // Request expired
  }

  // Verify signature matches
  const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
  const payload = `${bodyString}${timestamp}`;
  const expectedSignature = crypto
    .createHmac('sha256', REQUEST_SIGNING_SECRET)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Middleware to verify request signature for sensitive operations
 */
export async function verifyRequestIntegrity(request) {
  try {
    const signature = request.headers.get('x-request-signature');
    const timestamp = request.headers.get('x-request-timestamp');

    if (!signature || !timestamp) {
      return {
        valid: false,
        error: 'Missing request signature headers',
      };
    }

    const ts = parseInt(timestamp, 10);
    if (isNaN(ts)) {
      return {
        valid: false,
        error: 'Invalid timestamp format',
      };
    }

    // Get request body
    let body = '';
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const clonedRequest = request.clone();
      body = await clonedRequest.text();
    }

    // Verify signature
    const valid = verifyRequestSignature(signature, body, ts);

    return {
      valid,
      error: valid ? null : 'Invalid request signature',
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Request Integrity] Verification error:', error);
    }
    return {
      valid: false,
      error: 'Signature verification failed',
    };
  }
}

/**
 * Get signing headers for client-side requests
 * Client must include these headers when making sensitive API calls
 */
export function getRequestSigningHeaders(body = {}) {
  const { signature, timestamp } = generateRequestSignature(body);

  return {
    'X-Request-Signature': signature,
    'X-Request-Timestamp': timestamp.toString(),
  };
}
