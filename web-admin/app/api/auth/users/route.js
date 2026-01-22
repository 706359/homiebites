import connectDB from '../../../../lib/db.js';
import {
  createErrorResponse,
  isAdmin,
} from '../../../../lib/middleware/auth.js';
import User from '../../../../lib/models/User.js';

export async function GET(request) {
  try {
    await connectDB();
    await isAdmin(request);

    const users = await User.find({}).select('-password').lean();

    return Response.json({ success: true, data: users });
  } catch (error) {
    console.error('[GET /api/auth/users] Error:', error);
    if (error.status) {
      return createErrorResponse(error.status, error.message);
    }
    return Response.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
