import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  reactStrictMode: true,

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

  env: {
    API_URL: process.env.API_URL || '',
    VITE_API_URL: process.env.VITE_API_URL || '',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },

  output: 'standalone',

  experimental: {},

  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname, './'),
    },
  },
};

export default nextConfig;
