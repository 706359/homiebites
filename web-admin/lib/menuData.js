// Menu data management with API integration and localStorage fallback

import api from "./api.js";

const MENU_DATA_KEY = "homiebites_menu_data";

const defaultMenuData = [
  {
    id: 1,
    category: "Full Tiffin",
    icon: "fa-star",
    tag: "Best Seller",
    description:
      "Gravy Sabji + Dry Sabji + 4 Rotis + Rice (4 Rotis with Rice / 6 Rotis without Rice)",
    items: [
      { id: 1, name: "Thali Plastic (Classic)", price: 120 },
      { id: 10, name: "Tiffin Steel (Zambo)", price: 150 },
    ],
  },
  {
    id: 2,
    category: "Mix & Match Tiffin",
    icon: "fa-utensils",
    items: [
      { id: 1, name: "2 Sabji + 6 Rotis", price: 120 },
      { id: 2, name: "1 Sabji + 4 Rotis + Rice", price: 100 },
      { id: 3, name: "2 Sabji + 4 Rotis", price: 120 },
      { id: 4, name: "1 Sabji + 6 Rotis", price: 100 },
      { id: 5, name: "1 Sabji + 4 Rotis", price: 80 },
      { id: 6, name: "1 Sabji + 2 Bowls Rice", price: 100 },
      { id: 7, name: "Only 1 Sabji", price: 40 },
    ],
  },
  {
    id: 3,
    category: "Khichdi Tiffin",
    icon: "fa-bowl-rice",
    description: "Full Tiffin (4 bowls)",
    items: [{ id: 1, name: "Khichdi Meal", price: 120 }],
  },
  {
    id: 4,
    category: "Rotis & Parathas",
    icon: "fa-bread-slice",
    items: [
      { id: 1, name: "Plain Roti", price: 10 },
      { id: 2, name: "Roti with Ghee", price: 12 },
      { id: 3, name: "Plain Paratha", price: 20 },
      { id: 4, name: "Stuffed Paratha (Aloo/Gobhi/Muli/Methi)", price: 35 },
      { id: 5, name: "3 Stuffed Parathas", price: 100 },
    ],
  },
  {
    id: 5,
    category: "Add-ons",
    icon: "fa-plus",
    items: [
      { id: 1, name: "Homemade Curd (1 Bowl)", price: 25 },
      { id: 2, name: "Parathas + Curd Combo", price: 100 },
    ],
  },
  {
    id: 6,
    category: "Pickup Option",
    icon: "fa-person-walking",
    items: [{ id: 1, name: "Self-Pickup (A1 Tower)", price: 100 }],
    description: "Thali & Tiffin both available",
  },
];

export const getMenuData = async () => {
  // Check if we're in browser environment
  if (typeof window === "undefined") {
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
        // Don't cache to localStorage - always fetch from backend
        return response.data;
      }
    } catch (apiError) {
      console.error("API fetch failed:", apiError.message);
      // Don't use localStorage fallback - return empty array
      // Menu data must come from backend only
    }

    // Return empty array if no menu data exists (admin must add items first)
    return [];
  } catch (error) {
    console.error("Error accessing menu data:", error);
    return [];
  }
};

// Synchronous version for backward compatibility
// Note: This no longer uses localStorage - returns empty array
// Use getMenuData() async version to fetch from backend
export const getMenuDataSync = () => {
  // Always return empty - data must come from backend via getMenuData()
  return [];
};

export const saveMenuData = async (data) => {
  // Save directly to backend only - no localStorage
  try {
    const token = localStorage.getItem("homiebites_token");
    if (token) {
      await api.updateMenu(data);
      // Clear any old localStorage cache to ensure fresh data
      if (typeof window !== 'undefined') {
        localStorage.removeItem(MENU_DATA_KEY);
        localStorage.removeItem("homiebites_menu_version");
      }
    } else {
      throw new Error('Not authenticated. Please login to save menu data.');
    }
  } catch (error) {
    console.error("Failed to save menu to API:", error.message);
    throw error; // Re-throw so caller can handle the error
  }
};

export const resetMenuData = async () => {
  // Return default data for editing in admin dashboard
  // DO NOT save to localStorage - admin must click "Save Changes" to actually save
  return defaultMenuData;
};

// Trigger data sync (used by admin dashboard)
export const triggerDataSync = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("menuDataUpdated"));
  }
};


