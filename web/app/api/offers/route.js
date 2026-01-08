/**
 * Next.js API Route: Offers Data
 * Proxies requests to Express backend API
 * Can be used by Server Components for SSR/SSG
 */

const BACKEND_API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export async function GET(request) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/offers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache for static data (revalidate every 60 seconds)
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return Response.json(
        { success: false, error: 'Failed to fetch offers data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Filter active offers on server side
    if (data.success && data.data && Array.isArray(data.data)) {
      const activeOffers = data.data.filter((offer) => {
        if (!offer.isActive) return false;
        if (offer.endDate && new Date(offer.endDate) < new Date()) return false;
        if (!offer.title || offer.title.trim() === '' || 
            offer.title.toLowerCase().includes('test') ||
            offer.title.toLowerCase().includes('saved via')) {
          return false;
        }
        return true;
      });
      data.data = activeOffers;
    }

    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('[API Route] Error fetching offers:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

