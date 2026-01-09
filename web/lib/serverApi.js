/**
 * Server-side API client for Next.js Server Components
 * Uses Next.js API routes or direct backend calls
 */

// All APIs are now in Next.js - use relative URLs (empty string means same origin)
const BACKEND_API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Fetch menu data (for Server Components)
 */
export async function getMenuDataServer() {
  try {
    // All APIs are now in Next.js - use relative URL
    const apiUrl = `${BACKEND_API_URL}/api/menu`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache', // Cache for SSG
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      console.warn('[Server API] Failed to fetch menu, returning empty array');
      return [];
    }

    const data = await response.json();
    if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('[Server API] Error fetching menu:', error);
    return [];
  }
}

/**
 * Fetch offers data (for Server Components)
 */
export async function getOffersDataServer() {
  try {
    // All APIs are now in Next.js - use relative URL
    const apiUrl = `${BACKEND_API_URL}/api/offers`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.warn('[Server API] Failed to fetch offers, returning empty array');
      return [];
    }

    const data = await response.json();
    if (data.success && data.data && Array.isArray(data.data)) {
      // Filter active offers
      return data.data.filter((offer) => {
        if (!offer.isActive) return false;
        if (offer.endDate && new Date(offer.endDate) < new Date()) return false;
        if (!offer.title || offer.title.trim() === '' ||
            offer.title.toLowerCase().includes('test') ||
            offer.title.toLowerCase().includes('saved via')) {
          return false;
        }
        return true;
      });
    }
    return [];
  } catch (error) {
    console.error('[Server API] Error fetching offers:', error);
    return [];
  }
}

/**
 * Fetch reviews data (for Server Components)
 */
export async function getReviewsServer(featured = false, limit = 10) {
  try {
    // All APIs are now in Next.js - use relative URL
    const apiUrl = `${BACKEND_API_URL}/api/reviews?featured=${featured}&limit=${limit}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    if (data.success && data.data && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('[Server API] Error fetching reviews:', error);
    return [];
  }
}

