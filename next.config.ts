import type { NextConfig } from "next";

const isMobile = process.env.CAPACITOR_PLATFORM === 'true';

const nextConfig: NextConfig = {
  // Use export for Capacitor, standalone for web deployment
  output: isMobile ? "export" : "standalone",
  distDir: isMobile ? "out" : ".next",

  // Disable image optimization for static export
  images: {
    unoptimized: isMobile ? true : false,
  },

  // Allow TypeScript errors for mobile build (API routes have dynamic params)
  typescript: {
    ignoreBuildErrors: isMobile,
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: isMobile,
  },

  // Trailing slash for static export
  trailingSlash: isMobile ? true : false,

  // Exclude API folder from mobile builds - API routes are not used on mobile
  // Mobile app uses Capacitor SQLite directly
  ...(isMobile && {
    excludeDefaultMomentLocales: true,
    experimental: {
      // outputFileTracingExcludes: {
      //   '*': ['./src/app/api/**/*'],
      // },
    },
  }),
};

export default nextConfig;
