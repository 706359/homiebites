
import connectDB from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import jwt from 'jsonwebtoken';


function getAdminCredentials() {
  return {
    JWT_SECRET: process.env.JWT_SECRET || 'homiebites_secret',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || '706359@gmail.com',
    ADMIN_ID: process.env.ADMIN_ID,
    ADMIN_PAN_CARD: process.env.ADMIN_PAN_CARD,
  };
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, verificationToken, panCard, adminId } = body;

    if (!email || !email.trim()) {
      return Response.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!verificationToken || !verificationToken.trim()) {
      return Response.json(
        { success: false, error: 'Verification token is required' },
        { status: 400 }
      );
    }

    if (!panCard || !panCard.trim()) {
      return Response.json(
        { success: false, error: 'PAN card is required' },
        { status: 400 }
      );
    }

    if (!adminId || !adminId.trim()) {
      return Response.json(
        { success: false, error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPanCard = panCard.trim().toUpperCase();
    const normalizedAdminId = adminId.trim();

    
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(normalizedPanCard)) {
      return Response.json(
        { success: false, error: 'Invalid PAN card format. Format: ABCDE1234F' },
        { status: 400 }
      );
    }

    
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return Response.json(
        { success: false, error: 'Invalid email or verification token' },
        { status: 401 }
      );
    }

    
    if (!user.verificationToken || !user.verificationTokenExpiresAt) {
      return Response.json(
        { success: false, error: 'Verification token not found or expired. Please start the process again.' },
        { status: 401 }
      );
    }

    if (new Date() > user.verificationTokenExpiresAt) {
      
      user.verificationToken = null;
      user.verificationTokenExpiresAt = null;
      await user.save();
      
      return Response.json(
        { success: false, error: 'Verification token has expired. Please start the process again.' },
        { status: 401 }
      );
    }

    if (user.verificationToken !== verificationToken) {
      return Response.json(
        { success: false, error: 'Invalid verification token' },
        { status: 401 }
      );
    }

    
    const adminCreds = getAdminCredentials();
    const isAdminEmail = normalizedEmail === adminCreds.ADMIN_EMAIL.toLowerCase();

    
    if (isAdminEmail) {
      
      const expectedAdminId = adminCreds.ADMIN_ID || user.adminId;
      const expectedPanCard = adminCreds.ADMIN_PAN_CARD || user.panCard;

      if (expectedAdminId && expectedAdminId !== normalizedAdminId) {
        return Response.json(
          { success: false, error: 'Invalid Admin ID' },
          { status: 401 }
        );
      }

      if (expectedPanCard && expectedPanCard.toUpperCase() !== normalizedPanCard) {
        return Response.json(
          { success: false, error: 'Invalid PAN card' },
          { status: 401 }
        );
      }

      
      if (!user.adminId && normalizedAdminId) {
        user.adminId = normalizedAdminId;
      }
      if (!user.panCard && normalizedPanCard) {
        user.panCard = normalizedPanCard;
      }
    } else {
      
      if (user.adminId && user.adminId !== normalizedAdminId) {
        return Response.json(
          { success: false, error: 'Invalid Admin ID' },
          { status: 401 }
        );
      }

      if (user.panCard && user.panCard.toUpperCase() !== normalizedPanCard) {
        return Response.json(
          { success: false, error: 'Invalid PAN card' },
          { status: 401 }
        );
      }

      
      if (!user.adminId && normalizedAdminId) {
        user.adminId = normalizedAdminId;
      }
      if (!user.panCard && normalizedPanCard) {
        user.panCard = normalizedPanCard;
      }
    }

    
    const resetToken = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
        purpose: 'password-reset',
      },
      adminCreds.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    
    user.resetToken = resetToken;
    user.resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); 
    
    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;
    await user.save();

    return Response.json({
      success: true,
      message: 'Identity verified successfully',
      resetToken,
    });
  } catch (error) {
    console.error('[Verify Identity API] Error:', error);
    
    if (error.message && error.message.includes('connect')) {
      return Response.json(
        { 
          success: false, 
          error: 'Database connection failed. Please try again later.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 503 }
      );
    }

    return Response.json(
      { 
        success: false, 
        error: error.message || 'Failed to verify identity. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
