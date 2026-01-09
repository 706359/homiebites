/**
 * Next.js API Route: Offers
 * Migrated from Express backend
 */
import connectDB from '../../../lib/db.js';
import { createErrorResponse, isAdmin } from '../../../lib/middleware/auth.js';
import Offer from '../../../lib/models/Offers.js';

// Format date to DD-MMM-YYYY
const fmt = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date.getTime())) return String(d);
  const dd = String(date.getDate()).padStart(2, '0');
  const mNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const m = mNames[date.getMonth()];
  const yyyy = date.getFullYear();
  return `${dd}-${m}-${yyyy}`;
};

// GET /api/offers - public
export async function GET() {
  try {
    await connectDB();
    const now = new Date();
    const offers = await Offer.find({ isActive: true }).lean();
    const active = offers.filter((o) => !o.endDate || new Date(o.endDate) >= now);
    const formatted = active.map((o) => ({
      ...o,
      startDate: fmt(o.startDate),
      endDate: fmt(o.endDate),
    }));

    return Response.json({ success: true, data: formatted });
  } catch (error) {
    console.error('[GET /api/offers] Error:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

// PUT /api/offers - admin only
export async function PUT(request) {
  try {
    await connectDB();
    await isAdmin(request);
    const payload = await request.json();

    const data = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.offers)
        ? payload.offers
        : null;

    if (!Array.isArray(data)) {
      return Response.json({ success: false, error: 'Offers must be an array' }, { status: 400 });
    }

    await Offer.deleteMany({});
    const created = await Offer.insertMany(data || []);

    return Response.json({ success: true, data: created });
  } catch (error) {
    if (error.status) {
      return createErrorResponse(error.status, error.message);
    }
    return Response.json({ success: false, error: 'Failed to update offers' }, { status: 500 });
  }
}
