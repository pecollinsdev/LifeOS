import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/lib/theme';
import { ServiceWorkerProvider } from '@/lib/service-worker/ServiceWorkerProvider';
import { OfflineIndicator, BottomNavigation } from '@/shared/components';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LifeOS - Personal Life Dashboard',
  description: 'All-in-one personal life dashboard for tracking finances, fitness, nutrition, tasks, and habits',
  manifest: '/manifest.json',
  // iOS PWA configuration
  appleWebApp: {
    capable: true, // Enable "Add to Home Screen"
    statusBarStyle: 'default', // Will be dynamic based on theme
    title: 'LifeOS', // Name when installed
  },
  // Additional iOS meta tags
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default', // Dynamic via script
    'apple-mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' }, // Light mode - primary blue
    { media: '(prefers-color-scheme: dark)', color: '#111827' }, // Dark mode - gray-900
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
        <meta name="apple-mobile-web-app-status-bar-style" content="default" id="status-bar-style" />
        <meta name="apple-mobile-web-app-title" content="LifeOS" />
        
        {/* Dynamic status bar style script for dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function updateStatusBar() {
                  // Check data-theme attribute set by ThemeProvider
                  const theme = document.documentElement.getAttribute('data-theme');
                  const isDark = theme === 'dark';
                  const meta = document.getElementById('status-bar-style');
                  if (meta) {
                    meta.setAttribute('content', isDark ? 'black-translucent' : 'default');
                  }
                }
                updateStatusBar();
                const observer = new MutationObserver(updateStatusBar);
                observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateStatusBar);
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <ServiceWorkerProvider>
            <OfflineIndicator />
            {children}
            <BottomNavigation />
          </ServiceWorkerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

