/**
 * Server Component version of Menu Page
 * Fetches menu data on the server for better SEO and performance
 * 
 * To use: Rename this file to page.jsx and update the client component
 */

import MenuPageClient from './MenuPageClient';

// This is a Server Component - runs on server
export default async function MenuPage() {
  // Fetch menu data on the server
  let menuData = [];
  
  try {
    const { getMenuDataServer } = await import('../../lib/serverApi');
    menuData = await getMenuDataServer();
  } catch (error) {
    console.error('Error fetching menu data on server:', error);
  }

  // Pass data to client component
  return <MenuPageClient initialMenuData={menuData} />;
}

