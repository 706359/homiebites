import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend root (two levels up)
dotenv.config({ path: join(__dirname, '../../.env') });

const connectDB = async () => {
  try {
    // Use Raavito database and prefix collections with HomieBites
    const mongoUri = process.env.MONGOURI;
    
    // Ensure we're using Raavito database
    let connectionString = mongoUri;
    
    // Replace database name to use Raavito
    if (connectionString.includes('/HomieBites')) {
      connectionString = connectionString.replace('/HomieBites', '/Raavito');
    } else if (!connectionString.includes('/Raavito')) {
      // If no database specified, add Raavito
      connectionString = connectionString.replace(/\/(\?|$)/, '/Raavito$1');
    }
    
    const conn = await mongoose.connect(connectionString);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`📁 Collections will be prefixed with: HomieBites_`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

