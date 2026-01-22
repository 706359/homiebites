import bcrypt from 'bcryptjs';

export async function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

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

export function isBcryptHash(str) {
  if (!str || typeof str !== 'string') {
    return false;
  }

  if (str.length !== 60) {
    return false;
  }

  return (
    str.startsWith('$2a$') || str.startsWith('$2b$') || str.startsWith('$2y$')
  );
}
