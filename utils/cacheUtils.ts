/**
 * Cache utility for API responses with automatic invalidation
 */

interface CacheItem {
  data: any;
  timestamp: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  maxSize?: number; // Maximum cache size
}

class CacheManager {
  private cache: Map<string, CacheItem>;
  private ttl: number; // Default TTL in seconds
  private maxSize: number;
  
  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.ttl = options.ttl || 60 * 5; // Default 5 minutes
    this.maxSize = options.maxSize || 100; // Default 100 items
  }
  
  /**
   * Get an item from the cache
   * @param key The cache key
   * @returns The cached data or undefined if not found or expired
   */
  get(key: string): any {
    const item = this.cache.get(key);
    
    // Return undefined if item not found
    if (!item) {
      return undefined;
    }
    
    // Return undefined if item is expired
    if (Date.now() - item.timestamp > this.ttl * 1000) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.data;
  }
  
  /**
   * Set an item in the cache
   * @param key The cache key
   * @param data The data to cache
   * @param ttl Optional override for TTL in seconds
   */
  set(key: string, data: any, ttl?: number): void {
    // Trim cache if reached max size
    if (this.cache.size >= this.maxSize) {
      this.trimCache();
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  /**
   * Check if the cache contains a valid (non-expired) item
   * @param key The cache key
   * @returns True if the cache contains a valid item
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }
    
    // Check if expired
    if (Date.now() - item.timestamp > this.ttl * 1000) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
  
  /**
   * Delete an item from the cache
   * @param key The cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Invalidate cache items that match a prefix
   * @param prefix The key prefix to match
   */
  invalidateByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Trim the cache by removing the oldest items
   */
  private trimCache(): void {
    // Sort keys by timestamp (oldest first)
    const keys = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .map(entry => entry[0]);
    
    // Remove 20% of oldest entries
    const removeCount = Math.ceil(this.maxSize * 0.2);
    for (let i = 0; i < removeCount && i < keys.length; i++) {
      this.cache.delete(keys[i]);
    }
  }
  
  /**
   * Get cache stats
   */
  getStats(): { size: number; maxSize: number; ttl: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl
    };
  }
}

// Create a singleton instance for global cache
export const globalCache = new CacheManager({
  ttl: 60 * 5, // 5 minutes
  maxSize: 200
});

/**
 * Generate a cache key from parameters
 */
export const generateCacheKey = (
  prefix: string,
  params?: Record<string, any>
): string => {
  if (!params) {
    return prefix;
  }
  
  // Sort keys for consistent ordering
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys
    .map(key => {
      const value = params[key];
      // Skip undefined values
      if (value === undefined) {
        return '';
      }
      // Handle arrays and objects
      if (typeof value === 'object') {
        return `${key}=${JSON.stringify(value)}`;
      }
      return `${key}=${value}`;
    })
    .filter(Boolean) // Remove empty strings
    .join('&');
  
  return `${prefix}${paramString ? `_${paramString}` : ''}`;
};

export default globalCache; 