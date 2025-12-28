import { MetadataRoute } from 'next';

/**
 * PWA manifest configuration.
 * 
 * This enables the app to be installed as a Progressive Web App
 * on iOS Safari and other platforms.
 * 
 * iOS Requirements:
 * - Icons: 180x180 (required), additional sizes for better quality
 * - display: 'standalone' for full-screen experience
 * - theme_color: Matches status bar color
 * - background_color: Splash screen color
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LifeOS - Personal Life Dashboard',
    short_name: 'LifeOS',
    description: 'All-in-one personal life dashboard for tracking finances, fitness, nutrition, tasks, and habits',
    start_url: '/',
    display: 'standalone', // Full-screen, no browser UI
    background_color: '#f9fafb', // Light mode background (gray-50)
    theme_color: '#0ea5e9', // Primary brand color (primary-500)
    orientation: 'portrait', // Lock to portrait for mobile-first design
    scope: '/', // App scope
    icons: [
      // iOS requires 180x180 for apple-touch-icon
      {
        src: '/icon-180.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      // Standard PWA sizes
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      // Additional iOS sizes for better quality
      {
        src: '/icon-120.png',
        sizes: '120x120',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}

