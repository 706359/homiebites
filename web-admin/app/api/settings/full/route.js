
import connectDB from '../../../../lib/db.js';
import Settings from '../../../../lib/models/Settings.js';
import { isAdmin, createErrorResponse } from '../../../../lib/middleware/auth.js';


export async function GET(request) {
  try {
    await connectDB();
    await isAdmin(request);
    const settings = await Settings.getSettings();
    return Response.json({ success: true, data: settings });
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

