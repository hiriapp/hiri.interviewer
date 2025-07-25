import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel için optimize edilmiş ayarlar
  trailingSlash: false,
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  
  // Production optimizasyonları (swcMinify Next.js 15'te default oldu)
  
  // Images config
  images: {
    domains: [],
    unoptimized: false,
  },
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  
  // TypeScript ve ESLint ayarları
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Rewrites for SPA behavior (fallback)
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
  
  // Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
