/**
 * Service Worker for LifeOS PWA
 * 
 * Implements offline-first caching strategy:
 * - Cache-first for app shell and static assets (instant startup)
 * - Network-first for API calls (when implemented)
 * - Graceful fallback when offline
 * 
 * Cache Strategy:
 * - App Shell: Cache-first (HTML, CSS, JS)
 * - Static Assets: Cache-first (images, fonts, icons)
 * - API Calls: Network-first (future)
 */

const CACHE_NAME = 'lifeos-v1';
const APP_SHELL_CACHE = 'lifeos-shell-v1';
const STATIC_CACHE = 'lifeos-static-v1';

// App shell resources - cached on install
const APP_SHELL_RESOURCES = [
  '/',
  '/tasks',
  '/habits',
  '/finance',
  '/fitness',
  '/nutrition',
];

// Static assets to cache
const STATIC_ASSETS = [
  '/manifest.json',
  '/favicon.ico',
  // Icons (will be added when available)
  // Note: Only include icons that actually exist
  // '/icon-180.png',
  // '/icon-192.png',
  // '/icon-512.png',
].filter(Boolean);

/**
 * Install event - Cache app shell and static assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache app shell
      caches.open(APP_SHELL_CACHE).then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(APP_SHELL_RESOURCES);
      }),
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS.filter(Boolean));
      }),
    ]).then(() => {
      console.log('[SW] Service worker installed');
      // Skip waiting to activate immediately
      return self.skipWaiting();
    })
  );
});

/**
 * Activate event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Remove old caches that don't match current version
            return (
              cacheName !== APP_SHELL_CACHE &&
              cacheName !== STATIC_CACHE &&
              cacheName !== CACHE_NAME
            );
          })
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log('[SW] Service worker activated');
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

/**
 * Fetch event - Implement caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (for security)
  if (url.origin !== location.origin) {
    return;
  }

  // Skip chrome-extension and other non-http(s) protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Strategy: Cache-first for app shell and static assets
  if (isAppShellRequest(request) || isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Strategy: Network-first for API calls (future)
  if (isApiRequest(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Default: Network-first with cache fallback
  event.respondWith(networkFirst(request));
});

/**
 * Check if request is for app shell (HTML pages)
 */
function isAppShellRequest(request) {
  return (
    request.destination === 'document' ||
    request.headers.get('accept')?.includes('text/html')
  );
}

/**
 * Check if request is for static asset
 */
function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    // Next.js static assets
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/_next/image') ||
    // PWA icons
    url.pathname.startsWith('/icon-') ||
    // Image files
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.webp') ||
    // Font files
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname.endsWith('.eot') ||
    // Manifest
    url.pathname === '/manifest.json' ||
    url.pathname === '/favicon.ico'
  );
}

/**
 * Check if request is for API
 */
function isApiRequest(request) {
  const url = new URL(request.url);
  // Future: when API routes are added
  return url.pathname.startsWith('/api/');
}

/**
 * Cache-first strategy: Check cache first, fallback to network
 * Used for: App shell, static assets
 */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    
    // Only cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Cache-first fetch failed:', error);
    
    // Return offline fallback if available
    if (request.destination === 'document') {
      const offlinePage = await cache.match('/');
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    throw error;
  }
}

/**
 * Network-first strategy: Try network first, fallback to cache
 * Used for: API calls, dynamic content
 */
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    // If it's a page request and we have the home page cached, return that
    if (request.destination === 'document') {
      const fallback = await cache.match('/');
      if (fallback) {
        return fallback;
      }
    }
    
    throw error;
  }
}

/**
 * Message handler for cache updates
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

