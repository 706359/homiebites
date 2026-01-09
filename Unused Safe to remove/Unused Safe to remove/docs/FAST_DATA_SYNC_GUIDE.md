# Fast Data Sync System Guide

## Overview

This system provides **fast, safe, and efficient** data synchronization for upload, delete, and update operations in the admin dashboard. It uses optimistic updates, request cancellation, debouncing, and automatic error recovery.

## Key Features

### 1. **Optimistic Updates**
- UI updates immediately (no waiting for server response)
- Background sync ensures data consistency
- Automatic rollback on errors

### 2. **Request Cancellation**
- Cancel in-flight requests when new ones are made
- Prevents race conditions and duplicate operations
- Uses `AbortController` for native browser support

### 3. **Debounced Sync**
- Batches multiple rapid sync calls
- Reduces server load and improves performance
- Configurable delay (default: 300ms)

### 4. **Error Recovery**
- Automatic rollback of optimistic updates on failure
- User-friendly error messages
- Retry mechanisms built-in

## Architecture

### Components

1. **`dataSyncManager.js`** - Centralized sync management
   - Request cancellation
   - Debouncing
   - Queue management
   - Optimistic update tracking

2. **`useOptimisticData.js`** - React hook for optimistic updates
   - Immediate UI updates
   - Background sync
   - Error recovery

3. **`useFastDataSync.js`** - High-level hook combining everything
   - Integrates `useAdminData` with optimistic updates
   - Provides `fastDelete`, `fastUpdate`, `fastCreate`
   - Automatic sync management

4. **Enhanced API Client** (`api.js`)
   - Supports `AbortController` for cancellation
   - Signal propagation for request cancellation

## Usage

### Basic Operations

```javascript
import { useFastDataSync } from './hooks/useFastDataSync.js';

const MyComponent = () => {
  const { 
    orders, 
    fastDelete, 
    fastUpdate, 
    fastCreate,
    syncDebounced,
    cancelAll,
    syncing 
  } = useFastDataSync();

  // Fast delete with optimistic update
  const handleDelete = async (orderId) => {
    await fastDelete(
      orderId,
      () => showNotification('Deleted successfully', 'success'),
      (error) => showNotification(error.message, 'error')
    );
  };

  // Fast update with optimistic update
  const handleUpdate = async (orderId, updates) => {
    await fastUpdate(
      orderId,
      updates,
      () => showNotification('Updated successfully', 'success'),
      (error) => showNotification(error.message, 'error')
    );
  };

  // Fast create with optimistic update
  const handleCreate = async (orderData) => {
    await fastCreate(
      orderData,
      () => showNotification('Created successfully', 'success'),
      (error) => showNotification(error.message, 'error')
    );
  };

  // Manual debounced sync
  const handleSync = async () => {
    await syncDebounced(500); // 500ms delay
  };

  // Cancel all pending operations
  const handleCancel = () => {
    cancelAll();
  };
};
```

### Upload with Cancellation

The `CSVUploadModal` component now supports cancellation:

```javascript
// Cancel button automatically cancels XHR request
<button onClick={handleCancelUpload}>
  Cancel Upload
</button>
```

## Benefits

### Performance
- **Instant UI feedback** - No waiting for server responses
- **Reduced server load** - Debouncing batches operations
- **Fewer requests** - Cancellation prevents duplicate calls

### Safety
- **Automatic rollback** - Errors revert optimistic updates
- **Request cancellation** - Prevents race conditions
- **Error recovery** - Built-in retry mechanisms

### User Experience
- **Fast response** - UI updates immediately
- **Clear feedback** - Loading states and error messages
- **Cancellation support** - Users can cancel long operations

## Configuration

### Debounce Delay

Default: 300ms

```javascript
// Custom delay
await syncDebounced(500); // 500ms delay
```

### Enable/Disable Optimistic Updates

```javascript
const optimisticData = useOptimisticData({
  enableOptimistic: true, // Set to false to disable
});
```

## Best Practices

1. **Always handle errors** - Provide user feedback
2. **Use debounced sync** - For rapid operations
3. **Cancel on unmount** - Cleanup pending operations
4. **Show loading states** - Use `syncing` flag
5. **Test error scenarios** - Ensure rollback works

## Migration Guide

### Old Code
```javascript
const handleDelete = async (orderId) => {
  const response = await api.deleteOrder(orderId);
  if (response.success) {
    await loadOrders(); // Full reload
  }
};
```

### New Code
```javascript
const handleDelete = async (orderId) => {
  await fastDelete(
    orderId,
    () => showNotification('Deleted', 'success'),
    (error) => showNotification(error.message, 'error')
  );
  // Automatic sync in background
};
```

## Troubleshooting

### Operations Not Syncing
- Check if `cancelAll()` was called
- Verify network connectivity
- Check browser console for errors

### Optimistic Updates Not Rolling Back
- Ensure error handlers are properly set
- Check that `enableOptimistic` is true
- Verify API error responses

### Performance Issues
- Increase debounce delay
- Reduce batch size in `dataSyncManager`
- Check for memory leaks (ensure cleanup on unmount)

## Technical Details

### Request Flow

1. **User Action** → Optimistic UI Update
2. **Background Request** → API Call
3. **Success** → Confirm Update
4. **Error** → Rollback + Show Error

### Cancellation Flow

1. **New Request** → Cancel Previous Request
2. **AbortController** → Abort Fetch/XHR
3. **Cleanup** → Remove from Queue

### Debounce Flow

1. **Multiple Calls** → Queue Operations
2. **Wait Delay** → Batch Operations
3. **Single Request** → Process Batch
4. **Update UI** → Apply Results

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Offline queue with sync on reconnect
- [ ] Conflict resolution for concurrent edits
- [ ] Progress tracking for bulk operations
- [ ] Retry with exponential backoff

