import connectDB from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import jwt from 'jsonwebtoken';
import { rateLimit } from '../../../../lib/middleware/security.js';

function getAdminCredentials() {
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be set in production');
  }
  return {
    JWT_SECRET: process.env.JWT_SECRET || 'homiebites_secret',
  };
}

export async function POST(request) {
  try {
    const ok = rateLimit(10, 15 * 60 * 1000)(request);
    if (!ok) {
      return Response.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    await connectDB();
    const body = await request.json();
    const { name, email, password, phone } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    const user = new User({
      name,
      email,
      password,
      phone,
      role: 'user',
    });

    await user.save();

    const adminCreds = getAdminCredentials();
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role || 'user',
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
      },
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
