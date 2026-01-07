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
import { existsSync } from 'fs';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import offersRoutes from './routes/offers.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Path to admin dist folder
const adminDistPath = join(__dirname, '../../admin/dist');

connectDB();

// CORS configuration - specify exact origin (required for credentials, good practice anyway)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  `http://localhost:${PORT}`, // Allow same-origin requests
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
// Increase body size limit for bulk order uploads (50MB limit)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend server is running',
    database: 'MongoDB',
    timestamp: new Date().toISOString(),
  });
});

// API Routes - must come before static file serving
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/offers', offersRoutes);

// Global error handler - must come before static file serving
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  // Only return JSON for API routes
  if (req.path.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal server error',
    });
  } else {
    // For non-API routes, send a simple error page
    res.status(err.status || 500).send(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
          <h1>Error ${err.status || 500}</h1>
          <p>${err.message || 'Internal server error'}</p>
        </body>
      </html>
    `);
  }
});

// Serve static files from admin/dist if it exists
if (existsSync(adminDistPath)) {
  console.log(`✅ Serving admin dashboard from: ${adminDistPath}`);

  // Serve static assets (JS, CSS, images, etc.)
  app.use(express.static(adminDistPath));

  // Catch-all handler: send back React's index.html file for client-side routing
  // This must be last, after all API routes and static files
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({
        success: false,
        error: 'API route not found',
        path: req.path,
      });
    }

    // Serve index.html for all other routes (React Router will handle routing)
    res.sendFile(join(adminDistPath, 'index.html'));
  });
} else {
  console.warn(`⚠️  Admin dist folder not found at: ${adminDistPath}`);
  console.warn("   Run 'npm run build' in the admin folder to build the dashboard");

  // 404 handler for API routes only
  app.use('/api/*', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(404).json({
      success: false,
      error: 'API route not found',
      path: req.path,
    });
  });

  // For non-API routes, show a helpful message
  app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
      res.setHeader('Content-Type', 'application/json');
      res.status(404).json({
        success: false,
        error: 'API route not found',
        path: req.path,
      });
    } else {
      res.status(503).send(`
        <html>
          <head><title>Admin Dashboard Not Available</title></head>
          <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
            <h1>Admin Dashboard Not Built</h1>
            <p>The admin dashboard has not been built yet.</p>
            <p>Please run <code>npm run build</code> in the <code>admin</code> folder.</p>
            <p>Expected location: <code>${adminDistPath}</code></p>
          </body>
        </html>
      `);
    }
  });
}

app.listen(PORT, () => {
  console.log(`\n🚀 HomieBites server running on port ${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api`);
  if (existsSync(adminDistPath)) {
    console.log(`   Admin Dashboard: http://localhost:${PORT}/admin/login`);
  } else {
    console.log(`   ⚠️  Admin Dashboard: Not built (run 'npm run build' in admin folder)`);
  }
  console.log(`\n`);
});
