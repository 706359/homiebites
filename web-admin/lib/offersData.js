

import api from "./api.js";

const OFFERS_DATA_KEY = "homiebites_offers_data";

export const getOffersData = async () => {
  
  if (typeof window === "undefined") {
    return [];
  }

  try {
    
    try {
      const response = await api.getOffers();
      if (
        response.success &&
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        
        const activeOffers = response.data.filter((offer) => {
          
          if (!offer.isActive) return false;

          
          if (offer.endDate && new Date(offer.endDate) < new Date())
            return false;

          
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
        
        localStorage.setItem(OFFERS_DATA_KEY, JSON.stringify(activeOffers));
        return activeOffers;
      }
    } catch (apiError) {
      console.warn("API fetch failed, using cached data:", apiError.message);
    }

    
    const stored = localStorage.getItem(OFFERS_DATA_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          
          const activeOffers = parsed.filter((offer) => {
            
            if (!offer.isActive) return false;

            
            if (offer.endDate && new Date(offer.endDate) < new Date())
              return false;

            
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

    
    return [];
  } catch (error) {
    console.error("Error accessing offers data:", error);
    return [];
  }
};


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
          
          const activeOffers = parsed.filter((offer) => {
            
            if (!offer.isActive) return false;

            
            if (offer.endDate && new Date(offer.endDate) < new Date())
              return false;

            
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
    
    return [];
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return [];
  }
};

export const saveOffersData = async (data) => {
  
  localStorage.setItem(OFFERS_DATA_KEY, JSON.stringify(data));

  
  try {
    const token = localStorage.getItem("homiebites_token");
    if (token) {
      await api.updateOffers(data);
    }
  } catch (error) {
    console.warn("Failed to sync offers to API, saved locally:", error.message);
    
  }
};


export const triggerOffersDataSync = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("offersDataUpdated"));
  }
};


