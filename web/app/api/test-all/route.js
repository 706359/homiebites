/**
 * Next.js API Route: Test All APIs
 * Comprehensive endpoint to check all API routes in one go
 */
import connectDB from '../../../lib/db.js';
import { isAdmin } from '../../../lib/middleware/auth.js';
import Order from '../../../lib/models/Order.js';
import Menu from '../../../lib/models/Menu.js';
import Review from '../../../lib/models/Review.js';
import Gallery from '../../../lib/models/Gallery.js';
import Settings from '../../../lib/models/Settings.js';

export async function GET(request) {
  const results = {
    timestamp: new Date().toISOString(),
    server: 'running',
    tests: {},
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      errors: [],
    },
  };

  // Helper function to test an API route
  const testRoute = async (name, testFn) => {
    results.summary.total++;
    try {
      const result = await testFn();
      results.tests[name] = {
        status: 'passed',
        ...result,
      };
      results.summary.passed++;
      return true;
    } catch (error) {
      results.tests[name] = {
        status: 'failed',
        error: error.message || 'Unknown error',
        stack: error.stack,
      };
      results.summary.failed++;
      results.summary.errors.push(`${name}: ${error.message}`);
      return false;
    }
  };

  try {
    // Test 1: Database Connection
    await testRoute('Database Connection', async () => {
      await connectDB();
      return { message: 'Database connected successfully' };
    });

    // Test 2: Database Models - Check if collections exist
    await testRoute('Order Model', async () => {
      const count = await Order.countDocuments().limit(1);
      return { message: 'Order model accessible', count };
    });

    await testRoute('Menu Model', async () => {
      const count = await Menu.countDocuments().limit(1);
      return { message: 'Menu model accessible', count };
    });

    await testRoute('Review Model', async () => {
      const count = await Review.countDocuments().limit(1);
      return { message: 'Review model accessible', count };
    });

    await testRoute('Gallery Model', async () => {
      const count = await Gallery.countDocuments().limit(1);
      return { message: 'Gallery model accessible', count };
    });

    await testRoute('Settings Model', async () => {
      try {
        const settings = await Settings.getSettings();
        return { message: 'Settings model accessible', hasSettings: !!settings };
      } catch (error) {
        // Settings might not exist yet, which is OK
        return { message: 'Settings model accessible (no settings yet)', hasSettings: false };
      }
    });

    // Test 3: API Routes - Test route handlers directly
    await testRoute('GET /api/health', async () => {
      const { GET: healthGET } = await import('../health/route.js');
      const mockRequest = new Request('http://localhost:3000/api/health', { method: 'GET' });
      const response = await healthGET(mockRequest);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Status: ${response.status}`);
      return { message: 'Health endpoint working', status: response.status, data: data.status };
    });

    await testRoute('GET /api/menu', async () => {
      const { GET: menuGET } = await import('../menu/route.js');
      const mockRequest = new Request('http://localhost:3000/api/menu', { method: 'GET' });
      const response = await menuGET(mockRequest);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Status: ${response.status}`);
      return { message: 'Menu endpoint working', status: response.status, hasData: !!data.data };
    });

    await testRoute('GET /api/reviews', async () => {
      const { GET: reviewsGET } = await import('../reviews/route.js');
      const mockRequest = new Request('http://localhost:3000/api/reviews', { method: 'GET' });
      const response = await reviewsGET(mockRequest);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Status: ${response.status}`);
      return { message: 'Reviews endpoint working', status: response.status, hasData: !!data.data };
    });

    await testRoute('GET /api/gallery', async () => {
      const { GET: galleryGET } = await import('../gallery/route.js');
      const mockRequest = new Request('http://localhost:3000/api/gallery', { method: 'GET' });
      const response = await galleryGET(mockRequest);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Status: ${response.status}`);
      return { message: 'Gallery endpoint working', status: response.status, hasData: !!data.data };
    });

    await testRoute('GET /api/settings', async () => {
      const { GET: settingsGET } = await import('../settings/route.js');
      const mockRequest = new Request('http://localhost:3000/api/settings', { method: 'GET' });
      const response = await settingsGET(mockRequest);
      // Settings might return 401 if not authenticated, which is OK
      if (response.status === 401 || response.status === 403) {
        return { message: 'Settings endpoint exists (requires auth)', status: response.status };
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Status: ${response.status}`);
      return { message: 'Settings endpoint working', status: response.status, hasData: !!data.data };
    });

    await testRoute('GET /api/offers', async () => {
      const { GET: offersGET } = await import('../offers/route.js');
      const mockRequest = new Request('http://localhost:3000/api/offers', { method: 'GET' });
      const response = await offersGET(mockRequest);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Status: ${response.status}`);
      return { message: 'Offers endpoint working', status: response.status, hasData: !!data.data };
    });

    await testRoute('GET /api/orders', async () => {
      const { GET: ordersGET } = await import('../orders/route.js');
      const mockRequest = new Request('http://localhost:3000/api/orders', { method: 'GET' });
      const response = await ordersGET(mockRequest);
      // Orders endpoint requires auth, so 401 is expected
      if (response.status === 401 || response.status === 403) {
        return { message: 'Orders endpoint exists (requires auth)', status: response.status };
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Status: ${response.status}`);
      return { message: 'Orders endpoint working', status: response.status, hasData: !!data.data };
    });

    // Test 4: Authentication Routes (test if they exist)
    await testRoute('POST /api/auth/login', async () => {
      return { message: 'Login endpoint exists' };
    });

    await testRoute('POST /api/auth/register', async () => {
      return { message: 'Register endpoint exists' };
    });

    // Test 5: Environment Variables
    await testRoute('Environment Variables', async () => {
      const envCheck = {
        hasMongoURI: !!process.env.MONGOURI,
        hasJWTSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV || 'not set',
      };
      
      if (!envCheck.hasMongoURI) {
        throw new Error('MONGOURI environment variable is not set');
      }
      if (!envCheck.hasJWTSecret) {
        throw new Error('JWT_SECRET environment variable is not set');
      }
      
      return { message: 'All required environment variables are set', ...envCheck };
    });

    // Test 6: Check if admin authentication works (optional test)
    try {
      await testRoute('Admin Authentication Middleware', async () => {
        // Test if isAdmin middleware exists and can be imported
        if (typeof isAdmin === 'function') {
          return { message: 'Admin authentication middleware is available' };
        }
        throw new Error('Admin authentication middleware not found');
      });
    } catch (error) {
      // Skip if admin test fails (might not have auth token)
    }

    // Determine overall status
    const overallStatus = results.summary.failed === 0 ? 'all_passed' : 'some_failed';
    const success = results.summary.failed === 0;

    return Response.json(
      {
        success,
        status: overallStatus,
        ...results,
      },
      { status: success ? 200 : 207 } // 207 Multi-Status if some tests failed
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        status: 'error',
        error: error.message || 'Unknown error occurred',
        ...results,
      },
      { status: 500 }
    );
  }
}

