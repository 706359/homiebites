import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper function to get admin credentials (reads from env vars lazily)
function getAdminCredentials() {
  return {
    JWT_SECRET: process.env.JWT_SECRET || 'homiebites_secret',
    ADMIN_USERNAME: 'adminHomieBites',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Bless@@!!##12',
    ADMIN_FIRSTNAME: process.env.ADMIN_FIRSTNAME || 'Admin',
    ADMIN_LASTNAME: process.env.ADMIN_LASTNAME || 'User',
    ADMIN_MOBILE: process.env.ADMIN_MOBILE || '',
  };
}

// POST /api/auth/login - Login user (admin or regular)
export async function login(req, res) {
  try {
    // Get admin credentials (reads from env vars at request time, not module load time)
    const adminCreds = getAdminCredentials();
    
    const { email, password, username } = req.body;
    
    // For admin fallback credentials - trim whitespace and handle mobile as string
    const loginUsername = String(username || email || '').trim();
    const trimmedPassword = String(password || '').trim();
    
    // Check if it's the hardcoded admin credentials
    // Allow login with either username OR mobile number
    // Normalize both to strings for comparison
    const normalizedMobile = String(adminCreds.ADMIN_MOBILE || '').trim();
    const usernameMatch = loginUsername === String(adminCreds.ADMIN_USERNAME).trim();
    const mobileMatch = !!(normalizedMobile && loginUsername === normalizedMobile);
    const isAdminIdentifier = usernameMatch || mobileMatch;
    const passwordMatch = trimmedPassword === String(adminCreds.ADMIN_PASSWORD).trim();
    
    if (isAdminIdentifier && passwordMatch) {
      // Generate JWT token for admin
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

      return res.json({
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
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // For now, we'll assume password is correct if user exists
    // In production, you should hash passwords and use bcrypt.compare
    // TODO: Implement proper password hashing and verification
    
    // Generate JWT token (reuse adminCreds from top of function)
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

    res.json({
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
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Login failed',
    });
  }
}

// POST /api/auth/register - Register new user
export async function register(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists',
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password, // TODO: Hash password before saving
      phone,
      role: 'user',
    });

    await user.save();

    // Generate JWT token
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

    res.json({
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
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Registration failed',
    });
  }
}

