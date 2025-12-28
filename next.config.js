/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PWA configuration - service worker is served from public/sw.js
  // Next.js automatically serves files from public/ directory
};

module.exports = nextConfig;

