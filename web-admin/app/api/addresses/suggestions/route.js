import connectDB from '../../../../lib/db.js';
import Order from '../../../../lib/models/Order.js';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    // Fetch all unique addresses from orders
    const orders = await Order.find({}).lean();
    const addressSet = new Set();

    orders.forEach((order) => {
      const address =
        order.deliveryAddress ||
        order.customerAddress ||
        order.address ||
        order['Delivery Address'] ||
        order.delivery_address;
      if (address && address.trim()) {
        addressSet.add(address.trim());
      }
    });

    let addresses = Array.from(addressSet);

    // If query is empty, return all unique addresses (for caching)
    if (!query || query.trim().length === 0) {
      // Return all addresses for caching in localStorage
      return Response.json({
        success: true,
        data: addresses,
      });
    }
    
    // Filter addresses based on query
    const queryLower = query.trim().toLowerCase();
    // Only show addresses that actually contain the query
    addresses = addresses.filter((addr) => {
      const addrLower = addr.toLowerCase();
      return addrLower.includes(queryLower);
    });
    
    // If no matches found, return empty array
    if (addresses.length === 0) {
      return Response.json({
        success: true,
        data: [],
      });
    }

    // Sort by relevance (exact matches first, then starts with, then contains)
    addresses.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();

      // Exact match gets highest priority
      if (aLower === queryLower && bLower !== queryLower) return -1;
      if (aLower !== queryLower && bLower === queryLower) return 1;
      
      // Starts with gets second priority
      const aStarts = aLower.startsWith(queryLower);
      const bStarts = bLower.startsWith(queryLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      // Then sort by position of match (earlier is better)
      const aIndex = aLower.indexOf(queryLower);
      const bIndex = bLower.indexOf(queryLower);
      if (aIndex !== bIndex) return aIndex - bIndex;
      
      // Finally alphabetically
      return aLower.localeCompare(bLower);
    });

    // Limit to 10 suggestions
    addresses = addresses.slice(0, 10);

    return Response.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error('[Address Suggestions API] Error:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch address suggestions',
        data: [],
      },
      { status: 500 }
    );
  }
}
