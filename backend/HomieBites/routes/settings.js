import express from "express";
import { authenticate, isAdmin } from "../middleware/auth.js";
import Settings from "../models/Settings.js";

const router = express.Router();

// GET /api/settings - public (for website to fetch font settings)
router.get("/", async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    // Return only public settings (font-related) for website
    return res.json({
      success: true,
      data: {
        fontFamily: settings.fontFamily || "Baloo 2",
        fontSize: settings.fontSize || "medium",
        primaryColor: settings.primaryColor || "#449031",
        theme: settings.theme || "light",
        businessName: settings.businessName || "HomieBites",
      },
    });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch settings" });
  }
});

// GET /api/settings/full - admin only (returns all settings)
router.get("/full", authenticate, isAdmin, async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    return res.json({ success: true, data: settings });
  } catch (error) {
    console.error("GET /api/settings/full error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch settings" });
  }
});

// PUT /api/settings - admin only (update settings)
router.put("/", authenticate, isAdmin, async (req, res) => {
  try {
    const updates = req.body;
    const settings = await Settings.getSettings();

    // Update fields that are provided
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
        settings.autoGenerateOrderId = updates.orderSettings.autoGenerateOrderId;
      if (updates.orderSettings.allowDuplicateAddress !== undefined)
        settings.allowDuplicateAddress = updates.orderSettings.allowDuplicateAddress;
      if (updates.orderSettings.requirePaymentConfirmation !== undefined)
        settings.requirePaymentConfirmation =
          updates.orderSettings.requirePaymentConfirmation;
      if (updates.orderSettings.statusOptions !== undefined)
        settings.statusOptions = updates.orderSettings.statusOptions;
    }

    if (updates.notificationPrefs) {
      if (updates.notificationPrefs.emailDailySummary !== undefined)
        settings.emailDailySummary = updates.notificationPrefs.emailDailySummary;
      if (updates.notificationPrefs.emailNewOrderAlert !== undefined)
        settings.emailNewOrderAlert = updates.notificationPrefs.emailNewOrderAlert;
      if (updates.notificationPrefs.emailPaymentReceived !== undefined)
        settings.emailPaymentReceived =
          updates.notificationPrefs.emailPaymentReceived;
      if (updates.notificationPrefs.emailLowOrderDayWarning !== undefined)
        settings.emailLowOrderDayWarning =
          updates.notificationPrefs.emailLowOrderDayWarning;
      if (updates.notificationPrefs.smsPaymentReminders !== undefined)
        settings.smsPaymentReminders = updates.notificationPrefs.smsPaymentReminders;
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
      // Password update would be handled separately via auth routes
    }

    // Theme settings - these apply to the website
    if (updates.themeSettings) {
      if (updates.themeSettings.fontFamily !== undefined)
        settings.fontFamily = updates.themeSettings.fontFamily;
      if (updates.themeSettings.fontSize !== undefined)
        settings.fontSize = updates.themeSettings.fontSize;
      if (updates.themeSettings.primaryColor !== undefined)
        settings.primaryColor = updates.themeSettings.primaryColor;
      if (updates.themeSettings.theme !== undefined)
        settings.theme = updates.themeSettings.theme;
    }

    await settings.save();

    return res.json({ success: true, data: settings });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    const errorMessage = error.message || "Failed to update settings";
    return res
      .status(500)
      .json({ success: false, error: errorMessage });
  }
});

export default router;

