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
  env: {
    API_URL: process.env.API_URL || 'http://127.0.0.1:3001',
    VITE_API_URL: process.env.VITE_API_URL || 'http://127.0.0.1:3001',
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

