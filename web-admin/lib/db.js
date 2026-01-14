
import mongoose from 'mongoose';

const MONGOURI = process.env.MONGOURI;

if (!MONGOURI && typeof window === 'undefined') {
  
  if (
    process.env.NODE_ENV !== 'production' ||
    process.env.NEXT_PHASE !== 'phase-production-build'
  ) {
    console.warn(
      'MONGOURI environment variable is not defined. Database connection will fail at runtime.'
    );
  }
}


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
    
    if (mongoose.connection.readyState === 1) {
      return cached.conn;
    } else {
      
      cached.conn = null;
      cached.promise = null;
    }
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, 
      socketTimeoutMS: 45000, 
      connectTimeoutMS: 10000, 
    };

    cached.promise = mongoose
      .connect(MONGOURI, opts)
      .then((mongoose) => {
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
