# Cross-Device Sync Setup

LifeOS supports optional cross-device synchronization while maintaining local-first behavior.

## Principles

### Local-First
- ✅ All data is stored locally in IndexedDB
- ✅ App works fully offline
- ✅ Local writes happen immediately
- ✅ Sync is non-blocking and optional

### Conflict Resolution
- ✅ **Local data always wins** in conflicts
- ✅ Remote data is merged only if item doesn't exist locally
- ✅ No data loss - local is source of truth

### Sync Behavior
- ✅ Sync only when network is available
- ✅ Sync happens in background (non-blocking)
- ✅ Sync failures don't affect local operations
- ✅ Optional - can be disabled at any time

## Architecture

### Storage Layers

```
┌─────────────────┐
│   UI Layer      │
│  (Components)   │
└────────┬────────┘
         │
┌────────▼────────┐
│  Service Layer   │
│  (TaskService)  │
└────────┬────────┘
         │
┌────────▼────────┐
│  Storage Layer   │
│  (IStorage<T>)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│ Local │ │  Sync   │
│Storage│ │ Wrapper │
└───────┘ └────┬────┘
               │
          ┌────▼────┐
          │ Remote  │
          │  API    │
          └─────────┘
```

### Components

1. **SyncStorage** - Wraps local storage, adds sync
2. **SyncService** - Handles remote API communication
3. **SyncConfig** - Configuration (enabled/disabled, endpoint)

## Configuration

### Enable Sync

Sync is **disabled by default**. To enable:

```typescript
import { saveSyncConfig } from '@/lib/sync';

saveSyncConfig({
  enabled: true,
  endpoint: 'https://api.example.com/sync',
  apiKey: 'your-api-key', // Optional, if auth required
});
```

### Disable Sync

```typescript
import { saveSyncConfig } from '@/lib/sync';

saveSyncConfig({
  enabled: false,
});
```

### Check Sync Status

```typescript
import { useSyncStatus } from '@/lib/sync';

function MyComponent() {
  const { enabled, isOnline, canSync } = useSyncStatus();
  
  return (
    <div>
      Sync: {enabled ? 'Enabled' : 'Disabled'}
      {canSync && <span>Syncing...</span>}
    </div>
  );
}
```

## How It Works

### Save Operation

1. **Local Save** (immediate)
   - Item saved to IndexedDB
   - UI updates immediately
   - No network required

2. **Background Sync** (non-blocking)
   - If sync enabled and online
   - Uploads all items to remote
   - Fails silently if network unavailable

### Load Operation

1. **Local Load** (immediate)
   - Items loaded from IndexedDB
   - UI renders immediately

2. **Background Merge** (non-blocking)
   - If sync enabled and online
   - Downloads remote items
   - Merges items that don't exist locally
   - Local items always preserved

### Conflict Resolution

When same item exists locally and remotely:

- **Local wins** - Local version is kept
- **Remote ignored** - Remote version is discarded
- **No merge** - No field-level merging

This ensures:
- No data loss
- Predictable behavior
- Simple conflict resolution

## API Requirements

If you're building a sync backend, it should support:

### Upload Items
```
PUT /{storeName}
Content-Type: application/json
Authorization: Bearer {apiKey}

{
  "items": [
    {
      "id": "...",
      "title": "...",
      "updatedAt": "...",
      ...
    }
  ]
}
```

### Download Items
```
GET /{storeName}
Authorization: Bearer {apiKey}

Response:
{
  "items": [
    {
      "id": "...",
      "title": "...",
      "updatedAt": "...",
      ...
    }
  ]
}
```

### Delete Item
```
DELETE /{storeName}/{id}
Authorization: Bearer {apiKey}
```

## Usage Example

### Current (No Sync)

```typescript
// Storage factory creates local-only storage
const storage = StorageFactory.create<Task>('tasks');
const service = new TaskService(storage);
```

### With Sync Enabled

```typescript
// Enable sync in config
saveSyncConfig({
  enabled: true,
  endpoint: 'https://api.example.com/sync',
});

// Storage factory automatically wraps with sync
const storage = StorageFactory.create<Task>('tasks');
// Now storage is SyncStorage wrapping IndexedDBStorage
const service = new TaskService(storage);
// Service works the same - sync is transparent
```

## Testing

### Test Offline Behavior

1. Disable sync or go offline
2. Create/edit/delete items
3. Verify all operations work normally
4. No errors or blocking

### Test Sync Behavior

1. Enable sync with test endpoint
2. Create items on Device A
3. Wait for sync (background)
4. Check Device B - items should appear
5. Edit same item on both devices
6. Verify local version wins on each device

### Test Conflict Resolution

1. Create item on Device A
2. Sync to remote
3. Edit item on Device A (local)
4. Edit same item on Device B (remote)
5. Sync both
6. Verify each device keeps its local version

## Security Considerations

### API Keys

- Store API keys securely (localStorage is acceptable for personal use)
- Consider using OAuth for production
- Rotate keys if compromised

### Data Privacy

- All data is stored locally first
- Sync is optional - can be disabled
- Remote data is not required for app to function

## Limitations

### Current Implementation

- Simple conflict resolution (local wins)
- No field-level merging
- No sync history/versioning
- No multi-user support
- Designed for personal use

### Future Enhancements

- [ ] Field-level conflict resolution
- [ ] Sync history/versioning
- [ ] Multi-user support
- [ ] Sync status UI
- [ ] Manual sync trigger
- [ ] Sync conflict notifications

## Troubleshooting

### Sync Not Working

1. **Check Config**: Verify sync is enabled
   ```typescript
   const config = getSyncConfig();
   console.log(config);
   ```

2. **Check Network**: Verify device is online
   ```typescript
   console.log(navigator.onLine);
   ```

3. **Check Endpoint**: Verify endpoint URL is correct
4. **Check Console**: Look for sync errors in console

### Data Not Syncing

1. **Verify Storage**: Check that items are saved locally
2. **Check Network**: Ensure device is online
3. **Check API**: Verify remote endpoint is accessible
4. **Check Logs**: Look for sync errors

### Conflicts Not Resolving

- This is expected behavior - local always wins
- Each device keeps its own version
- No automatic merging (by design)

## Files

- `lib/sync/sync-storage.ts` - Sync wrapper for storage
- `lib/sync/sync-service.ts` - Remote API communication
- `lib/sync/sync-config.ts` - Configuration management
- `lib/sync/useSyncStatus.ts` - React hook for sync status
- `lib/storage/storage-factory.ts` - Updated to support sync

## Additional Resources

- [Local-First Software](https://www.inkandswitch.com/local-first/)
- [CRDTs for Conflict-Free Replication](https://crdt.tech/)
- [Offline-First Architecture](https://offlinefirst.org/)

