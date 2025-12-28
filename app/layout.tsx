import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/lib/theme';
import { ServiceWorkerProvider } from '@/lib/service-worker/ServiceWorkerProvider';
import { OfflineIndicator } from '@/shared/components';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LifeOS - Personal Life Dashboard',
  description: 'All-in-one personal life dashboard for tracking finances, fitness, nutrition, tasks, and habits',
  manifest: '/manifest.json',
  // iOS PWA configuration
  appleWebApp: {
    capable: true, // Enable "Add to Home Screen"
    statusBarStyle: 'default', // Light status bar (dark text)
    title: 'LifeOS', // Name when installed
  },
  // Additional iOS meta tags
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' }, // Light mode
    { media: '(prefers-color-scheme: dark)', color: '#111827' }, // Dark mode (gray-900)
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // iOS safe area support
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Standard favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* iOS Apple Touch Icons - Multiple sizes for different devices */}
        {/* 180x180 is required for iOS, others improve quality on different devices */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icon-120.png" />
        {/* Fallback for older iOS versions */}
        <link rel="apple-touch-icon" href="/icon-180.png" />
        
        {/* PWA Splash Screens (iOS 12.2+) */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LifeOS" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <ServiceWorkerProvider>
            <OfflineIndicator />
            {children}
          </ServiceWorkerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

