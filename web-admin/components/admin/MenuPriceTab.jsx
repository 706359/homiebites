import { useEffect, useMemo, useState } from 'react';
import api from '../../lib/api-admin.js';
import ConfirmModal from './ConfirmationModal.jsx';
import PremiumLoader from './PremiumLoader.jsx';
import { formatCurrency } from './utils/orderUtils.js';

const MenuPriceTab = ({ settings, showNotification, showConfirmation, loading = false }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]); // Store original category structure
  const [categories, setCategories] = useState(['Breakfast', 'Lunch', 'Dinner']);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price', 'category'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    isAvailable: true,
    imageUrl: '',
    category: '',
  });

  // Load menu items
  useEffect(() => {
    loadMenuItems();
  }, []);

  // Ensure default categories are always available
  useEffect(() => {
    const defaultCategories = ['Breakfast', 'Lunch', 'Dinner'];
    if (categories.length === 0 || !categories.includes('Breakfast') || !categories.includes('Dinner')) {
      console.log('[Categories] Ensuring default categories are present. Current:', categories);
      const merged = [...new Set([...defaultCategories, ...categories])];
      setCategories(merged);
    }
  }, [categories]);

  const loadMenuItems = async () => {
    setLoadingMenu(true);
    try {
      // Load menu categories from backend
      const response = await api.getMenu();

      console.log('[Menu Load] Backend response:', {
        success: response?.success,
        hasData: !!response?.data,
        isArray: Array.isArray(response?.data),
        dataLength: response?.data?.length || 0,
      });

      if (response.success && response.data && Array.isArray(response.data)) {
        const totalItems = response.data.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
        console.log('[Menu Load] Loaded categories:', {
          categoriesCount: response.data.length,
          totalItems: totalItems,
          categoriesDetail: response.data.map((cat) => ({
            category: cat.category,
            itemsCount: cat.items?.length || 0,
            itemNames: cat.items?.map((i) => i.name) || [],
          })),
        });

        // Store original categories structure for preserving metadata
        setOriginalCategories(response.data);

        // Flatten categories into individual items with category info
        const flattenedItems = [];
        response.data.forEach((category) => {
          if (category.items && Array.isArray(category.items)) {
            category.items.forEach((item) => {
              flattenedItems.push({
                ...item,
                category: category.category || item.category || 'Lunch',
                categoryId: category.id,
                categoryIcon: category.icon,
                categoryTag: category.tag,
                categoryDescription: category.description,
              });
            });
          }
        });

        console.log('[Menu Load] Flattened items:', {
          itemsCount: flattenedItems.length,
          categories: [...new Set(flattenedItems.map((item) => item.category))],
        });

        setMenuItems(flattenedItems);

        // Default categories that should always be available
        const defaultCategories = ['Breakfast', 'Lunch', 'Dinner'];
        
        // Extract unique categories from loaded items
        const uniqueCategories = [...new Set(flattenedItems.map((item) => item.category))];
        
        console.log('[Menu Load] Category processing:', {
          defaultCategories,
          uniqueCategoriesFromItems: uniqueCategories,
        });
        
        // Merge default categories with categories found in database
        // This ensures default categories are always available even if no items use them yet
        const allCategories = [...new Set([...defaultCategories, ...uniqueCategories])];
        
        console.log('[Menu Load] Final categories to set:', allCategories);
        
        // Always set to merged categories (defaults + found in DB)
        console.log('[Menu Load] Setting categories to:', allCategories);
        setCategories(allCategories);
      } else {
        console.warn('[Menu Load] Invalid response structure:', response);
        setMenuItems([]);
        setOriginalCategories([]);
        // Even on error, keep default categories
        setCategories(['Breakfast', 'Lunch', 'Dinner']);
      }
    } catch (error) {
      console.error('[Menu Load] Error loading menu items:', error);
      setMenuItems([]);
      // Even on error, keep default categories
      setCategories(['Breakfast', 'Lunch', 'Dinner']);
    } finally {
      setLoadingMenu(false);
    }
  };

  // Convert flat items array back to categories structure for saving
  const convertItemsToCategories = (items) => {
    const categoriesMap = {};

    // First, preserve original category structure
    if (originalCategories && originalCategories.length > 0) {
      originalCategories.forEach((originalCategory) => {
        const categoryName = originalCategory.category;
        if (categoryName) {
          categoriesMap[categoryName] = {
            id: originalCategory.id,
            category: originalCategory.category,
            icon: originalCategory.icon || 'fa-utensils',
            tag: originalCategory.tag || '',
            description: originalCategory.description || '',
            items: [],
          };
        }
      });
    }

    // Then, add items to their categories (use first available category or default "Lunch" if no category)
    items.forEach((item) => {
      // If item has no category, assign to first available category from existing categories or default to 'Lunch'
      let categoryName = item.category;
      if (!categoryName || categoryName.trim() === '') {
        // Try to get first category from existing categories map, or from state, or default
        const existingCategoryNames = Object.keys(categoriesMap);
        if (existingCategoryNames.length > 0) {
          categoryName = existingCategoryNames[0];
        } else if (categories.length > 0) {
          categoryName = categories[0];
        } else {
          categoryName = 'Lunch'; // Default to 'Lunch' as it's the most common
        }
        console.log('[Convert Categories] Assigned category to item:', {
          itemName: item.name,
          assignedCategory: categoryName,
        });
      }

      if (!categoriesMap[categoryName]) {
        // Create new category if it doesn't exist
        // Try to find category info from existing items in the same category
        const existingItemInCategory = items.find(
          (i) => i.category === categoryName && i.categoryId
        );

        categoriesMap[categoryName] = {
          id: existingItemInCategory?.categoryId || item.categoryId || Date.now(),
          category: categoryName,
          icon: existingItemInCategory?.categoryIcon || item.categoryIcon || 'fa-utensils',
          tag: existingItemInCategory?.categoryTag || item.categoryTag || '',
          description:
            existingItemInCategory?.categoryDescription || item.categoryDescription || '',
          items: [],
        };
      }

      // Remove category metadata before adding to items array
      const { category, categoryId, categoryIcon, categoryTag, categoryDescription, ...itemData } =
        item;
      categoriesMap[categoryName].items.push(itemData);
    });

    const result = Object.values(categoriesMap);
    const totalItems = result.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);

    console.log('[Convert Categories] Converted to categories:', {
      categoriesCount: result.length,
      totalItems: totalItems,
      categories: result.map((cat) => ({
        name: cat.category,
        itemsCount: cat.items?.length || 0,
      })),
    });

    // Filter out empty categories before returning
    const categoriesWithItems = result.filter((cat) => cat.items && cat.items.length > 0);

    if (categoriesWithItems.length === 0) {
      console.error('[Convert Categories] Error: No categories with items found after conversion');
      throw new Error('No menu items found. Please add at least one menu item.');
    }

    return categoriesWithItems;
  };

  // Available images in public folder - same as Gallery component
  const publicImages = [
    'Amritsarichhole.png',
    'Curd.jpg',
    'DeliciousAaluParatha.jpg',
    'DesiThali.jpeg',
    'food.jpeg',
    'FullTiffin.jpg',
    'hero.jpeg',
    'kadhipakora.jpg',
    'kalachana.jpg',
    'lobhiya.jpg',
    'lokikofte.jpg',
    'MoondDalKhichdi.jpg',
    'rajma.jpg',
    'RotiSabji.png',
    'veg-thali.png',
    'VegThali.png',
  ];

  // Convert item name to image filename format
  const normalizeName = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  };

  // Find matching image from public folder based on item name
  const findImageByName = (itemName) => {
    if (!itemName) return '/food.jpeg';
    
    const normalizedName = normalizeName(itemName);
    
    // Check for common food name variations first (more specific)
    const commonMatches = {
      'chhole': 'Amritsarichhole.png',
      'chole': 'Amritsarichhole.png',
      'chana': 'kalachana.jpg',
      'dal': 'MoondDalKhichdi.jpg',
      'khichdi': 'MoondDalKhichdi.jpg',
      'paratha': 'DeliciousAaluParatha.jpg',
      'aloo': 'DeliciousAaluParatha.jpg',
      'thali': 'DesiThali.jpeg',
      'rajma': 'rajma.jpg',
      'roti': 'RotiSabji.png',
      'sabji': 'RotiSabji.png',
      'pakora': 'kadhipakora.jpg',
      'kadhi': 'kadhipakora.jpg',
      'lobhiya': 'lobhiya.jpg',
      'kofta': 'lokikofte.jpg',
      'koofte': 'lokikofte.jpg',
      'curd': 'Curd.jpg',
      'dahi': 'Curd.jpg',
      'tiffin': 'FullTiffin.jpg',
      'full': 'FullTiffin.jpg',
    };
    
    for (const [key, imageFile] of Object.entries(commonMatches)) {
      if (normalizedName.includes(key)) {
        return '/' + imageFile;
      }
    }
    
    // Try to find exact or partial match
    for (const image of publicImages) {
      const imageName = normalizeName(image.replace(/\.(jpg|jpeg|png)$/i, ''));
      if (imageName.includes(normalizedName) || normalizedName.includes(imageName)) {
        return '/' + image;
      }
    }
    
    return '/food.jpeg'; // Default fallback
  };

  // Get image URL for an item - auto-generates if not provided
  const getItemImageUrl = (item) => {
    // If imageUrl is explicitly provided, use it
    if (item.imageUrl && item.imageUrl.trim() !== '') {
      const imageUrl = item.imageUrl.trim();
      if (imageUrl.startsWith('/')) {
        return imageUrl;
      } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
      } else {
        return '/' + imageUrl;
      }
    }
    
    // Auto-generate from item name
    return findImageByName(item.name);
  };

  // Sync menu items with images to gallery
  // This automatically syncs menu items to the website gallery
  // Only items with both imageUrl and price are synced
  // Items appear on the website gallery immediately after sync
  const syncMenuItemsToGallery = async (items, showNotification = null) => {
    try {
      console.log('[Gallery Sync] Starting sync for', items.length, 'menu items');
      
      // Get current gallery items
      let galleryResponse;
      try {
        galleryResponse = await api.getGallery();
        console.log('[Gallery Sync] Fetched', galleryResponse?.data?.length || 0, 'existing gallery items');
      } catch (error) {
        console.error('[Gallery Sync] Error fetching gallery:', error);
        throw new Error('Failed to fetch gallery: ' + (error.message || 'Unknown error'));
      }

      const existingGalleryItems =
        galleryResponse.success && galleryResponse.data ? galleryResponse.data : [];

      // Use provided imageUrl if available, otherwise auto-generate from item name
      const itemsToSync = items
        .map((item) => {
          // If user provided imageUrl, use it (normalize it first)
          let finalImageUrl = item.imageUrl;
          if (finalImageUrl && finalImageUrl.trim() !== '') {
            // User provided an image URL - normalize it
            finalImageUrl = finalImageUrl.trim();
            if (!finalImageUrl.startsWith('/') && !finalImageUrl.startsWith('http://') && !finalImageUrl.startsWith('https://')) {
              finalImageUrl = '/' + finalImageUrl;
            }
          } else {
            // No imageUrl provided - auto-generate from item name
            finalImageUrl = getItemImageUrl(item);
          }
          
          return {
            ...item,
            imageUrl: finalImageUrl,
          };
        })
        .filter((item) => {
          const hasImage = item.imageUrl && item.imageUrl.trim() !== '';
          const hasPrice = item.price && item.price > 0;
          const isAvailable = item.isAvailable !== false;
          return hasImage && hasPrice && isAvailable;
        });

      console.log('[Gallery Sync] Filtering items for gallery:', {
        totalItems: items.length,
        itemsWithImageAndPrice: itemsToSync.length,
        itemsToSync: itemsToSync.map((i) => ({
          name: i.name,
          imageUrl: i.imageUrl, // User provided or auto-generated from name
          price: i.price,
        })),
      });

      if (itemsToSync.length === 0) {
        console.warn(
          '[Gallery Sync] No items to sync - items need imageUrl and price to appear in gallery'
        );
      }

      // Create/update gallery items for each menu item
      let created = 0;
      let updated = 0;

      for (const item of itemsToSync) {
        // ImageUrl is already normalized in the map step above
        const finalImageUrl = item.imageUrl;
        
        console.log('[Gallery Sync] Syncing item:', {
          name: item.name,
          originalImageUrl: item.imageUrl,
          finalImageUrl: finalImageUrl,
          wasAutoGenerated: !item.imageUrl || item.imageUrl.trim() === '' ? 'Yes (from name)' : 'No (user provided)',
        });
        
        // Default details for all items
        const defaultDetails = [
          'Dry Sabji',
          'Gravy Sabji',
          '4 Roti (6 without Rice)',
          'Rice'
        ];

        const galleryItemData = {
          name: item.name,
          imageUrl: finalImageUrl, // Use the normalized imageUrl (user provided or auto-generated)
          alt: item.name,
          caption: item.price ? `${item.name} - ₹${item.price}` : item.name,
          price: item.price,
          category: item.category || 'Menu',
          details: defaultDetails, // Add default details for hover display
          order: item.order || 0,
          isActive: item.isAvailable !== false,
        };

        // Check if gallery item already exists (by name)
        const existingItem = existingGalleryItems.find((gi) => gi.name === item.name);

        if (existingItem) {
          // Update existing gallery item
          try {
            const updateResponse = await api.updateGalleryItem(
              existingItem._id || existingItem.id,
              galleryItemData
            );
            updated++;
            console.log('[Gallery Sync] Updated gallery item:', item.name);
          } catch (error) {
            console.error('[Gallery Sync] Error updating gallery item', item.name, ':', error);
            throw error;
          }
        } else {
          // Create new gallery item
          try {
            const createResponse = await api.createGalleryItem(galleryItemData);
            created++;
            console.log(
              '[Gallery Sync] Created gallery item:',
              item.name,
              '- Now visible on website gallery'
            );
          } catch (error) {
            console.error('[Gallery Sync] Error creating gallery item', item.name, ':', error);
            throw error;
          }
        }
      }

      // Deactivate gallery items that are no longer in menu or don't have images/prices
      const menuItemNames = new Set(itemsToSync.map((item) => item.name));

      let deactivated = 0;
      for (const galleryItem of existingGalleryItems) {
        if (!menuItemNames.has(galleryItem.name) && galleryItem.isActive) {
          await api.updateGalleryItem(galleryItem._id || galleryItem.id, { isActive: false });
          deactivated++;
        }
      }

      console.log('[Gallery Sync] Sync complete:', {
        created,
        updated,
        deactivated,
        totalActive: created + updated,
      });

      // Trigger immediate refresh on gallery page (if open)
      try {
        // Dispatch custom event for gallery to refresh immediately
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('gallery-updated'));
          
          // Also update localStorage timestamp for cross-tab communication
          localStorage.setItem('gallery-last-update', Date.now().toString());
          
          console.log('[Gallery Sync] Triggered gallery refresh event');
        }
      } catch (e) {
        console.warn('[Gallery Sync] Could not trigger refresh event:', e);
      }

      // Show notification if explicitly requested (for manual sync)
      if (showNotification && (created > 0 || updated > 0)) {
        showNotification(
          `Gallery sync complete: ${created} created, ${updated} updated. Items should now appear on website.`,
          'success'
        );
      }

      // Sync complete - don't show notification here by default, it will be shown in saveMenuItemsToBackend
      // Gallery sync happens automatically and silently
    } catch (error) {
      console.error('[Gallery Sync] Error syncing menu items to gallery:', error);
      if (showNotification) {
        showNotification(
          'Error syncing to gallery: ' + (error.message || 'Unknown error'),
          'error'
        );
      }
      // Don't throw error - gallery sync is optional, but log it
    }
  };

  const saveMenuItemsToBackend = async (items) => {
    try {
      if (!items || !Array.isArray(items)) {
        throw new Error('Invalid menu items data');
      }

      if (items.length === 0) {
        console.warn('[Menu Save] Attempting to save empty menu items array');
        if (showNotification) {
          showNotification('Cannot save empty menu. Please add at least one menu item.', 'error');
        }
        throw new Error('Cannot save empty menu. Please add at least one menu item.');
      }

      const categories = convertItemsToCategories(items);

      // Validate that we have items to save
      const totalItemsInCategories = categories.reduce(
        (sum, cat) => sum + (cat.items?.length || 0),
        0
      );
      if (totalItemsInCategories === 0) {
        console.warn('[Menu Save] Warning: No items to save after conversion');
        throw new Error('No menu items to save. Please add at least one menu item.');
      }

      // Log full structure for debugging
      console.log('[Menu Save] Full categories structure:', JSON.stringify(categories, null, 2));
      console.log('[Menu Save] Sending categories to backend:', {
        categoriesCount: categories.length,
        itemsCount: items.length,
        totalItemsInCategories: totalItemsInCategories,
        categoriesStructure: categories.map((cat) => ({
          category: cat.category,
          itemsCount: cat.items?.length || 0,
          allItemNames: cat.items?.map((i) => i.name) || [],
        })),
      });

      const response = await api.updateMenu(categories);
      console.log('[Menu Save] Backend response:', {
        success: response?.success,
        dataLength: response?.data?.length || 0,
        error: response?.error,
      });

      if (!response) {
        console.error('[Menu Save] No response from server');
        throw new Error('No response from server');
      }

      if (response.success !== true) {
        const errorMsg = response?.error || 'Failed to save menu';
        console.error('[Menu Save] Backend returned error:', errorMsg);
        console.error('[Menu Save] Full error response:', response);
        throw new Error(errorMsg);
      }

      if (!response.data || !Array.isArray(response.data)) {
        console.warn('[Menu Save] Backend response missing valid data:', response);
        // Don't throw error here, but log it - the save might still have succeeded
      } else {
        console.log('[Menu Save] Successfully saved menu with', response.data.length, 'categories');
      }

      // Automatically sync menu items to gallery (items with images will appear on website)
      console.log('[Menu Save] Starting gallery sync for', items.length, 'items...');
      try {
        await syncMenuItemsToGallery(items, null); // Don't show notification here, will show in main success message
        console.log('[Menu Save] Gallery sync completed - items should now be visible on website');
      } catch (syncError) {
        console.error('[Menu Save] Gallery sync failed:', syncError);
        // Don't fail the entire save if gallery sync fails
        showNotification(
          'Menu saved, but gallery sync failed: ' + (syncError.message || 'Unknown error'),
          'warning'
        );
      }

      // Reload menu items from backend to ensure UI is in sync
      console.log('[Menu Save] Reloading menu items after save...');
      try {
        await loadMenuItems();
        console.log('[Menu Save] Menu items reloaded successfully');

        // Verify items were loaded
        const reloadedResponse = await api.getMenu();
        if (reloadedResponse.success && reloadedResponse.data) {
          const totalLoadedItems = reloadedResponse.data.reduce(
            (sum, cat) => sum + (cat.items?.length || 0),
            0
          );
          console.log('[Menu Save] Verification - Total items in database:', totalLoadedItems);

          if (totalLoadedItems === 0) {
            console.error('[Menu Save] WARNING: Items were saved but database shows 0 items!');
            if (showNotification) {
              showNotification(
                'Warning: Items may not have saved correctly. Please check the database.',
                'error'
              );
            }
          }
        }
      } catch (reloadError) {
        console.error('[Menu Save] Error reloading menu items:', reloadError);
        // Don't throw - save might have succeeded even if reload failed
      }

      // Show single notification for save operation
      if (showNotification) {
        showNotification('Menu saved successfully', 'success');
      }

      return true;
    } catch (error) {
      console.error('[Menu Save] Error saving menu to backend:', error);
      console.error('[Menu Save] Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      if (showNotification) {
        showNotification('Error saving menu: ' + (error.message || 'Unknown error'), 'error');
      }
      throw error;
    }
  };

  // Filtered and sorted menu items
  const filteredMenuItems = useMemo(() => {
    let filtered = [...menuItems];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filterCategory) {
      filtered = filtered.filter((item) => item.category === filterCategory);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'price':
          aVal = parseFloat(a.price || 0);
          bVal = parseFloat(b.price || 0);
          break;
        case 'category':
          aVal = (a.category || '').toLowerCase();
          bVal = (b.category || '').toLowerCase();
          break;
        default: // 'name'
          aVal = (a.name || '').toLowerCase();
          bVal = (b.name || '').toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    return filtered;
  }, [menuItems, searchQuery, filterCategory, sortBy, sortOrder]);

  // Handle add item
  const handleAddItem = async () => {
    if (!formData.name.trim() || !formData.price || formData.price <= 0) {
      if (showNotification) {
        showNotification('Please fill in all required fields', 'error');
      }
      return;
    }

    const performAdd = async () => {
      try {
        // Determine category - use first available category or default to 'Lunch' (most common)
        let itemCategory = 'Breakfast'; // Default category
        if (categories.length > 0) {
          itemCategory = categories[0];
        } else if (menuItems.length > 0 && menuItems[0].category) {
          // Use category from existing items
          itemCategory = menuItems[0].category;
        }

        const newItem = {
          id: Date.now(),
          name: formData.name.trim(),
          description: formData.description || '',
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl || '',
          isAvailable: formData.isAvailable !== false,
          category: formData.category || itemCategory, // Use form category if provided, otherwise use default
        };

        console.log('[Add Item] New item created:', {
          name: newItem.name,
          category: newItem.category,
          price: newItem.price,
        });

        const updatedItems = [...menuItems, newItem];
        
        // Save to backend FIRST (before updating local state) to ensure consistency
        console.log('[Add Item] Saving new item to backend:', {
          itemName: newItem.name,
          category: newItem.category,
          price: newItem.price,
          totalItemsBefore: menuItems.length,
          totalItemsAfter: updatedItems.length,
          allItemsBefore: menuItems.map((i) => ({ name: i.name, id: i.id })),
          allItemsAfter: updatedItems.map((i) => ({ name: i.name, id: i.id })),
        });

        try {
          await saveMenuItemsToBackend(updatedItems);
          console.log('[Add Item] Successfully saved to backend, now reloading from backend...');
          
          // Reload from backend to ensure we have the latest data and sync with database
          await loadMenuItems();
          console.log('[Add Item] Reloaded menu items from backend - should now be in sync');
        } catch (error) {
          console.error('[Add Item] Failed to save to backend:', error);
          // Reload anyway to sync with backend (might have partial save)
          try {
            await loadMenuItems();
          } catch (reloadError) {
            console.error('[Add Item] Failed to reload after error:', reloadError);
          }
          throw error;
        }

        setShowAddModal(false);
              setFormData({
                name: '',
                description: '',
                price: 0,
                isAvailable: true,
                imageUrl: '',
                category: '',
              });

        // Notification is already shown in saveMenuItemsToBackend, no need to show again
      } catch (error) {
        console.error('Error adding menu item:', error);
        if (showNotification) {
          showNotification('Error adding menu item', 'error');
        }
      }
    };

    if (showConfirmation) {
      showConfirmation({
        title: 'Add Menu Item',
        message: `Are you sure you want to add "${formData.name.trim()}" to the menu?`,
        type: 'info',
        confirmText: 'Add Item',
        onConfirm: performAdd,
      });
    } else {
      await performAdd();
    }
  };

  // Handle edit item
  const handleEditItem = async () => {
    if (!formData.name.trim() || !formData.price || formData.price <= 0) {
      if (showNotification) {
        showNotification('Please fill in all required fields', 'error');
      }
      return;
    }

    const performUpdate = async () => {
      try {
        const updatedItem = {
          ...selectedItem,
          name: formData.name.trim(),
          description: formData.description || '',
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl || '',
          isAvailable: formData.isAvailable !== false,
          category: formData.category || selectedItem.category || '', // Use form category if provided, otherwise preserve existing
        };

        const updatedItems = menuItems.map((item) =>
          item.id === selectedItem.id ? updatedItem : item
        );

        console.log('[Edit Item] Updating item:', {
          itemId: selectedItem.id,
          itemName: updatedItem.name,
          totalItems: updatedItems.length,
          allItems: updatedItems.map((i) => ({ name: i.name, id: i.id })),
        });

        // Save to backend FIRST
        await saveMenuItemsToBackend(updatedItems);
        
        // Reload from backend to ensure we have the latest data
        await loadMenuItems();

        setShowEditModal(false);
        setSelectedItem(null);
              setFormData({
                name: '',
                description: '',
                price: 0,
                isAvailable: true,
                imageUrl: '',
                category: '',
              });

        // Notification is already shown in saveMenuItemsToBackend, no need to show again
      } catch (error) {
        console.error('Error updating menu item:', error);
        if (showNotification) {
          showNotification('Error updating menu item', 'error');
        }
      }
    };

    if (showConfirmation) {
      showConfirmation({
        title: 'Update Menu Item',
        message: `Are you sure you want to save changes to "${formData.name.trim()}"?`,
        type: 'info',
        confirmText: 'Save Changes',
        onConfirm: performUpdate,
      });
    } else {
      await performUpdate();
    }
  };

  // Handle delete item
  const handleDeleteItem = async () => {
    try {
      const updatedItems = menuItems.filter((item) => item.id !== selectedItem.id);
      
      console.log('[Delete Item] Deleting item:', {
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        totalItemsBefore: menuItems.length,
        totalItemsAfter: updatedItems.length,
        remainingItems: updatedItems.map((i) => ({ name: i.name, id: i.id })),
      });

      // Save to backend FIRST
      await saveMenuItemsToBackend(updatedItems);
      
      // Reload from backend to ensure we have the latest data
      await loadMenuItems();

      setShowDeleteModal(false);
      setSelectedItem(null);

      // Notification is already shown in saveMenuItemsToBackend, no need to show again
    } catch (error) {
      console.error('Error deleting menu item:', error);
      if (showNotification) {
        showNotification('Error deleting menu item', 'error');
      }
    }
  };

  // Handle toggle availability
  const handleToggleAvailability = async (item) => {
    try {
      const updatedItem = { ...item, isAvailable: !item.isAvailable };
      const updatedItems = menuItems.map((i) => (i.id === item.id ? updatedItem : i));

      // Save to backend FIRST
      await saveMenuItemsToBackend(updatedItems);
      
      // Reload from backend to ensure we have the latest data
      await loadMenuItems();

      // Notification is already shown in saveMenuItemsToBackend, no need to show again
    } catch (error) {
      console.error('Error toggling availability:', error);
      if (showNotification) {
        showNotification('Error updating item', 'error');
      }
    }
  };

  // Open edit modal
  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || 0,
      isAvailable: item.isAvailable !== false,
      imageUrl: item.imageUrl || '',
      category: item.category || '',
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  if (loading || loadingMenu) {
    return (
      <div className='admin-content'>
        <PremiumLoader message='Loading menu...' size='large' />
      </div>
    );
  }

  return (
    <div className='admin-content'>
      {/* HEADER */}
      <div className='dashboard-header'>
        <div className='action-buttons-group'>
          <button
            className='btn btn-primary btn-small'
            onClick={() => {
              // Initialize form when opening add modal
              setFormData({
                name: '',
                description: '',
                price: 0,
                isAvailable: true,
                imageUrl: '',
                category: '',
              });
              setShowAddModal(true);
            }}
          >
            <i className='fa-solid fa-plus'></i> Add Menu Item
          </button>
          {menuItems.length > 0 && (
            <button
              className='btn btn-danger btn-small'
              onClick={async () => {
                if (showConfirmation) {
                  showConfirmation({
                    title: 'Clear All Menu Items',
                    message:
                      'Are you sure you want to delete all menu items? This will also remove the default menu record from the database. This action cannot be undone.',
                    type: 'warning',
                    confirmText: 'Delete All',
                    onConfirm: async () => {
                      try {
                        // Delete the menu record from database
                        await api.deleteMenu();
                        // Clear local state
                        setMenuItems([]);
                        setOriginalCategories([]);
                        if (showNotification) {
                          showNotification(
                            'All menu items and default record deleted successfully',
                            'success'
                          );
                        }
                      } catch (error) {
                        console.error('Error deleting menu:', error);
                        if (showNotification) {
                          showNotification(
                            'Error deleting menu: ' + (error.message || 'Unknown error'),
                            'error'
                          );
                        }
                      }
                    },
                  });
                }
              }}
              title='Delete all menu items and remove default record from database'
            >
              <i className='fa-solid fa-trash'></i> Clear All
            </button>
          )}
          <button
            className='btn btn-secondary btn-small'
            onClick={async () => {
              // Manual sync to gallery
              try {
                showNotification('Syncing menu items to gallery...', 'info');
                await syncMenuItemsToGallery(menuItems, showNotification);
              } catch (error) {
                console.error('[Manual Sync] Error:', error);
                showNotification('Gallery sync failed: ' + (error.message || 'Unknown error'), 'error');
              }
            }}
            title='Sync all menu items with images to website gallery'
          >
            <i className='fa-solid fa-sync-alt'></i> Sync to Gallery
          </button>
        </div>
      </div>

      {/* FILTER & ACTION BAR */}
      <div className='dashboard-card dashboard-card-spaced'>
        <div className='filter-container'>
          <div className='search-input-wrapper search-input-wrapper-flex'>
            <i className='fa-solid fa-search search-input-icon'></i>
            <input
              type='text'
              className='input-field search-input-with-icon'
              placeholder='Search menu items...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='filter-field-group-standard min-width-140'>
            <label className='filter-label-standard'>Category</label>
            <select
              className='input-field filter-input-standard'
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value=''>All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className='filter-field-group-standard min-width-160'>
            <label className='filter-label-standard'>Sort By</label>
            <select
              className='input-field filter-input-standard'
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by);
                setSortOrder(order);
              }}
            >
              <option value='name-asc'>Name (A-Z)</option>
              <option value='name-desc'>Name (Z-A)</option>
              <option value='price-asc'>Price (Low to High)</option>
              <option value='price-desc'>Price (High to Low)</option>
              <option value='category-asc'>Category (A-Z)</option>
              <option value='category-desc'>Category (Z-A)</option>
            </select>
          </div>
          {(searchQuery || filterCategory) && (
            <button
              className='btn btn-ghost btn-small'
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('');
              }}
              style={{ fontSize: '13px', padding: '10px 16px' }}
            >
              <i className='fa-solid fa-xmark' style={{ marginRight: '6px' }}></i>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* MENU ITEMS GRID */}
      {filteredMenuItems.length === 0 ? (
        <div className='dashboard-card' style={{ textAlign: 'center', padding: '48px' }}>
          <i
            className='fa-solid fa-utensils'
            style={{ fontSize: '64px', color: 'var(--admin-text-light)', marginBottom: '16px' }}
          ></i>
          <h3 style={{ color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>
            No Menu Items
          </h3>
          <p className='margin-bottom-24' style={{ color: 'var(--admin-text-light)' }}>
            {searchQuery || filterCategory
              ? 'No items match your filters'
              : 'Get started by adding your first menu item'}
          </p>
          {!searchQuery && !filterCategory && (
            <button
              className='btn btn-primary'
              onClick={() => {
                // Initialize form with default category when opening add modal
                setFormData({
                  name: '',
                  description: '',
                  price: 0,
                  isAvailable: true,
                  imageUrl: '',
                  category: '', // Start with empty, user can select
                });
                setShowAddModal(true);
              }}
            >
              <i className='fa-solid fa-plus'></i> Add Menu Item
            </button>
          )}
        </div>
      ) : (
        <div className='dashboard-grid-layout menu-items-grid'>
          {filteredMenuItems.map((item, index) => (
            <div
              key={`${item.id}-${item.name}-${index}`}
              className='dashboard-card menu-item-card'
              style={{ position: 'relative', animationDelay: `${index * 0.05}s` }}
            >
              {/* Item Image */}
              {item.imageUrl && item.imageUrl.trim() !== '' ? (
                <div
                  style={{
                    width: '100%',
                    height: '200px',
                    marginBottom: '16px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'var(--admin-glass-border)',
                    position: 'relative',
                  }}
                >
                  <img
                    src={(() => {
                      // Available images in public folder
                      const publicImages = [
                        'Amritsarichhole.png',
                        'Curd.jpg',
                        'DeliciousAaluParatha.jpg',
                        'DesiThali.jpeg',
                        'food.jpeg',
                        'FullTiffin.jpg',
                        'hero.jpeg',
                        'kadhipakora.jpg',
                        'kalachana.jpg',
                        'lobhiya.jpg',
                        'lokikofte.jpg',
                        'MoondDalKhichdi.jpg',
                        'rajma.jpg',
                        'RotiSabji.png',
                        'veg-thali.png',
                        'VegThali.png',
                      ];

                      // Convert item name to image filename format
                      const normalizeName = (name) => {
                        return name
                          .toLowerCase()
                          .replace(/\s+/g, '')
                          .replace(/[^a-z0-9]/g, '')
                          .trim();
                      };

                      // Find matching image from public folder based on item name
                      const findImageByName = (itemName) => {
                        if (!itemName) return '/food.jpeg';
                        const normalizedName = normalizeName(itemName);
                        
                        // Check for common food name variations first (more specific)
                        const commonMatches = {
                          'chhole': 'Amritsarichhole.png',
                          'chole': 'Amritsarichhole.png',
                          'chana': 'kalachana.jpg',
                          'dal': 'MoondDalKhichdi.jpg',
                          'khichdi': 'MoondDalKhichdi.jpg',
                          'paratha': 'DeliciousAaluParatha.jpg',
                          'aloo': 'DeliciousAaluParatha.jpg',
                          'thali': 'DesiThali.jpeg',
                          'rajma': 'rajma.jpg',
                          'roti': 'RotiSabji.png',
                          'sabji': 'RotiSabji.png',
                          'pakora': 'kadhipakora.jpg',
                          'kadhi': 'kadhipakora.jpg',
                          'lobhiya': 'lobhiya.jpg',
                          'kofta': 'lokikofte.jpg',
                          'koofte': 'lokikofte.jpg',
                          'curd': 'Curd.jpg',
                          'dahi': 'Curd.jpg',
                          'tiffin': 'FullTiffin.jpg',
                          'full': 'FullTiffin.jpg',
                        };
                        
                        for (const [key, imageFile] of Object.entries(commonMatches)) {
                          if (normalizedName.includes(key)) {
                            return '/' + imageFile;
                          }
                        }
                        
                        // Try to find exact or partial match
                        for (const image of publicImages) {
                          const imageName = normalizeName(image.replace(/\.(jpg|jpeg|png)$/i, ''));
                          if (imageName.includes(normalizedName) || normalizedName.includes(imageName)) {
                            return '/' + image;
                          }
                        }
                        
                        return '/food.jpeg'; // Default fallback
                      };

                      // If imageUrl is explicitly provided, use it
                      if (item.imageUrl && item.imageUrl.trim() !== '') {
                        const imageUrl = item.imageUrl.trim();
                        if (imageUrl.startsWith('/')) {
                          return imageUrl;
                        } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                          return imageUrl;
                        } else {
                          return '/' + imageUrl;
                        }
                      }
                      
                      // If no imageUrl, try to find matching image from public folder
                      const matchedImage = findImageByName(item.name);
                      if (matchedImage) {
                        return matchedImage;
                      }
                      
                      // Default placeholder
                      return '/food.jpeg';
                    })()}
                    alt={item.name || 'Menu item'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    onError={(e) => {
                      // Fallback to placeholder from public folder if image fails to load
                      console.warn('[Menu Item Image] Failed to load:', e.target.src, '- Using fallback');
                      const fallback = '/food.jpeg';
                      if (e.target.src !== fallback && !e.target.src.includes(fallback)) {
                        e.target.src = fallback;
                      }
                    }}
                    loading='lazy'
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '200px',
                    marginBottom: '16px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'var(--admin-glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--admin-text-light)',
                  }}
                >
                  <i className='fa-solid fa-image' style={{ fontSize: '48px', opacity: 0.3 }}></i>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '12px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '4px', fontSize: '18px', fontWeight: '600' }}>
                    {item.name}
                  </h3>
                  <div
                    className='badge'
                    style={{
                      background:
                        item.category === 'Lunch'
                          ? 'var(--admin-accent-light)'
                          : item.category === 'Dinner'
                            ? 'var(--admin-secondary-light)'
                            : 'var(--admin-glass-border)',
                      color:
                        item.category === 'Lunch'
                          ? 'var(--admin-accent)'
                          : item.category === 'Dinner'
                            ? 'var(--admin-secondary)'
                            : 'var(--admin-text-secondary)',
                      fontSize: '12px',
                      padding: '4px 8px',
                    }}
                  >
                    {item.category}
                  </div>
                </div>
                <div
                  className='badge'
                  style={{
                    background: item.isAvailable
                      ? 'var(--admin-success-light)'
                      : 'var(--admin-danger-light)',
                    color: item.isAvailable ? 'var(--admin-success)' : 'var(--admin-danger)',
                    fontSize: '11px',
                    padding: '4px 8px',
                  }}
                >
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </div>
              </div>

              {item.description && (
                <p
                  style={{
                    color: 'var(--admin-text-secondary)',
                    fontSize: '14px',
                    marginBottom: '12px',
                    lineHeight: '1.5',
                  }}
                >
                  {item.description}
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--admin-border)',
                }}
              >
                <div>
                  <div
                    style={{ fontSize: '24px', fontWeight: '700', color: 'var(--admin-accent)' }}
                  >
                    {formatCurrency(item.price || 0)}
                  </div>
                </div>
                <div className='action-buttons-group' style={{ gap: '8px' }}>
                  <button
                    className='action-button'
                    onClick={() => handleToggleAvailability(item)}
                    title={item.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                  >
                    <i className={`fa-solid ${item.isAvailable ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                  <button
                    className='action-button edit'
                    onClick={() => openEditModal(item)}
                    title='Edit'
                  >
                    <i className='fa-solid fa-pencil'></i>
                  </button>
                  <button
                    className='action-button delete'
                    onClick={() => openDeleteModal(item)}
                    title='Delete'
                  >
                    <i className='fa-solid fa-trash'></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className='modal-overlay'>
          <div className='modal-container' style={{ maxWidth: '540px' }}>
            <div className='modal-header' style={{ padding: '18px 24px' }}>
              <h2 style={{ fontSize: '20px', margin: 0 }}>Add Menu Item</h2>
              <button className='modal-close' onClick={() => setShowAddModal(false)}>
                <i className='fa-solid fa-times'></i>
              </button>
            </div>
            <div className='modal-body' style={{ padding: '20px 24px' }}>
              <div className='form-grid' style={{ gap: '16px' }}>
                <div className='form-group' style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label style={{ fontSize: '13px', marginBottom: '6px' }}>Item Name *</label>
                  <input
                    type='text'
                    className='input-field'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder='e.g., Lunch Combo'
                    required
                    style={{ padding: '10px 12px', fontSize: '14px' }}
                  />
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label style={{ fontSize: '13px', marginBottom: '6px' }}>Description</label>
                  <textarea
                    className='input-field'
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder='Item description...'
                    rows={2}
                    style={{ padding: '10px 12px', fontSize: '14px', resize: 'vertical' }}
                  />
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label style={{ fontSize: '13px', marginBottom: '6px' }}>Price (₹) *</label>
                  <input
                    type='number'
                    className='input-field'
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    }
                    placeholder='0.00'
                    min='0'
                    step='0.01'
                    required
                    style={{ padding: '10px 12px', fontSize: '14px' }}
                  />
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label style={{ fontSize: '13px', marginBottom: '6px' }}>
                    Category <span style={{ color: 'var(--admin-text-light)', fontWeight: 400, fontSize: '11px' }}>(Optional)</span>
                  </label>
                  <select
                    className='input-field'
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ padding: '10px 12px', fontSize: '14px' }}
                  >
                    <option value=''>Select Category</option>
                    {categories && categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value='Breakfast'>Breakfast</option>
                        <option value='Lunch'>Lunch</option>
                        <option value='Dinner'>Dinner</option>
                      </>
                    )}
                  </select>
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label style={{ fontSize: '13px', marginBottom: '6px' }}>
                    Image URL <span style={{ color: 'var(--admin-text-light)', fontWeight: 400, fontSize: '11px' }}>(Optional)</span>
                  </label>
                  <input
                    type='text'
                    className='input-field'
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder='/food.jpeg or https://example.com/image.jpg'
                    style={{ padding: '10px 12px', fontSize: '14px' }}
                  />
                  <small style={{ color: 'var(--admin-text-light)', fontSize: '11px', marginTop: '4px', display: 'block', lineHeight: '1.4' }}>
                    Use /filename.jpg for public folder, or full URL for external images
                  </small>
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1', marginBottom: 0, marginTop: '4px' }}>
                  <label
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', marginBottom: 0 }}
                  >
                    <input
                      type='checkbox'
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      style={{ margin: 0 }}
                    />
                    <span>Available for ordering</span>
                  </label>
                </div>
              </div>
            </div>
            <div className='modal-footer' style={{ padding: '16px 24px', gap: '10px' }}>
              <button className='btn btn-ghost' onClick={() => setShowAddModal(false)} style={{ padding: '10px 18px', fontSize: '14px' }}>
                Cancel
              </button>
              <button className='btn btn-primary' onClick={handleAddItem} style={{ padding: '10px 18px', fontSize: '14px' }}>
                <i className='fa-solid fa-plus'></i> Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedItem && (
        <div className='modal-overlay'>
          <div className='modal-container' style={{ maxWidth: '540px' }}>
            <div className='modal-header' style={{ padding: '18px 24px' }}>
              <h2 style={{ fontSize: '20px', margin: 0 }}>Edit Menu Item</h2>
              <button className='modal-close' onClick={() => setShowEditModal(false)}>
                <i className='fa-solid fa-times'></i>
              </button>
            </div>
            <div className='modal-body' style={{ padding: '20px 24px' }}>
              <div className='form-grid' style={{ gap: '16px' }}>
                <div className='form-group' style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label style={{ fontSize: '13px', marginBottom: '6px' }}>Item Name *</label>
                  <input
                    type='text'
                    className='input-field'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder='e.g., Lunch Combo'
                    required
                    style={{ padding: '10px 12px', fontSize: '14px' }}
                  />
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label style={{ fontSize: '13px', marginBottom: '6px' }}>Description</label>
                  <textarea
                    className='input-field'
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder='Item description...'
                    rows={2}
                    style={{ padding: '10px 12px', fontSize: '14px', resize: 'vertical' }}
                  />
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label style={{ fontSize: '13px', marginBottom: '6px' }}>Price (₹) *</label>
                  <input
                    type='number'
                    className='input-field'
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    }
                    placeholder='0.00'
                    min='0'
                    step='0.01'
                    required
                    style={{ padding: '10px 12px', fontSize: '14px' }}
                  />
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label style={{ fontSize: '13px', marginBottom: '6px' }}>
                    Category <span style={{ color: 'var(--admin-text-light)', fontWeight: 400, fontSize: '11px' }}>(Optional)</span>
                  </label>
                  <select
                    className='input-field'
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ padding: '10px 12px', fontSize: '14px' }}
                  >
                    <option value=''>Select Category</option>
                    {categories && categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value='Breakfast'>Breakfast</option>
                        <option value='Lunch'>Lunch</option>
                        <option value='Dinner'>Dinner</option>
                      </>
                    )}
                  </select>
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label style={{ fontSize: '13px', marginBottom: '6px' }}>
                    Image URL <span style={{ color: 'var(--admin-text-light)', fontWeight: 400, fontSize: '11px' }}>(Optional)</span>
                  </label>
                  <input
                    type='text'
                    className='input-field'
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder='Leave empty to auto-match, or enter /filename.jpg'
                    style={{ padding: '10px 12px', fontSize: '14px' }}
                  />
                  <small style={{ color: 'var(--admin-text-light)', fontSize: '11px', marginTop: '4px', display: 'block', lineHeight: '1.4' }}>
                    {formData.imageUrl ? (
                      <>Custom: {formData.imageUrl}</>
                    ) : (
                      <>Auto-matching: Finds image from public folder based on item name</>
                    )}
                  </small>
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1', marginBottom: 0, marginTop: '4px' }}>
                  <label
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', marginBottom: 0 }}
                  >
                    <input
                      type='checkbox'
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      style={{ margin: 0 }}
                    />
                    <span>Available for ordering</span>
                  </label>
                </div>
              </div>
            </div>
            <div className='modal-footer' style={{ padding: '16px 24px', gap: '10px' }}>
              <button className='btn btn-ghost' onClick={() => setShowEditModal(false)} style={{ padding: '10px 18px', fontSize: '14px' }}>
                Cancel
              </button>
              <button className='btn btn-primary' onClick={handleEditItem} style={{ padding: '10px 18px', fontSize: '14px' }}>
                <i className='fa-solid fa-save'></i> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && selectedItem && (
        <ConfirmModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteItem}
          title='Delete Menu Item'
          message={`Are you sure you want to delete "${selectedItem.name}"? This action cannot be undone.`}
          confirmText='Delete'
          confirmType='danger'
        />
      )}
    </div>
  );
};

export default MenuPriceTab;
