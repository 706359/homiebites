import { useEffect, useMemo, useState } from 'react';
import { useAutoKeyboardAvoidance } from '../../hooks/useKeyboardAvoidance.js';
import api from '../../lib/api-admin.js';
import { convertMenuItemsToCategories } from '../../lib/menuData.js';
import ConfirmModal from './ConfirmationModal.jsx';
import PremiumLoader from './PremiumLoader.jsx';
import { formatCurrency } from './utils/orderUtils.js';

const MenuPriceTab = ({ settings, showNotification, showConfirmation, loading = false }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [categories, setCategories] = useState(['Breakfast', 'Lunch', 'Dinner']);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useAutoKeyboardAvoidance({
    containerSelector: '.modal-container, .menu-price-tab',
    inputSelector: 'input, textarea, select',
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    isAvailable: true,
    imageUrl: '',
    category: '',
  });

  useEffect(() => {
    loadMenuItems();
  }, []);

  useEffect(() => {
    const defaultCategories = ['Breakfast', 'Lunch', 'Dinner'];
    if (
      categories.length === 0 ||
      !categories.includes('Breakfast') ||
      !categories.includes('Dinner')
    ) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Categories] Ensuring default categories are present. Current:', categories);
      }
      const merged = [...new Set([...defaultCategories, ...categories])];
      setCategories(merged);
    }
  }, [categories]);

  const loadMenuItems = async () => {
    setLoadingMenu(true);
    try {
      const response = await api.getMenu();

      if (process.env.NODE_ENV === 'development') {
        console.log('[Menu Load] Backend response:', {
          success: response?.success,
          hasData: !!response?.data,
          isArray: Array.isArray(response?.data),
          dataLength: response?.data?.length || 0,
        });
      }

      if (response.success && response.data && Array.isArray(response.data)) {
        const totalItems = response.data.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
        if (process.env.NODE_ENV === 'development') {
          console.log('[Menu Load] Loaded categories:', {
            categoriesCount: response.data.length,
            totalItems: totalItems,
          });
        }

        setOriginalCategories(response.data);

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

        if (process.env.NODE_ENV === 'development') {
          console.log('[Menu Load] Flattened items:', {
            itemsCount: flattenedItems.length,
            categories: [...new Set(flattenedItems.map((item) => item.category))],
          });
        }

        setMenuItems(flattenedItems);

        const defaultCategories = ['Breakfast', 'Lunch', 'Dinner'];

        const uniqueCategories = [...new Set(flattenedItems.map((item) => item.category))];

        if (process.env.NODE_ENV === 'development') {
          console.log('[Menu Load] Category processing:', {
            defaultCategories,
            uniqueCategoriesFromItems: uniqueCategories,
          });
        }

        const allCategories = [...new Set([...defaultCategories, ...uniqueCategories])];
        setCategories(allCategories);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Menu Load] Invalid response structure:', response);
        }
        setMenuItems([]);
        setOriginalCategories([]);

        setCategories(['Breakfast', 'Lunch', 'Dinner']);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Menu Load] Error loading menu items:', error);
      }
      setMenuItems([]);

      setCategories(['Breakfast', 'Lunch', 'Dinner']);
    } finally {
      setLoadingMenu(false);
    }
  };

  const convertItemsToCategories = (items) => {
    const categoriesMap = {};

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

    items.forEach((item) => {
      let categoryName = item.category;
      if (!categoryName || categoryName.trim() === '') {
        const existingCategoryNames = Object.keys(categoriesMap);
        if (existingCategoryNames.length > 0) {
          categoryName = existingCategoryNames[0];
        } else if (categories.length > 0) {
          categoryName = categories[0];
        } else {
          categoryName = 'Lunch';
        }
        if (process.env.NODE_ENV === 'development') {
          console.log('[Convert Categories] Assigned category to item:', {
            itemName: item.name,
            assignedCategory: categoryName,
          });
        }
      }

      if (!categoriesMap[categoryName]) {
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

      const { category, categoryId, categoryIcon, categoryTag, categoryDescription, ...itemData } =
        item;
      categoriesMap[categoryName].items.push(itemData);
    });

    const result = Object.values(categoriesMap);
    const totalItems = result.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Convert Categories] Converted to categories:', {
        categoriesCount: result.length,
        totalItems: totalItems,
      });
    }

    const categoriesWithItems = result.filter((cat) => cat.items && cat.items.length > 0);

    if (categoriesWithItems.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          '[Convert Categories] Error: No categories with items found after conversion'
        );
      }
      throw new Error('No menu items found. Please add at least one menu item.');
    }

    return categoriesWithItems;
  };

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

  const normalizeName = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  };

  const findImageByName = (itemName) => {
    if (!itemName) return '/food.jpeg';

    const normalizedName = normalizeName(itemName);

    const commonMatches = {
      chhole: 'Amritsarichhole.png',
      chole: 'Amritsarichhole.png',
      chana: 'kalachana.jpg',
      dal: 'MoondDalKhichdi.jpg',
      khichdi: 'MoondDalKhichdi.jpg',
      paratha: 'DeliciousAaluParatha.jpg',
      aloo: 'DeliciousAaluParatha.jpg',
      thali: 'DesiThali.jpeg',
      rajma: 'rajma.jpg',
      roti: 'RotiSabji.png',
      sabji: 'RotiSabji.png',
      pakora: 'kadhipakora.jpg',
      kadhi: 'kadhipakora.jpg',
      lobhiya: 'lobhiya.jpg',
      kofta: 'lokikofte.jpg',
      koofte: 'lokikofte.jpg',
      curd: 'Curd.jpg',
      dahi: 'Curd.jpg',
      tiffin: 'FullTiffin.jpg',
      full: 'FullTiffin.jpg',
    };

    for (const [key, imageFile] of Object.entries(commonMatches)) {
      if (normalizedName.includes(key)) {
        return '/' + imageFile;
      }
    }

    for (const image of publicImages) {
      const imageName = normalizeName(image.replace(/\.(jpg|jpeg|png)$/i, ''));
      if (imageName.includes(normalizedName) || normalizedName.includes(imageName)) {
        return '/' + image;
      }
    }

    return '/food.jpeg';
  };

  const getItemImageUrl = (item) => {
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

    return findImageByName(item.name);
  };

  const syncMenuItemsToGallery = async (items, showNotification = null) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Gallery Sync] Starting sync for', items.length, 'menu items');
      }

      let galleryResponse;
      try {
        galleryResponse = await api.getGallery();
        if (process.env.NODE_ENV === 'development') {
          console.log(
            '[Gallery Sync] Fetched',
            galleryResponse?.data?.length || 0,
            'existing gallery items'
          );
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[Gallery Sync] Error fetching gallery:', error);
        }
        throw new Error('Failed to fetch gallery: ' + (error.message || 'Unknown error'));
      }

      const existingGalleryItems =
        galleryResponse.success && galleryResponse.data ? galleryResponse.data : [];

      const itemsToSync = items
        .map((item) => {
          let finalImageUrl = item.imageUrl;
          if (finalImageUrl && finalImageUrl.trim() !== '') {
            finalImageUrl = finalImageUrl.trim();
            if (
              !finalImageUrl.startsWith('/') &&
              !finalImageUrl.startsWith('http://') &&
              !finalImageUrl.startsWith('https://')
            ) {
              finalImageUrl = '/' + finalImageUrl;
            }
          } else {
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

      if (process.env.NODE_ENV === 'development') {
        console.log('[Gallery Sync] Filtering items for gallery:', {
          totalItems: items.length,
          itemsWithImageAndPrice: itemsToSync.length,
        });
      }

      if (itemsToSync.length === 0 && process.env.NODE_ENV === 'development') {
        console.warn(
          '[Gallery Sync] No items to sync - items need imageUrl and price to appear in gallery'
        );
      }

      let created = 0;
      let updated = 0;

      for (const item of itemsToSync) {
        const finalImageUrl = item.imageUrl;

        if (process.env.NODE_ENV === 'development') {
          console.log('[Gallery Sync] Syncing item:', {
            name: item.name,
          });
        }

        const galleryItemData = {
          name: item.name,
          imageUrl: finalImageUrl,
          alt: item.name,
          caption: item.price ? `${item.name} - ₹${item.price}` : item.name,
          price: item.price,
          category: item.category || 'Menu',
          details:
            item.details && Array.isArray(item.details) && item.details.length > 0
              ? item.details
              : [],
          order: item.order || 0,
          isActive: item.isAvailable !== false,
        };

        const existingItem = existingGalleryItems.find((gi) => gi.name === item.name);

        if (existingItem) {
          try {
            const updateResponse = await api.updateGalleryItem(
              existingItem._id || existingItem.id,
              galleryItemData
            );
            updated++;
            if (process.env.NODE_ENV === 'development') {
              console.log('[Gallery Sync] Updated gallery item:', item.name);
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('[Gallery Sync] Error updating gallery item', item.name, ':', error);
            }
            throw error;
          }
        } else {
          try {
            const createResponse = await api.createGalleryItem(galleryItemData);
            created++;
            if (process.env.NODE_ENV === 'development') {
              console.log(
                '[Gallery Sync] Created gallery item:',
                item.name,
                '- Now visible on website gallery'
              );
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('[Gallery Sync] Error creating gallery item', item.name, ':', error);
            }
            throw error;
          }
        }
      }

      const menuItemNames = new Set(itemsToSync.map((item) => item.name));

      let deactivated = 0;
      for (const galleryItem of existingGalleryItems) {
        if (!menuItemNames.has(galleryItem.name) && galleryItem.isActive) {
          await api.updateGalleryItem(galleryItem._id || galleryItem.id, { isActive: false });
          deactivated++;
        }
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[Gallery Sync] Sync complete:', {
          created,
          updated,
          deactivated,
          totalActive: created + updated,
        });
      }

      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('gallery-updated'));

          localStorage.setItem('gallery-last-update', Date.now().toString());

          console.log('[Gallery Sync] Triggered gallery refresh event');
        }
      } catch (e) {
        console.warn('[Gallery Sync] Could not trigger refresh event:', e);
      }

      if (showNotification && (created > 0 || updated > 0)) {
        showNotification(
          `Gallery sync complete: ${created} created, ${updated} updated. Items should now appear on website.`,
          'success'
        );
      }
    } catch (error) {
      console.error('[Gallery Sync] Error syncing menu items to gallery:', error);
      if (showNotification) {
        showNotification(
          'Error syncing to gallery: ' + (error.message || 'Unknown error'),
          'error'
        );
      }
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

      const totalItemsInCategories = categories.reduce(
        (sum, cat) => sum + (cat.items?.length || 0),
        0
      );
      if (totalItemsInCategories === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Menu Save] Warning: No items to save after conversion');
        }
        throw new Error('No menu items to save. Please add at least one menu item.');
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[Menu Save] Sending categories to backend:', {
          categoriesCount: categories.length,
          itemsCount: items.length,
        });
      }

      const response = await api.updateMenu(categories);
      if (process.env.NODE_ENV === 'development') {
        console.log('[Menu Save] Backend response:', {
          success: response?.success,
          dataLength: response?.data?.length || 0,
        });
      }

      if (!response) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[Menu Save] No response from server');
        }
        throw new Error('No response from server');
      }

      if (response.success !== true) {
        const errorMsg = response?.error || 'Failed to save menu';
        if (process.env.NODE_ENV === 'development') {
          console.error('[Menu Save] Backend returned error:', errorMsg);
        }
        throw new Error(errorMsg);
      }

      if (!response.data || !Array.isArray(response.data)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Menu Save] Backend response missing valid data:', response);
        }
      } else if (process.env.NODE_ENV === 'development') {
        console.log('[Menu Save] Successfully saved menu with', response.data.length, 'categories');
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[Menu Save] Starting gallery sync for', items.length, 'items...');
      }
      try {
        await syncMenuItemsToGallery(items, null);
        if (process.env.NODE_ENV === 'development') {
          console.log(
            '[Menu Save] Gallery sync completed - items should now be visible on website'
          );
        }
      } catch (syncError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[Menu Save] Gallery sync failed:', syncError);
        }

        showNotification(
          'Menu saved, but gallery sync failed: ' + (syncError.message || 'Unknown error'),
          'warning'
        );
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[Menu Save] Reloading menu items after save...');
      }
      try {
        await loadMenuItems();
        if (process.env.NODE_ENV === 'development') {
          console.log('[Menu Save] Menu items reloaded successfully');
        }

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
      }

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

  const filteredMenuItems = useMemo(() => {
    let filtered = [...menuItems];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
      );
    }

    if (filterCategory) {
      filtered = filtered.filter((item) => item.category === filterCategory);
    }

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
        default:
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

  const handleAddItem = async () => {
    if (!formData.name.trim() || !formData.price || formData.price <= 0) {
      if (showNotification) {
        showNotification('Please fill in all required fields', 'error');
      }
      return;
    }

    const performAdd = async () => {
      try {
        let itemCategory = 'Breakfast';
        if (categories.length > 0) {
          itemCategory = categories[0];
        } else if (menuItems.length > 0 && menuItems[0].category) {
          itemCategory = menuItems[0].category;
        }

        const newItem = {
          id: Date.now(),
          name: formData.name.trim(),
          description: formData.description || '',
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl || '',
          isAvailable: formData.isAvailable !== false,
          category: formData.category || itemCategory,
        };

        console.log('[Add Item] New item created:', {
          name: newItem.name,
          category: newItem.category,
          price: newItem.price,
        });

        const updatedItems = [...menuItems, newItem];

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

          await loadMenuItems();
          console.log('[Add Item] Reloaded menu items from backend - should now be in sync');
        } catch (error) {
          console.error('[Add Item] Failed to save to backend:', error);

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

  const handleImportMenuItems = async () => {
    if (showConfirmation) {
      showConfirmation({
        title: 'Import Menu Items',
        message:
          'This will add all predefined menu items to your menu. Existing items will be preserved. Continue?',
        type: 'info',
        confirmText: 'Import',
        onConfirm: async () => {
          try {
            setLoadingMenu(true);

            const newCategories = convertMenuItemsToCategories();

            const currentMenuResponse = await api.getMenu();
            const existingCategories =
              currentMenuResponse.success && Array.isArray(currentMenuResponse.data)
                ? currentMenuResponse.data
                : [];

            const mergedCategories = [...existingCategories];

            newCategories.forEach((newCategory) => {
              const existingIndex = mergedCategories.findIndex(
                (cat) => cat.category === newCategory.category
              );

              if (existingIndex >= 0) {
                const existingItems = mergedCategories[existingIndex].items || [];
                const existingItemNames = new Set(existingItems.map((item) => item.name));

                newCategory.items.forEach((newItem) => {
                  if (!existingItemNames.has(newItem.name)) {
                    existingItems.push(newItem);
                  }
                });

                mergedCategories[existingIndex].items = existingItems;
              } else {
                mergedCategories.push(newCategory);
              }
            });

            const flattenedItems = [];
            mergedCategories.forEach((category) => {
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

            await saveMenuItemsToBackend(flattenedItems);

            await loadMenuItems();

            const importedCount = newCategories.reduce(
              (sum, cat) => sum + (cat.items?.length || 0),
              0
            );
            if (showNotification) {
              showNotification(
                `Successfully imported ${importedCount} menu items to backend`,
                'success'
              );
            }
          } catch (error) {
            console.error('Error importing menu items:', error);
            if (showNotification) {
              showNotification(
                'Error importing menu items: ' + (error.message || 'Unknown error'),
                'error'
              );
            }
          } finally {
            setLoadingMenu(false);
          }
        },
      });
    }
  };

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
          category: formData.category || selectedItem.category || '',
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

        await saveMenuItemsToBackend(updatedItems);

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

      await saveMenuItemsToBackend(updatedItems);

      await loadMenuItems();

      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      if (showNotification) {
        showNotification('Error deleting menu item', 'error');
      }
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const updatedItem = { ...item, isAvailable: !item.isAvailable };
      const updatedItems = menuItems.map((i) => (i.id === item.id ? updatedItem : i));

      await saveMenuItemsToBackend(updatedItems);

      await loadMenuItems();
    } catch (error) {
      console.error('Error toggling availability:', error);
      if (showNotification) {
        showNotification('Error updating item', 'error');
      }
    }
  };

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
      {}
      <div className='dashboard-header'>
        <div className='action-buttons-group'>
          <button
            className='btn btn-primary btn-small'
            onClick={() => {
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
                        await api.deleteMenu();

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
              try {
                showNotification('Syncing menu items to gallery...', 'info');
                await syncMenuItemsToGallery(menuItems, showNotification);
              } catch (error) {
                console.error('[Manual Sync] Error:', error);
                showNotification(
                  'Gallery sync failed: ' + (error.message || 'Unknown error'),
                  'error'
                );
              }
            }}
            title='Sync all menu items with images to website gallery'
          >
            <i className='fa-solid fa-sync-alt'></i> Sync to Gallery
          </button>
          <button
            className='btn btn-success btn-small'
            onClick={handleImportMenuItems}
            title='Import predefined menu items (adds to existing items)'
          >
            <i className='fa-solid fa-download'></i> Import Menu Items
          </button>
        </div>
      </div>

      {}
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
              className='form-label-small'
            >
              <i className='fa-solid fa-xmark icon-margin-right-sm'></i>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {}
      {filteredMenuItems.length === 0 ? (
        <div className='empty-state-container'>
          <i className='fa-solid fa-utensils empty-state-icon'></i>
          <h3 className='mb-md'>No Menu Items</h3>
          <p className='mb-xl empty-state-text'>
            {searchQuery || filterCategory
              ? 'No items match your filters'
              : 'Get started by adding your first menu item'}
          </p>
          {!searchQuery && !filterCategory && (
            <button
              className='btn btn-primary'
              onClick={() => {
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
          )}
        </div>
      ) : (
        <div className='dashboard-grid-layout menu-items-grid'>
          {filteredMenuItems.map((item, index) => {
            const getImageUrl = () => {
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

              const normalizeName = (name) => {
                return name
                  .toLowerCase()
                  .replace(/\s+/g, '')
                  .replace(/[^a-z0-9]/g, '')
                  .trim();
              };

              const findImageByName = (itemName) => {
                if (!itemName) return '/food.jpeg';
                const normalizedName = normalizeName(itemName);

                const commonMatches = {
                  chhole: 'Amritsarichhole.png',
                  chole: 'Amritsarichhole.png',
                  chana: 'kalachana.jpg',
                  dal: 'MoondDalKhichdi.jpg',
                  khichdi: 'MoondDalKhichdi.jpg',
                  paratha: 'DeliciousAaluParatha.jpg',
                  aloo: 'DeliciousAaluParatha.jpg',
                  thali: 'DesiThali.jpeg',
                  rajma: 'rajma.jpg',
                  roti: 'RotiSabji.png',
                  sabji: 'RotiSabji.png',
                  pakora: 'kadhipakora.jpg',
                  kadhi: 'kadhipakora.jpg',
                  lobhiya: 'lobhiya.jpg',
                  kofta: 'lokikofte.jpg',
                  koofte: 'lokikofte.jpg',
                  curd: 'Curd.jpg',
                  dahi: 'Curd.jpg',
                  tiffin: 'FullTiffin.jpg',
                  full: 'FullTiffin.jpg',
                };

                for (const [key, imageFile] of Object.entries(commonMatches)) {
                  if (normalizedName.includes(key)) {
                    return '/' + imageFile;
                  }
                }

                for (const image of publicImages) {
                  const imageName = normalizeName(image.replace(/\.(jpg|jpeg|png)$/i, ''));
                  if (imageName.includes(normalizedName) || normalizedName.includes(imageName)) {
                    return '/' + image;
                  }
                }

                return '/food.jpeg';
              };

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

              return findImageByName(item.name);
            };

            const categoryColors = {
              Lunch: {
                bg: 'var(--admin-accent-light, rgba(68, 144, 49, 0.1))',
                color: 'var(--admin-accent, #449031)',
                icon: 'fa-utensils',
              },
              Dinner: {
                bg: 'var(--admin-secondary-light, rgba(196, 92, 45, 0.1))',
                color: 'var(--admin-secondary, #c45c2d)',
                icon: 'fa-moon',
              },
              Breakfast: {
                bg: 'rgba(255, 193, 7, 0.1)',
                color: '#ffc107',
                icon: 'fa-sun',
              },
            };

            const categoryStyle = categoryColors[item.category] || {
              bg: 'var(--admin-glass-border)',
              color: 'var(--admin-text-secondary)',
              icon: 'fa-circle',
            };

            return (
              <div
                key={`${item.id}-${item.name}-${index}`}
                className='menu-item-card-enhanced'
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className='menu-item-card-header'>
                  <div
                    className='menu-item-image-wrapper'
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '220px',
                      borderRadius: '12px 12px 0 0',
                      overflow: 'hidden',
                      background:
                        'linear-gradient(135deg, var(--admin-glass-border) 0%, var(--admin-bg-secondary) 100%)',
                    }}
                  >
                    <img
                      src={getImageUrl()}
                      alt={item.name || 'Menu item'}
                      className='menu-item-image'
                      onError={(e) => {
                        const fallback = '/food.jpeg';
                        if (e.target.src !== fallback && !e.target.src.includes(fallback)) {
                          e.target.src = fallback;
                        }
                      }}
                      loading='lazy'
                    />
                    <div
                      className='menu-item-availability-badge'
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: item.isAvailable
                          ? 'rgba(16, 185, 129, 0.95)'
                          : 'rgba(239, 68, 68, 0.95)',
                        color: '#ffffff',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      <i
                        className={`fa-solid ${
                          item.isAvailable ? 'fa-check-circle' : 'fa-times-circle'
                        }`}
                      ></i>
                      <span>{item.isAvailable ? 'Available' : 'Unavailable'}</span>
                    </div>
                    <div
                      className='menu-item-category-badge'
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: categoryStyle.bg,
                        color: categoryStyle.color,
                        padding: '8px 14px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backdropFilter: 'blur(4px)',
                        border: `1.5px solid ${categoryStyle.color}20`,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <i className={`fa-solid ${categoryStyle.icon}`}></i>
                      <span>{item.category || 'Uncategorized'}</span>
                    </div>
                  </div>
                </div>

                <div className='menu-item-card-body'>
                  <div className='menu-item-title-section'>
                    <h3 className='menu-item-title'>{item.name}</h3>
                    {item.description && (
                      <p className='menu-item-description'>{item.description}</p>
                    )}
                  </div>

                  <div className='menu-item-footer'>
                    <div className='menu-item-price-section'>
                      <span className='menu-item-price-label'>Price</span>
                      <div className='menu-item-price'>
                        <span className='menu-item-price-symbol'>₹</span>
                        <span className='menu-item-price-amount'>
                          {formatCurrency(item.price || 0)}
                        </span>
                      </div>
                    </div>
                    <div className='menu-item-actions'>
                      <button
                        className='menu-item-action-btn menu-item-action-toggle'
                        onClick={() => handleToggleAvailability(item)}
                        title={item.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                        style={{
                          background: item.isAvailable
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(239, 68, 68, 0.1)',
                          color: item.isAvailable ? '#10b981' : '#ef4444',
                        }}
                      >
                        <i
                          className={`fa-solid ${item.isAvailable ? 'fa-eye-slash' : 'fa-eye'}`}
                        ></i>
                      </button>
                      <button
                        className='menu-item-action-btn menu-item-action-edit'
                        onClick={() => openEditModal(item)}
                        title='Edit Item'
                      >
                        <i className='fa-solid fa-pencil'></i>
                      </button>
                      <button
                        className='menu-item-action-btn menu-item-action-delete'
                        onClick={() => openDeleteModal(item)}
                        title='Delete Item'
                      >
                        <i className='fa-solid fa-trash'></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {}
      {showAddModal && (
        <div className='modal-overlay'>
          <div className='modal-container max-width-540'>
            <div className='modal-header-compact'>
              <h2 className='modal-header-title'>Add Menu Item</h2>
              <button
                className='btn btn-ghost btn-icon modal-close'
                onClick={() => setShowAddModal(false)}
              >
                <i className='fa-solid fa-times'></i>
              </button>
            </div>
            <div className='modal-body-compact'>
              <div className='form-grid' style={{ gap: '16px' }}>
                <div className='form-group-full'>
                  <label className='form-label-small'>Item Name *</label>
                  <input
                    type='text'
                    className='input-field form-input-small'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder='e.g., Lunch Combo'
                    required
                  />
                </div>
                <div className='form-group-full'>
                  <label className='form-label-small'>Description</label>
                  <textarea
                    className='input-field form-textarea'
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder='Item description...'
                    rows={2}
                  />
                </div>
                <div className='form-group-full'>
                  <label className='form-label-small'>Price (₹) *</label>
                  <input
                    type='number'
                    className='input-field form-input-small'
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
                    Category{' '}
                    <span
                      style={{
                        color: 'var(--admin-text-light)',
                        fontWeight: 400,
                        fontSize: '11px',
                      }}
                    >
                      (Optional)
                    </span>
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
                    Image URL{' '}
                    <span
                      style={{
                        color: 'var(--admin-text-light)',
                        fontWeight: 400,
                        fontSize: '11px',
                      }}
                    >
                      (Optional)
                    </span>
                  </label>
                  <input
                    type='text'
                    className='input-field'
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder='/food.jpeg or https://example.com/image.jpg'
                    style={{ padding: '10px 12px', fontSize: '14px' }}
                  />
                  <small
                    style={{
                      color: 'var(--admin-text-light)',
                      fontSize: '11px',
                      marginTop: '4px',
                      display: 'block',
                      lineHeight: '1.4',
                    }}
                  >
                    Use /filename.jpg for public folder, or full URL for external images
                  </small>
                </div>
                <div
                  className='form-group'
                  style={{ gridColumn: '1 / -1', marginBottom: 0, marginTop: '4px' }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      marginBottom: 0,
                    }}
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
              <button
                className='btn btn-ghost'
                onClick={() => setShowAddModal(false)}
                style={{ padding: '10px 18px', fontSize: '14px' }}
              >
                Cancel
              </button>
              <button
                className='btn btn-primary'
                onClick={handleAddItem}
                style={{ padding: '10px 18px', fontSize: '14px' }}
              >
                <i className='fa-solid fa-plus'></i> Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showEditModal && selectedItem && (
        <div className='modal-overlay'>
          <div className='modal-container' style={{ maxWidth: '540px' }}>
            <div className='modal-header' style={{ padding: '18px 24px' }}>
              <h2 style={{ fontSize: '20px', margin: 0 }}>Edit Menu Item</h2>
              <button
                className='btn btn-ghost btn-icon modal-close'
                onClick={() => setShowEditModal(false)}
              >
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
                    Category{' '}
                    <span
                      style={{
                        color: 'var(--admin-text-light)',
                        fontWeight: 400,
                        fontSize: '11px',
                      }}
                    >
                      (Optional)
                    </span>
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
                    Image URL{' '}
                    <span
                      style={{
                        color: 'var(--admin-text-light)',
                        fontWeight: 400,
                        fontSize: '11px',
                      }}
                    >
                      (Optional)
                    </span>
                  </label>
                  <input
                    type='text'
                    className='input-field'
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder='Leave empty to auto-match, or enter /filename.jpg'
                    style={{ padding: '10px 12px', fontSize: '14px' }}
                  />
                  <small
                    style={{
                      color: 'var(--admin-text-light)',
                      fontSize: '11px',
                      marginTop: '4px',
                      display: 'block',
                      lineHeight: '1.4',
                    }}
                  >
                    {formData.imageUrl ? (
                      <>Custom: {formData.imageUrl}</>
                    ) : (
                      <>Auto-matching: Finds image from public folder based on item name</>
                    )}
                  </small>
                </div>
                <div
                  className='form-group'
                  style={{ gridColumn: '1 / -1', marginBottom: 0, marginTop: '4px' }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      marginBottom: 0,
                    }}
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
              <button
                className='btn btn-ghost'
                onClick={() => setShowEditModal(false)}
                style={{ padding: '10px 18px', fontSize: '14px' }}
              >
                Cancel
              </button>
              <button
                className='btn btn-primary'
                onClick={handleEditItem}
                style={{ padding: '10px 18px', fontSize: '14px' }}
              >
                <i className='fa-solid fa-save'></i> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {}
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
