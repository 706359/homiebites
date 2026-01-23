import connectDB from '../../../lib/db.js';
import { createErrorResponse, isAdmin } from '../../../lib/middleware/auth.js';
import Settings from '../../../lib/models/Settings.js';

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
        secondaryColor: settings.secondaryColor || '#c45c2d',
        theme: settings.theme || 'light',
        autoHideSidebar: settings.autoHideSidebar !== undefined && settings.autoHideSidebar !== null
          ? Boolean(settings.autoHideSidebar)
          : false, // Default to false only if property doesn't exist or is null
        businessName: settings.businessName || 'HomieBites',
        contact: settings.contact || '',
        email: settings.email || '',
        address: settings.address || '',
        defaultUnitPrice: settings.defaultUnitPrice || 0,
        lunchPrice: settings.lunchPrice,
        dinnerPrice: settings.dinnerPrice,
        minimumOrderQty: settings.minimumOrderQty || 1,
        orderIdPrefix: settings.orderIdPrefix || 'HB-',
        autoGenerateOrderId: settings.autoGenerateOrderId !== false,
        allowDuplicateAddress: settings.allowDuplicateAddress !== false,
        requirePaymentConfirmation:
          settings.requirePaymentConfirmation || false,
        statusOptions: settings.statusOptions || [
          'Paid',
          'Pending',
          'Cancelled',
        ],
        emailDailySummary: settings.emailDailySummary !== false,
        emailNewOrderAlert: settings.emailNewOrderAlert !== false,
        emailPaymentReceived: settings.emailPaymentReceived !== false,
        emailLowOrderDayWarning: settings.emailLowOrderDayWarning || false,
        smsPaymentReminders: settings.smsPaymentReminders !== false,
        smsOrderConfirmations: settings.smsOrderConfirmations || false,
        autoBackup: settings.autoBackup !== false,
        autoBackupTime: settings.autoBackupTime || '02:00',
        userName: settings.userName,
        userEmail: settings.userEmail,
        userPhone: settings.userPhone,
        kitchenEnabled: 'kitchenEnabled' in settings 
          ? Boolean(settings.kitchenEnabled)
          : true, // Default to true only if property doesn't exist
        kitchenClosedFrom: settings.kitchenClosedFrom || '',
        kitchenClosedTo: settings.kitchenClosedTo || '',
      },
    });
  } catch (error) {
    if (error.message && error.message.includes('Settings not found')) {
      return Response.json({
        success: true,
        data: {
          fontFamily: 'Baloo 2',
          fontSize: 'medium',
          primaryColor: '#449031',
          secondaryColor: '#c45c2d',
          theme: 'light',
          autoHideSidebar: false,
          businessName: 'HomieBites',
          defaultUnitPrice: 0,
          minimumOrderQty: 1,
          orderIdPrefix: 'HB-',
          autoGenerateOrderId: true,
          allowDuplicateAddress: true,
          requirePaymentConfirmation: false,
          statusOptions: ['Paid', 'Pending', 'Cancelled'],
          emailDailySummary: true,
          emailNewOrderAlert: true,
          emailPaymentReceived: true,
          emailLowOrderDayWarning: false,
          smsPaymentReminders: true,
          smsOrderConfirmations: false,
          autoBackup: true,
          autoBackupTime: '02:00',
        },
      });
    }
    return Response.json(
      {
        success: false,
        error: error.message || 'Failed to fetch settings',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    await isAdmin(request);
    const updates = await request.json();
    const settings = await Settings.getSettings();

    /* Restore from backup: flat object, merge all keys into the settings doc */
    if (updates && updates._restore === true) {
      const { _restore, _id, __v, createdAt, updatedAt, ...flat } = updates;
      for (const k of Object.keys(flat)) {
        if (flat[k] !== undefined) settings[k] = flat[k];
      }
      await settings.save();
      return Response.json({ success: true, data: settings });
    }

    if (updates.businessInfo) {
      if (updates.businessInfo.businessName !== undefined)
        settings.businessName = updates.businessInfo.businessName;
      if (updates.businessInfo.contact !== undefined)
        settings.contact = updates.businessInfo.contact;
      if (updates.businessInfo.email !== undefined)
        settings.email = updates.businessInfo.email;
      if (updates.businessInfo.address !== undefined)
        settings.address = updates.businessInfo.address;
    }

    if (updates.pricing) {
      if (updates.pricing.defaultUnitPrice !== undefined)
        settings.defaultUnitPrice = updates.pricing.defaultUnitPrice;
      if (updates.pricing.lunchPrice !== undefined)
        settings.lunchPrice = updates.pricing.lunchPrice;
      if (updates.pricing.dinnerPrice !== undefined)
        settings.dinnerPrice = updates.pricing.dinnerPrice;
      if (updates.pricing.minimumOrderQty !== undefined)
        settings.minimumOrderQty = updates.pricing.minimumOrderQty;
    }

    if (updates.orderSettings) {
      if (updates.orderSettings.orderIdPrefix !== undefined)
        settings.orderIdPrefix = updates.orderSettings.orderIdPrefix;
      if (updates.orderSettings.autoGenerateOrderId !== undefined)
        settings.autoGenerateOrderId =
          updates.orderSettings.autoGenerateOrderId;
      if (updates.orderSettings.allowDuplicateAddress !== undefined)
        settings.allowDuplicateAddress =
          updates.orderSettings.allowDuplicateAddress;
      if (updates.orderSettings.requirePaymentConfirmation !== undefined)
        settings.requirePaymentConfirmation =
          updates.orderSettings.requirePaymentConfirmation;
      if (updates.orderSettings.statusOptions !== undefined)
        settings.statusOptions = updates.orderSettings.statusOptions;
    }

    if (updates.notificationPrefs) {
      if (updates.notificationPrefs.emailDailySummary !== undefined)
        settings.emailDailySummary =
          updates.notificationPrefs.emailDailySummary;
      if (updates.notificationPrefs.emailNewOrderAlert !== undefined)
        settings.emailNewOrderAlert =
          updates.notificationPrefs.emailNewOrderAlert;
      if (updates.notificationPrefs.emailPaymentReceived !== undefined)
        settings.emailPaymentReceived =
          updates.notificationPrefs.emailPaymentReceived;
      if (updates.notificationPrefs.emailLowOrderDayWarning !== undefined)
        settings.emailLowOrderDayWarning =
          updates.notificationPrefs.emailLowOrderDayWarning;
      if (updates.notificationPrefs.smsPaymentReminders !== undefined)
        settings.smsPaymentReminders =
          updates.notificationPrefs.smsPaymentReminders;
      if (updates.notificationPrefs.smsOrderConfirmations !== undefined)
        settings.smsOrderConfirmations =
          updates.notificationPrefs.smsOrderConfirmations;
    }

    if (updates.dataSettings) {
      if (updates.dataSettings.autoBackup !== undefined)
        settings.autoBackup = updates.dataSettings.autoBackup;
      if (updates.dataSettings.autoBackupTime !== undefined)
        settings.autoBackupTime = updates.dataSettings.autoBackupTime;
    }

    if (updates.userProfile) {
      if (updates.userProfile.name !== undefined)
        settings.userName = updates.userProfile.name;
      if (updates.userProfile.email !== undefined)
        settings.userEmail = updates.userProfile.email;
      if (updates.userProfile.phone !== undefined)
        settings.userPhone = updates.userProfile.phone;
    }

    if (updates.themeSettings) {
      if (updates.themeSettings.fontFamily !== undefined)
        settings.fontFamily = updates.themeSettings.fontFamily;
      if (updates.themeSettings.fontSize !== undefined) {
        // Convert fontSize to string to match schema (String type)
        // This ensures numbers are properly stored and retrieved
        settings.fontSize = String(updates.themeSettings.fontSize);
      }
      if (updates.themeSettings.primaryColor !== undefined)
        settings.primaryColor = updates.themeSettings.primaryColor;
      if (updates.themeSettings.secondaryColor !== undefined)
        settings.secondaryColor = updates.themeSettings.secondaryColor;
      if (updates.themeSettings.theme !== undefined)
        settings.theme = updates.themeSettings.theme;
      if (updates.themeSettings.autoHideSidebar !== undefined) {
        // Explicitly set autoHideSidebar (even if false, to distinguish from undefined)
        // Convert to boolean and explicitly set to ensure it's saved to database
        settings.autoHideSidebar = Boolean(updates.themeSettings.autoHideSidebar);
        // Explicitly mark as modified to ensure Mongoose saves it even if it matches default
        settings.markModified('autoHideSidebar');
      }
    }

    if (updates.kitchenSettings) {
      // Explicitly set kitchenEnabled (even if false, to distinguish from undefined)
      // This ensures false is saved to database, not just undefined
      if (updates.kitchenSettings.kitchenEnabled !== undefined) {
        settings.kitchenEnabled = Boolean(updates.kitchenSettings.kitchenEnabled);
      }
      if (updates.kitchenSettings.kitchenClosedFrom !== undefined) {
        settings.kitchenClosedFrom = updates.kitchenSettings.kitchenClosedFrom || null;
      }
      if (updates.kitchenSettings.kitchenClosedTo !== undefined) {
        settings.kitchenClosedTo = updates.kitchenSettings.kitchenClosedTo || null;
      }
    }

    await settings.save();

    return Response.json({ success: true, data: settings });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return Response.json(
        {
          success: false,
          error: 'Validation failed',
          details: Object.values(error.errors || {})
            .map((e) => e.message)
            .join(', '),
        },
        { status: 400 }
      );
    }

    if (error.status === 401 || error.status === 403) {
      return createErrorResponse(
        error.status,
        error.message || 'Authentication failed'
      );
    }
    return Response.json(
      {
        success: false,
        error: error.message || 'Failed to update settings',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: error.status || 500 }
    );
  }
}
