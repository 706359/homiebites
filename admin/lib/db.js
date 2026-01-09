// Database connection utility for Next.js API routes
import mongoose from 'mongoose';

const MONGOURI = process.env.MONGOURI;

if (!MONGOURI && typeof window === 'undefined') {
  // Only throw error at runtime, not during build
  if (
    process.env.NODE_ENV !== 'production' ||
    process.env.NEXT_PHASE !== 'phase-production-build'
  ) {
    console.warn(
      'MONGOURI environment variable is not defined. Database connection will fail at runtime.'
    );
  }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!MONGOURI) {
    const errorMsg =
      'MONGOURI environment variable is not defined. Please create a .env file in the admin folder with MONGOURI=your_mongodb_connection_string';
    console.error('[connectDB]', errorMsg);
    throw new Error(errorMsg);
  }

  if (cached.conn) {
    // Check if connection is still alive
    if (mongoose.connection.readyState === 1) {
      return cached.conn;
    } else {
      // Connection is dead, reset cache
      cached.conn = null;
      cached.promise = null;
    }
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      connectTimeoutMS: 10000, // 10 seconds connection timeout
    };

    cached.promise = mongoose
      .connect(MONGOURI, opts)
      .then((mongoose) => {
        console.log('[connectDB] MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('[connectDB] MongoDB connection failed:', error.message);
        cached.promise = null;
        throw new Error(
          `Database connection failed: ${error.message}. Please check your MongoDB connection string and ensure the server is accessible.`
        );
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    // Provide more detailed error information
    if (e.message.includes('ECONNREFUSED') || e.message.includes('connection refused')) {
      throw new Error(
        'Cannot connect to MongoDB server. Please check if the MongoDB server is running and the connection string is correct.'
      );
    }
    throw e;
  }

  return cached.conn;
}

export default connectDB;
