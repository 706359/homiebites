/**
 * Next.js API Route: Settings
 * Migrated from Express backend
 */
import connectDB from '../../../lib/db.js';
import Settings from '../../../lib/models/Settings.js';
import { isAdmin, createErrorResponse } from '../../../lib/middleware/auth.js';

// GET /api/settings - public
export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.getSettings();
    return Response.json({
      success: true,
      data: {
        fontFamily: settings.fontFamily || 'Baloo 2',
        fontSize: settings.fontSize || 'medium',
        primaryColor: settings.primaryColor || '#449031',
        theme: settings.theme || 'light',
        businessName: settings.businessName || 'HomieBites',
      },
    });
  } catch (error) {
    // Settings might not exist yet - return default values
    if (error.message && error.message.includes('Settings not found')) {
      return Response.json({
        success: true,
        data: {
          fontFamily: 'Baloo 2',
          fontSize: 'medium',
          primaryColor: '#449031',
          theme: 'light',
          businessName: 'HomieBites',
        },
      });
    }
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch settings',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}

// PUT /api/settings - admin only
export async function PUT(request) {
  try {
    await connectDB();
    await isAdmin(request);
    const updates = await request.json();
    const settings = await Settings.getSettings();

    if (updates.businessInfo) {
      if (updates.businessInfo.businessName !== undefined) settings.businessName = updates.businessInfo.businessName;
      if (updates.businessInfo.contact !== undefined) settings.contact = updates.businessInfo.contact;
      if (updates.businessInfo.email !== undefined) settings.email = updates.businessInfo.email;
      if (updates.businessInfo.address !== undefined) settings.address = updates.businessInfo.address;
    }

    if (updates.pricing) {
      if (updates.pricing.defaultUnitPrice !== undefined) settings.defaultUnitPrice = updates.pricing.defaultUnitPrice;
      if (updates.pricing.lunchPrice !== undefined) settings.lunchPrice = updates.pricing.lunchPrice;
      if (updates.pricing.dinnerPrice !== undefined) settings.dinnerPrice = updates.pricing.dinnerPrice;
      if (updates.pricing.minimumOrderQty !== undefined) settings.minimumOrderQty = updates.pricing.minimumOrderQty;
    }

    if (updates.orderSettings) {
      if (updates.orderSettings.orderIdPrefix !== undefined) settings.orderIdPrefix = updates.orderSettings.orderIdPrefix;
      if (updates.orderSettings.autoGenerateOrderId !== undefined) settings.autoGenerateOrderId = updates.orderSettings.autoGenerateOrderId;
      if (updates.orderSettings.allowDuplicateAddress !== undefined) settings.allowDuplicateAddress = updates.orderSettings.allowDuplicateAddress;
      if (updates.orderSettings.requirePaymentConfirmation !== undefined) settings.requirePaymentConfirmation = updates.orderSettings.requirePaymentConfirmation;
      if (updates.orderSettings.statusOptions !== undefined) settings.statusOptions = updates.orderSettings.statusOptions;
    }

    if (updates.notificationPrefs) {
      if (updates.notificationPrefs.emailDailySummary !== undefined) settings.emailDailySummary = updates.notificationPrefs.emailDailySummary;
      if (updates.notificationPrefs.emailNewOrderAlert !== undefined) settings.emailNewOrderAlert = updates.notificationPrefs.emailNewOrderAlert;
      if (updates.notificationPrefs.emailPaymentReceived !== undefined) settings.emailPaymentReceived = updates.notificationPrefs.emailPaymentReceived;
      if (updates.notificationPrefs.emailLowOrderDayWarning !== undefined) settings.emailLowOrderDayWarning = updates.notificationPrefs.emailLowOrderDayWarning;
      if (updates.notificationPrefs.smsPaymentReminders !== undefined) settings.smsPaymentReminders = updates.notificationPrefs.smsPaymentReminders;
      if (updates.notificationPrefs.smsOrderConfirmations !== undefined) settings.smsOrderConfirmations = updates.notificationPrefs.smsOrderConfirmations;
    }

    if (updates.dataSettings) {
      if (updates.dataSettings.autoBackup !== undefined) settings.autoBackup = updates.dataSettings.autoBackup;
      if (updates.dataSettings.autoBackupTime !== undefined) settings.autoBackupTime = updates.dataSettings.autoBackupTime;
    }

    if (updates.userProfile) {
      if (updates.userProfile.name !== undefined) settings.userName = updates.userProfile.name;
      if (updates.userProfile.email !== undefined) settings.userEmail = updates.userProfile.email;
      if (updates.userProfile.phone !== undefined) settings.userPhone = updates.userProfile.phone;
    }

    if (updates.themeSettings) {
      if (updates.themeSettings.fontFamily !== undefined) settings.fontFamily = updates.themeSettings.fontFamily;
      if (updates.themeSettings.fontSize !== undefined) settings.fontSize = updates.themeSettings.fontSize;
      if (updates.themeSettings.primaryColor !== undefined) settings.primaryColor = updates.themeSettings.primaryColor;
      if (updates.themeSettings.theme !== undefined) settings.theme = updates.themeSettings.theme;
    }

    await settings.save();

    return Response.json({ success: true, data: settings });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return Response.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: Object.values(error.errors || {}).map(e => e.message).join(', ')
        },
        { status: 400 }
      );
    }
    // Handle authentication/authorization errors
    if (error.status === 401 || error.status === 403) {
      return createErrorResponse(error.status, error.message || 'Authentication failed');
    }
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Failed to update settings',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}

