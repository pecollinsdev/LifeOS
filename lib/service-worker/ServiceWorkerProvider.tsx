'use client';

import React from 'react';
import { useServiceWorker } from './useServiceWorker';

/**
 * ServiceWorkerProvider - Registers service worker on app load
 * 
 * This component handles service worker registration and should
 * be placed high in the component tree (in layout.tsx).
 */
export const ServiceWorkerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Register service worker - hook handles all logic
  useServiceWorker();

  return <>{children}</>;
};

