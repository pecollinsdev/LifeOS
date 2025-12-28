# Offline Support

LifeOS implements comprehensive offline support using a service worker, enabling the app to work reliably without network connectivity.

## Features

### ✅ Instant Startup
- App shell cached on first load
- Static assets cached for fast access
- No network required for UI rendering

### ✅ Offline-First Behavior
- All data stored locally in IndexedDB
- App functions fully offline
- No broken screens when network is unavailable

### ✅ Graceful Network Handling
- Subtle offline indicator when connection is lost
- Automatic reconnection handling
- Seamless transition between online/offline states

## How It Works

### Service Worker

The service worker (`public/sw.js`) implements intelligent caching:

1. **App Shell Caching** (Cache-First)
   - HTML pages cached on install
   - Instant page loads from cache
   - Works completely offline

2. **Static Assets** (Cache-First)
   - CSS, JavaScript, fonts cached
   - Images and icons cached
   - Manifest and favicon cached

3. **API Calls** (Network-First, Future)
   - Network-first strategy for dynamic data
   - Falls back to cache if network fails
   - Ready for future API integration

### Caching Strategy

```
Request Type          Strategy          Fallback
─────────────────────────────────────────────────
App Shell          Cache             Offline Page
Static Assets          Cache-First         None (critical)
API Calls           Network-First      Cache (future)
```

## Offline Indicator

A subtle indicator appears at the top of the screen when offline:
- Shows "You're offline. App is working in offline mode."
- Auto-hides when connection is restored
- Respects iOS safe areas
- Non-intrusive design

## Data Persistence

All app data is stored locally using IndexedDB:
- Tasks persist across sessions
- Works offline and online
- No data loss when network is unavailable
- Fast local access

## Testing Offline Mode

### On iPhone Safari:

1. **Enable Airplane Mode**:
   - Open Settings → Enable Airplane Mode
   - Launch LifeOS from home screen
   - Verify app loads and functions normally

2. **Test Offline Indicator**:
   - Disable network connection
   - Verify indicator appears at top
   - Re-enable network
   - Verify indicator disappears

3. **Test Data Access**:
   - Create tasks while offline
   - Verify tasks save and display
   - Reconnect network
   - Verify app continues working

### Using Browser DevTools:

1. **Chrome DevTools**:
   - Open DevTools → Application tab
   - Service Workers section → Check registration
   - Cache Storage → Verify cached resources
   - Network tab → Enable "Offline" checkbox

2. **Safari Web Inspector** (iOS):
   - Connect iPhone to Mac
   - Enable Web Inspector in Safari settings
   - Check Service Workers in Resources

## Service Worker Lifecycle

### Installation
1. Service worker registers on first page load
2. Caches app shell and static assets
3. Activates immediately (skip waiting)

### Activation
1. Cleans up old caches
2. Takes control of all pages
3. Ready to serve cached content

### Updates
1. New service worker installs in background
2. User sees update notification (future)
3. Activates on next page load

## Cache Management

### Cache Names
- `lifeos-shell-v1` - App shell (HTML pages)
- `lifeos-static-v1` - Static assets
- `lifeos-v1` - General cache

### Cache Invalidation
- Version numbers in cache names
- Old caches automatically deleted on update
- Manual cache clearing via browser settings

## Configuration

### Service Worker Registration
- Registered in `ServiceWorkerProvider` component
- Automatically registers on app load
- Handles updates and errors gracefully

### Offline Indicator
- Component: `shared/components/OfflineIndicator`
- Monitors `navigator.onLine` status
- Listens to `online`/`offline` events

## Troubleshooting

### Service Worker Not Registering

1. **Check HTTPS**: Service workers require HTTPS (or localhost)
2. **Check Browser Support**: Verify service worker support
3. **Check Console**: Look for registration errors
4. **Clear Cache**: Try clearing browser cache

### App Not Working Offline

1. **Check Service Worker**: Verify it's registered and active
2. **Check Cache**: Verify resources are cached
3. **Check Console**: Look for fetch errors
4. **Reload**: Try hard refresh (Cmd+Shift+R)

### Offline Indicator Not Showing

1. **Check Network Status**: Verify `navigator.onLine` is false
2. **Check Component**: Verify `OfflineIndicator` is in layout
3. **Check Console**: Look for JavaScript errors

## Performance Impact

### Benefits
- ✅ Instant page loads (cached)
- ✅ Reduced network usage
- ✅ Works on slow connections
- ✅ Better battery life (less network activity)

### Considerations
- Initial cache size: ~500KB (app shell + assets)
- Cache updates: Automatic on service worker update
- Storage: Uses browser cache storage (managed automatically)

## Security

### Safe Practices
- ✅ Only caches same-origin resources
- ✅ Skips non-GET requests
- ✅ Validates responses before caching
- ✅ No sensitive data in cache

### Cache Scope
- Service worker scope: `/` (entire app)
- Only caches same-origin requests
- Cross-origin requests bypassed

## Future Enhancements

Potential improvements:
- [ ] Background sync for data updates
- [ ] Push notifications
- [ ] Update notification UI
- [ ] Cache size management
- [ ] Prefetching strategies

## Files

- `public/sw.js` - Service worker implementation
- `lib/service-worker/useServiceWorker.ts` - Registration hook
- `lib/service-worker/ServiceWorkerProvider.tsx` - Provider component
- `shared/components/OfflineIndicator/` - Offline indicator UI

## Additional Resources

- [MDN: Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web.dev: Offline Cookbook](https://web.dev/offline-cookbook/)
- [Google: Service Worker Caching Strategies](https://developers.google.com/web/tools/workbox/modules/workbox-strategies)

