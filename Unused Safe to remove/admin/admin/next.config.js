import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const withPWA = require('@ducanh2912/next-pwa').default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Image optimization
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
  },

  // Environment variables
  // All APIs are now in Next.js - no external backend needed
  env: {
    // Keep for backward compatibility, but APIs use relative URLs
    API_URL: process.env.API_URL || '',
    VITE_API_URL: process.env.VITE_API_URL || '',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },

  // Output configuration - Remove standalone for Vercel
  // output: 'standalone', // Commented out - Vercel handles this automatically

  // Turbopack configuration (Next.js 16 default)
  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname, './'),
    },
  },
};

// Temporarily disable PWA wrapper to ensure Vercel deployment works
// Can be enabled after successful deployment
// const pwaConfig = withPWA({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: true,
//   buildExcludes: [/app-build-manifest\.json$/],
//   workboxOptions: {
//     disableDevLogs: true,
//     runtimeCaching: [
//       {
//         urlPattern: /^https?.*/,
//         handler: 'NetworkFirst',
//         options: {
//           cacheName: 'offlineCache',
//           expiration: {
//             maxEntries: 200,
//             maxAgeSeconds: 86400,
//           },
//         },
//       },
//     ],
//   },
// });

// Export without PWA wrapper for now
export default nextConfig;
