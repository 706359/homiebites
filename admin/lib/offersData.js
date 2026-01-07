// Offers data management with API integration and localStorage fallback

import api from "./api.js";

const OFFERS_DATA_KEY = "homiebites_offers_data";

export const getOffersData = async () => {
  // Check if we're in browser environment
  if (typeof window === "undefined") {
    return [];
  }

  try {
    // Try to fetch from API first
    try {
      const response = await api.getOffers();
      if (
        response.success &&
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        // Filter only active offers with valid data
        const activeOffers = response.data.filter((offer) => {
          // Must be active
          if (!offer.isActive) return false;

          // Must not be expired (if endDate exists)
          if (offer.endDate && new Date(offer.endDate) < new Date())
            return false;

          // Must have a valid title (not empty, not test data)
          if (
            !offer.title ||
            offer.title.trim() === "" ||
            offer.title.toLowerCase().includes("test") ||
            offer.title.toLowerCase().includes("saved via")
          ) {
            return false;
          }

          return true;
        });
        // Cache in localStorage for offline access
        localStorage.setItem(OFFERS_DATA_KEY, JSON.stringify(activeOffers));
        return activeOffers;
      }
    } catch (apiError) {
      console.warn("API fetch failed, using cached data:", apiError.message);
    }

    // Fallback to localStorage - only return active offers
    const stored = localStorage.getItem(OFFERS_DATA_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter only active offers with valid data
          const activeOffers = parsed.filter((offer) => {
            // Must be active
            if (!offer.isActive) return false;

            // Must not be expired (if endDate exists)
            if (offer.endDate && new Date(offer.endDate) < new Date())
              return false;

            // Must have a valid title (not empty, not test data)
            if (
              !offer.title ||
              offer.title.trim() === "" ||
              offer.title.toLowerCase().includes("test") ||
              offer.title.toLowerCase().includes("saved via")
            ) {
              return false;
            }

            return true;
          });
          return activeOffers;
        }
      } catch (e) {
        console.warn("Error parsing offers data from localStorage:", e);
      }
    }

    // Return empty array if no offers exist
    return [];
  } catch (error) {
    console.error("Error accessing offers data:", error);
    return [];
  }
};

// Synchronous version for backward compatibility (uses cached data)
export const getOffersDataSync = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(OFFERS_DATA_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter only active offers with valid data
          const activeOffers = parsed.filter((offer) => {
            // Must be active
            if (!offer.isActive) return false;

            // Must not be expired (if endDate exists)
            if (offer.endDate && new Date(offer.endDate) < new Date())
              return false;

            // Must have a valid title (not empty, not test data)
            if (
              !offer.title ||
              offer.title.trim() === "" ||
              offer.title.toLowerCase().includes("test") ||
              offer.title.toLowerCase().includes("saved via")
            ) {
              return false;
            }

            return true;
          });
          return activeOffers;
        }
      } catch (e) {
        console.warn("Error parsing offers data from localStorage:", e);
      }
    }
    // Return empty array if no offers exist
    return [];
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return [];
  }
};

export const saveOffersData = async (data) => {
  // Save to localStorage immediately for instant UI update
  localStorage.setItem(OFFERS_DATA_KEY, JSON.stringify(data));

  // Try to sync to API (admin only)
  try {
    const token = localStorage.getItem("homiebites_token");
    if (token) {
      await api.updateOffers(data);
    }
  } catch (error) {
    console.warn("Failed to sync offers to API, saved locally:", error.message);
    // Data is already saved to localStorage, so it's not lost
  }
};

// Trigger data sync (used by admin dashboard)
export const triggerOffersDataSync = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("offersDataUpdated"));
  }
};


