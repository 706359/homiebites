
import connectDB from '../../../lib/db.js';

export async function GET() {
  const isProd = process.env.NODE_ENV === 'production';

  try {
    await connectDB();
    if (isProd) {
      return Response.json({ success: true, status: 'healthy' }, { status: 200 });
    }
    return Response.json(
      {
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: { connected: true },
      },
      { status: 200 }
    );
  } catch (error) {
    if (isProd) {
      return Response.json({ success: false, status: 'unhealthy' }, { status: 503 });
    }
    return Response.json(
      {
        success: false,
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: { connected: false, error: error.message },
      },
      { status: 503 }
    );
  }
}

