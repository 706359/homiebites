import connectDB from '../../../../lib/db.js';
import Settings from '../../../../lib/models/Settings.js';
import {
  isAdmin,
  createErrorResponse,
} from '../../../../lib/middleware/auth.js';

export async function GET(request) {
  try {
    await connectDB();
    await isAdmin(request);
    const settings = await Settings.getSettings();
    
    // Ensure autoHideSidebar is explicitly included in the response
    // Convert to plain object and explicitly set the field to ensure it's included
    const settingsObj = settings.toObject ? settings.toObject() : settings;
    
    // Explicitly include autoHideSidebar if it exists, or set default
    if (settingsObj.autoHideSidebar === undefined || settingsObj.autoHideSidebar === null) {
      settingsObj.autoHideSidebar = false; // Default value
    } else {
      settingsObj.autoHideSidebar = Boolean(settingsObj.autoHideSidebar);
    }
    
    return Response.json({ success: true, data: settingsObj });
  } catch (error) {
    if (error.status) {
      return createErrorResponse(error.status, error.message);
    }
    return Response.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}
