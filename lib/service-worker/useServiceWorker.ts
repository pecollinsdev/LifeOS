'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to register and manage service worker
 * 
 * Handles:
 * - Service worker registration
 * - Update detection
 * - Offline state detection
 */
export function useServiceWorker() {
  const [isOnline, setIsOnline] = useState(true);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check if service workers are supported
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('[SW] Service workers not supported');
      return;
    }

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial online status
    setIsOnline(navigator.onLine);

    // Register service worker
    registerServiceWorker();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      setSwRegistration(registration);

      // Check for updates immediately
      registration.update();

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            setUpdateAvailable(true);
          }
        });
      });

      // Listen for controller change (update activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      console.log('[SW] Service worker registered:', registration.scope);
    } catch (error) {
      console.error('[SW] Service worker registration failed:', error);
    }
  };

  const updateServiceWorker = async () => {
    if (!swRegistration) return;

    try {
      const worker = swRegistration.waiting;
      if (!worker) return;

      // Send skip waiting message
      worker.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
    } catch (error) {
      console.error('[SW] Failed to update service worker:', error);
    }
  };

  return {
    isOnline,
    updateAvailable,
    updateServiceWorker,
  };
}

