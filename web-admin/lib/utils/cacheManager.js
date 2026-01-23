/**
 * Centralized Cache Manager for HomieBites
 * 
 * Best Practices:
 * - Load fresh data on page load/refresh
 * - Show cached data immediately for fast initial render
 * - Update cache in background with fresh data
 * - Use cache for subsequent navigations within session
 */

const CACHE_PREFIX = 'homiebites_';
const CACHE_TIMESTAMP_SUFFIX = '_timestamp';
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached data with timestamp
 */
export const getCachedData = (key, maxAge = DEFAULT_CACHE_DURATION) => {
  if (typeof window === 'undefined') return null;

  try {
    const cachedData = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    const cacheTimestamp = localStorage.getItem(
      `${CACHE_PREFIX}${key}${CACHE_TIMESTAMP_SUFFIX}`
    );

    if (!cachedData || !cacheTimestamp) return null;

    const cacheAge = Date.now() - parseInt(cacheTimestamp, 10);

    // Return cached data if it's still fresh
    if (cacheAge < maxAge) {
      try {
        return JSON.parse(cachedData);
      } catch (e) {
        console.warn(`[CacheManager] Failed to parse cached data for ${key}:`, e);
        return null;
      }
    }

    // Cache expired, remove it
    removeCachedData(key);
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[CacheManager] Error getting cached data for ${key}:`, error);
    }
    return null;
  }
};

/**
 * Set cached data with timestamp
 */
export const setCachedData = (key, data) => {
  if (typeof window === 'undefined') return false;

  try {
    const dataKey = `${CACHE_PREFIX}${key}`;
    const timestampKey = `${CACHE_PREFIX}${key}${CACHE_TIMESTAMP_SUFFIX}`;

    localStorage.setItem(dataKey, JSON.stringify(data));
    localStorage.setItem(timestampKey, String(Date.now()));
    return true;
  } catch (error) {
    // Handle quota exceeded or other storage errors
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[CacheManager] Failed to cache data for ${key}:`, error);
    }
    return false;
  }
};

/**
 * Remove cached data
 */
export const removeCachedData = (key) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    localStorage.removeItem(`${CACHE_PREFIX}${key}${CACHE_TIMESTAMP_SUFFIX}`);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[CacheManager] Error removing cached data for ${key}:`, error);
    }
  }
};

/**
 * Check if cache exists and is fresh
 */
export const isCacheFresh = (key, maxAge = DEFAULT_CACHE_DURATION) => {
  if (typeof window === 'undefined') return false;

  try {
    const cacheTimestamp = localStorage.getItem(
      `${CACHE_PREFIX}${key}${CACHE_TIMESTAMP_SUFFIX}`
    );

    if (!cacheTimestamp) return false;

    const cacheAge = Date.now() - parseInt(cacheTimestamp, 10);
    return cacheAge < maxAge;
  } catch {
    return false;
  }
};

/**
 * Get cache age in milliseconds
 */
export const getCacheAge = (key) => {
  if (typeof window === 'undefined') return null;

  try {
    const cacheTimestamp = localStorage.getItem(
      `${CACHE_PREFIX}${key}${CACHE_TIMESTAMP_SUFFIX}`
    );

    if (!cacheTimestamp) return null;

    return Date.now() - parseInt(cacheTimestamp, 10);
  } catch {
    return null;
  }
};

/**
 * Standard data fetching pattern with cache:
 * 1. Show cached data immediately (if available and fresh)
 * 2. Fetch fresh data from API
 * 3. Update cache and UI with fresh data
 * 
 * @param {string} cacheKey - Cache key for this data
 * @param {Function} fetchFn - Async function that fetches data from API
 * @param {number} cacheDuration - Cache duration in milliseconds
 * @returns {Promise<{data: any, fromCache: boolean}>}
 */
export const fetchWithCache = async (
  cacheKey,
  fetchFn,
  cacheDuration = DEFAULT_CACHE_DURATION
) => {
  // Try to get cached data first
  const cachedData = getCachedData(cacheKey, cacheDuration);

  if (cachedData) {
    // Return cached data immediately, but still fetch fresh data in background
    fetchFn()
      .then((freshData) => {
        // Update cache with fresh data
        if (freshData) {
          setCachedData(cacheKey, freshData);
        }
      })
      .catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[CacheManager] Background fetch failed for ${cacheKey}:`, error);
        }
      });

    return { data: cachedData, fromCache: true };
  }

  // No cache or cache expired, fetch fresh data
  try {
    const freshData = await fetchFn();
    if (freshData) {
      setCachedData(cacheKey, freshData);
    }
    return { data: freshData, fromCache: false };
  } catch (error) {
    // If fetch fails and we have stale cache, use it
    const staleCache = getCachedData(cacheKey, cacheDuration * 10); // Allow 10x duration for stale cache
    if (staleCache) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[CacheManager] Using stale cache for ${cacheKey} due to fetch error`);
      }
      return { data: staleCache, fromCache: true };
    }
    throw error;
  }
};

/**
 * Clear all cache (useful for logout or data refresh)
 */
export const clearAllCache = () => {
  if (typeof window === 'undefined') return;

  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[CacheManager] Error clearing cache:', error);
    }
  }
};

/**
 * Cache keys used across the application
 */
export const CACHE_KEYS = {
  PRICING: 'pricing_data',
  GALLERY: 'gallery_data',
  OFFERS: 'offers_data',
  MENU: 'menu_data',
  SETTINGS: 'settings_data',
};
