/**
 * Next.js API Route: Health Check
 * Diagnostic endpoint to check database connectivity and configuration
 */
import connectDB from '../../../lib/db.js';

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    server: 'running',
    database: {
      connected: false,
      error: null,
      connectionString: process.env.MONGOURI ? 'configured' : 'not configured',
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'not set',
      hasMongoURI: !!process.env.MONGOURI,
      hasJWTSecret: !!process.env.JWT_SECRET,
    },
  };

  try {
    await connectDB();
    diagnostics.database.connected = true;
    diagnostics.database.error = null;
    return Response.json(
      {
        success: true,
        status: 'healthy',
        ...diagnostics,
      },
      { status: 200 }
    );
  } catch (error) {
    diagnostics.database.error = error.message;
    return Response.json(
      {
        success: false,
        status: 'unhealthy',
        ...diagnostics,
      },
      { status: 503 }
    );
  }
}

