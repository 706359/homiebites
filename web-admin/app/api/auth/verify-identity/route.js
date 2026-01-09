/**
 * Next.js API Route: Verify Identity
 * Verifies Admin ID and PAN card, returns reset token
 */
import connectDB from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import jwt from 'jsonwebtoken';

// Helper function to get admin credentials
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

    // Validate PAN card format
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(normalizedPanCard)) {
      return Response.json(
        { success: false, error: 'Invalid PAN card format. Format: ABCDE1234F' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return Response.json(
        { success: false, error: 'Invalid email or verification token' },
        { status: 401 }
      );
    }

    // Verify verification token
    if (!user.verificationToken || !user.verificationTokenExpiresAt) {
      return Response.json(
        { success: false, error: 'Verification token not found or expired. Please start the process again.' },
        { status: 401 }
      );
    }

    if (new Date() > user.verificationTokenExpiresAt) {
      // Clear expired token
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

    // Verify identity (Admin ID and PAN card)
    const adminCreds = getAdminCredentials();
    const isAdminEmail = normalizedEmail === adminCreds.ADMIN_EMAIL.toLowerCase();

    // For admin, check against environment variables or stored values
    if (isAdminEmail) {
      // Check if adminId and panCard match environment variables or stored values
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

      // Store adminId and panCard if not already stored
      if (!user.adminId && normalizedAdminId) {
        user.adminId = normalizedAdminId;
      }
      if (!user.panCard && normalizedPanCard) {
        user.panCard = normalizedPanCard;
      }
    } else {
      // For regular users, check against stored values
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

      // If not stored, store them now (first time setup)
      if (!user.adminId && normalizedAdminId) {
        user.adminId = normalizedAdminId;
      }
      if (!user.panCard && normalizedPanCard) {
        user.panCard = normalizedPanCard;
      }
    }

    // Identity verified, generate reset token
    const resetToken = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
        purpose: 'password-reset',
      },
      adminCreds.JWT_SECRET,
      { expiresIn: '1h' } // 1 hour
    );

    // Store reset token
    user.resetToken = resetToken;
    user.resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    // Clear verification token after successful verification
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
