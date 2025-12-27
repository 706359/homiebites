// Menu data management with API integration and localStorage fallback

import api from './api.js';

const MENU_DATA_KEY = 'homiebites_menu_data';

const defaultMenuData = [
  {
    id: 1,
    category: 'Full Tiffin',
    icon: 'fa-star',
    tag: 'Best Seller',
    description:
      'Gravy Sabji + Dry Sabji + 4 Rotis + Rice (4 Rotis with Rice / 6 Rotis without Rice)',
    items: [
      { id: 1, name: 'Thali Plastic (Classic)', price: 120 },
      { id: 10, name: 'Tiffin Steel (Zambo)', price: 150 },
    ],
  },
  {
    id: 2,
    category: 'Mix & Match Tiffin',
    icon: 'fa-utensils',
    items: [
      { id: 1, name: '2 Sabji + 6 Rotis', price: 120 },
      { id: 2, name: '1 Sabji + 4 Rotis + Rice', price: 100 },
      { id: 3, name: '2 Sabji + 4 Rotis', price: 120 },
      { id: 4, name: '1 Sabji + 6 Rotis', price: 100 },
      { id: 5, name: '1 Sabji + 4 Rotis', price: 80 },
      { id: 6, name: '1 Sabji + 2 Bowls Rice', price: 100 },
      { id: 7, name: 'Only 1 Sabji', price: 40 },
    ],
  },
  {
    id: 3,
    category: 'Khichdi Tiffin',
    icon: 'fa-bowl-rice',
    description: 'Full Tiffin (4 bowls)',
    items: [{ id: 1, name: 'Khichdi Meal', price: 120 }],
  },
  {
    id: 4,
    category: 'Rotis & Parathas',
    icon: 'fa-bread-slice',
    items: [
      { id: 1, name: 'Plain Roti', price: 10 },
      { id: 2, name: 'Roti with Ghee', price: 12 },
      { id: 3, name: 'Plain Paratha', price: 20 },
      { id: 4, name: 'Stuffed Paratha (Aloo/Gobhi/Muli/Methi)', price: 35 },
      { id: 5, name: '3 Stuffed Parathas', price: 100 },
    ],
  },
  {
    id: 5,
    category: 'Add-ons',
    icon: 'fa-plus',
    items: [
      { id: 1, name: 'Homemade Curd (1 Bowl)', price: 25 },
      { id: 2, name: 'Parathas + Curd Combo', price: 100 },
    ],
  },
  {
    id: 6,
    category: 'Pickup Option',
    icon: 'fa-person-walking',
    items: [{ id: 1, name: 'Self-Pickup (A1 Tower)', price: 100 }],
    description: 'Thali & Tiffin both available',
  },
];

export const getMenuData = async () => {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    // Try to fetch from API first
    try {
      const response = await api.getMenu();
      if (
        response.success &&
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        // Cache in localStorage for offline access
        localStorage.setItem(MENU_DATA_KEY, JSON.stringify(response.data));
        localStorage.setItem('homiebites_menu_version', 'api');
        return response.data;
      }
    } catch (apiError) {
      console.warn('API fetch failed, using cached data:', apiError.message);
    }

    // Fallback to localStorage - only return what's saved from admin
    const stored = localStorage.getItem(MENU_DATA_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn('Error parsing menu data from localStorage:', e);
      }
    }

    // Return empty array if no menu data exists (admin must add items first)
    return [];
  } catch (error) {
    console.error('Error accessing menu data:', error);
    return [];
  }
};

// Synchronous version for backward compatibility (uses cached data)
export const getMenuDataSync = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(MENU_DATA_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn('Error parsing menu data from localStorage:', e);
      }
    }
    // Return empty array if no menu data exists (admin must add items first)
    return [];
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return [];
  }
};

export const saveMenuData = async (data) => {
  // Save to localStorage immediately for instant UI update
  localStorage.setItem(MENU_DATA_KEY, JSON.stringify(data));

  // Try to sync to API (admin only)
  try {
    const token = localStorage.getItem('homiebites_token');
    if (token) {
      await api.updateMenu(data);
      localStorage.setItem('homiebites_menu_version', 'api');
    }
  } catch (error) {
    console.warn('Failed to sync menu to API, saved locally:', error.message);
    // Data is already saved to localStorage, so it's not lost
  }
};

export const resetMenuData = async () => {
  // Return default data for editing in admin dashboard
  // DO NOT save to localStorage - admin must click "Save Changes" to actually save
  return defaultMenuData;
};

// Trigger data sync (used by admin dashboard)
export const triggerDataSync = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('menuDataUpdated'));
  }
};
