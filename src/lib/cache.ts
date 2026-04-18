// Simple localStorage cache for faster page loads

const CACHE_PREFIX = 'cc_cache_';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export function setCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch (e) {
    console.error('Cache set error:', e);
  }
}

export function getCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(CACHE_PREFIX + key);
    if (!stored) return null;
    
    const entry: CacheEntry<T> = JSON.parse(stored);
    if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.data;
  } catch (e) {
    return null;
  }
}

export function getCacheWithExpiry<T>(key: string, maxAgeMs: number = CACHE_EXPIRY): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(CACHE_PREFIX + key);
    if (!stored) return null;
    
    const entry: CacheEntry<T> = JSON.parse(stored);
    if (Date.now() - entry.timestamp > maxAgeMs) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.data;
  } catch (e) {
    return null;
  }
}

export function clearCache(key?: string): void {
  if (typeof window === 'undefined') return;
  if (key) {
    localStorage.removeItem(CACHE_PREFIX + key);
  } else {
    // Clear all cache
    Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }
}

export function clearOldCache(maxAgeMs: number = CACHE_EXPIRY): void {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  Object.keys(localStorage)
    .filter(k => k.startsWith(CACHE_PREFIX))
    .forEach(k => {
      try {
        const stored = localStorage.getItem(k);
        if (stored) {
          const entry = JSON.parse(stored);
          if (now - entry.timestamp > maxAgeMs) {
            localStorage.removeItem(k);
          }
        }
      } catch (e) {
        // Ignore
      }
    });
}