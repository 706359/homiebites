/**
 * Secure password hashing and verification utilities
 * Uses bcryptjs for secure password hashing
 */
import bcrypt from 'bcryptjs';

/**
 * Hash a password securely
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export async function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  // Use 12 rounds for good security (higher = more secure but slower)
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password to verify
 * @param {string} hash - Hashed password to compare against
 * @returns {Promise<boolean>} - True if password matches
 */
export async function verifyPassword(password, hash) {
  if (!password || !hash) {
    return false;
  }

  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('[Password Verification] Error:', error.message);
    return false;
  }
}

/**
 * Check if a string is a bcrypt hash
 * @param {string} str - String to check
 * @returns {boolean} - True if string looks like a bcrypt hash
 */
export function isBcryptHash(str) {
  if (!str || typeof str !== 'string') {
    return false;
  }
  // Bcrypt hashes are exactly 60 characters
  // Format: $2[ayb]$[cost]$[salt+hash] where cost is 2 digits
  // Example: $2b$12$q/yVUxFX5zgOQJhKGN9aMOahBEBXVneyZmGfBaghixCzUDR2CO.vC
  if (str.length !== 60) {
    return false;
  }
  // Check format: starts with $2a$, $2b$, or $2y$
  // Simple check - bcrypt.compare() will validate the actual format
  return str.startsWith('$2a$') || str.startsWith('$2b$') || str.startsWith('$2y$');
}
