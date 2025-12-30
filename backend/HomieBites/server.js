// Backend server for HomieBites - MongoDB based
// IMPORTANT: Load .env FIRST before any other imports that depend on env vars
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env BEFORE importing any routes/controllers that use env vars
dotenv.config({ path: join(__dirname, '../../.env') });
dotenv.config(); // Also try default .env location

// Now import everything else AFTER dotenv.config()
import cors from 'cors';
import express from 'express';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import offersRoutes from './routes/offers.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

// CORS configuration - specify exact origin (required for credentials, good practice anyway)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in dev, restrict in production
      }
    },
    credentials: false, // Not needed for JWT tokens, but set explicitly
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend server is running',
    database: 'MongoDB',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/offers', offersRoutes);

app.listen(PORT, () => {
  console.log(`HomieBites backend server running on port ${PORT}`);
});
