import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  reactStrictMode: true,

  // Performance Optimizations
  compress: true,
  
  // Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Environment Variables
  env: {
    API_URL: process.env.API_URL || '',
    VITE_API_URL: process.env.VITE_API_URL || '',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },

  // Output Configuration
  output: 'standalone',

  // Ensure correct project root for standalone build and file tracing
  outputFileTracingRoot: __dirname,

  // Experimental Features
  experimental: {
    optimizePackageImports: ['react-icons', '@fortawesome/fontawesome-free'],
  },

  // Turbopack Configuration: set root so Next.js doesn't use a parent lockfile's directory
  turbopack: {
    root: __dirname,
    resolveAlias: {
      '@': path.resolve(__dirname, './'),
    },
  },

  // Headers for Security and Performance
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
      // Disable caching for CSS files in development
      ...(isDev ? [
        {
          source: '/_next/static/css/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
            },
            {
              key: 'Pragma',
              value: 'no-cache'
            },
            {
              key: 'Expires',
              value: '0'
            },
          ],
        },
        {
          source: '/:path*.css',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
            },
            {
              key: 'Pragma',
              value: 'no-cache'
            },
            {
              key: 'Expires',
              value: '0'
            },
          ],
        },
      ] : []),
    ];
  },
};

export default nextConfig;
