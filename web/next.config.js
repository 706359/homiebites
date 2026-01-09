import path from 'path';
import { fileURLToPath } from 'url';

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
  
  // Environment variables (will be available on both server and client)
  // All APIs are now in Next.js - no external backend needed
  env: {
    // Keep for backward compatibility, but APIs use relative URLs
    API_URL: process.env.API_URL || '',
    VITE_API_URL: process.env.VITE_API_URL || '',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },
  
  // Output configuration
  output: 'standalone',
  
  // Experimental features
  experimental: {
    // Enable if needed
  },
  
  // Turbopack configuration (Next.js 16 default)
  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname, './'),
    },
  },
};

export default nextConfig;

