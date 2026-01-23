import api from './api.js';

const OFFERS_DATA_KEY = 'homiebites_offers_data';

export const getOffersData = async () => {
  if (typeof window === 'undefined') {
    return [];
  }

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const CACHE_TIMESTAMP_KEY = 'homiebites_offers_data_timestamp';

  try {
    // Try to load from cache first for fast response
    try {
      const cachedData = localStorage.getItem(OFFERS_DATA_KEY);
      const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cachedData && cacheTimestamp) {
        const cacheAge = Date.now() - parseInt(cacheTimestamp, 10);
        
        // Use cache if it's less than 5 minutes old
        if (cacheAge < CACHE_DURATION) {
          try {
            const parsed = JSON.parse(cachedData);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const activeOffers = parsed.filter((offer) => {
                if (!offer.isActive) return false;
                if (offer.endDate && new Date(offer.endDate) < new Date()) return false;
                if (
                  !offer.title ||
                  offer.title.trim() === '' ||
                  offer.title.toLowerCase().includes('test') ||
                  offer.title.toLowerCase().includes('saved via')
                ) {
                  return false;
                }
                return true;
              });
              
              // Still fetch fresh data in background if cache is older than 1 minute
              if (cacheAge > 60 * 1000) {
                api.getOffers()
                  .then((response) => {
                    if (response.success && response.data && Array.isArray(response.data)) {
                      const activeOffers = response.data.filter((offer) => {
                        if (!offer.isActive) return false;
                        if (offer.endDate && new Date(offer.endDate) < new Date()) return false;
                        if (
                          !offer.title ||
                          offer.title.trim() === '' ||
                          offer.title.toLowerCase().includes('test') ||
                          offer.title.toLowerCase().includes('saved via')
                        ) {
                          return false;
                        }
                        return true;
                      });
                      localStorage.setItem(OFFERS_DATA_KEY, JSON.stringify(activeOffers));
                      localStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));
                    }
                  })
                  .catch(() => {
                    // Ignore background fetch errors
                  });
              }
              
              return activeOffers;
            }
          } catch (parseError) {
            // If cache parse fails, continue to API fetch
            if (process.env.NODE_ENV === 'development') {
              console.warn('[OffersData] Cache parse failed:', parseError);
            }
          }
        }
      }
    } catch (cacheError) {
      // If cache read fails, continue to API fetch
      if (process.env.NODE_ENV === 'development') {
        console.warn('[OffersData] Cache read failed:', cacheError);
      }
    }

    // Fetch fresh data from API
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
          if (offer.endDate && new Date(offer.endDate) < new Date()) return false;
          if (
            !offer.title ||
            offer.title.trim() === '' ||
            offer.title.toLowerCase().includes('test') ||
            offer.title.toLowerCase().includes('saved via')
          ) {
            return false;
          }
          return true;
        });

        // Save to cache with timestamp
        localStorage.setItem(OFFERS_DATA_KEY, JSON.stringify(activeOffers));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));
        return activeOffers;
      }
    } catch (apiError) {
      console.warn('API fetch failed, trying stale cache:', apiError.message);
      
      // Try to use stale cache as fallback (up to 1 hour old)
      const cachedData = localStorage.getItem(OFFERS_DATA_KEY);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const activeOffers = parsed.filter((offer) => {
              if (!offer.isActive) return false;
              if (offer.endDate && new Date(offer.endDate) < new Date()) return false;
              if (
                !offer.title ||
                offer.title.trim() === '' ||
                offer.title.toLowerCase().includes('test') ||
                offer.title.toLowerCase().includes('saved via')
              ) {
                return false;
              }
              return true;
            });
            return activeOffers;
          }
        } catch (e) {
          console.warn('Error parsing cached offers data:', e);
        }
      }
    }

    return [];
  } catch (error) {
    console.error('Error accessing offers data:', error);
    return [];
  }
};

export const getOffersDataSync = () => {
  if (typeof window === 'undefined') {
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
              offer.title.trim() === '' ||
              offer.title.toLowerCase().includes('test') ||
              offer.title.toLowerCase().includes('saved via')
            ) {
              return false;
            }

            return true;
          });
          return activeOffers;
        }
      } catch (e) {
        console.warn('Error parsing offers data from localStorage:', e);
      }
    }

    return [];
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return [];
  }
};

export const saveOffersData = async (data) => {
  localStorage.setItem(OFFERS_DATA_KEY, JSON.stringify(data));

  try {
    const token = localStorage.getItem('homiebites_token');
    if (token) {
      await api.updateOffers(data);
    }
  } catch (error) {
    console.warn('Failed to sync offers to API, saved locally:', error.message);
  }
};

export const triggerOffersDataSync = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('offersDataUpdated'));
  }
};
