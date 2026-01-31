import { useEffect, useMemo, useState } from 'react';
import { useAutoKeyboardAvoidance } from '../../hooks/useKeyboardAvoidance.js';
import api from '../../lib/api-admin.js';
import { convertMenuItemsToCategories } from '../../lib/menuData.js';
import { InlineLoader, Spinner } from '../loaders/LoaderComponents';
import Icon from '../ui/Icon.jsx';
import ConfirmationModal from './ConfirmationModal.jsx';
import { formatCurrency } from './utils/orderUtils.js';

const MenuPriceTab = ({
  settings,
  showNotification,
  showConfirmation,
  loading = false,
  activeTab = '',
  dataRefreshKey = 0,
}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  // Predefined categories from menuData.js
  const predefinedCategories = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Full Tiffin',
    'Mix & Match Tiffin',
    'Khichdi Tiffin',
    'Rotis & Parathas',
    'Add-ons',
    'Pickup Option',
    'Breakfast Combos',
    'Lunch Combos',
    'Dinner Combos',
  ];

  const [categories, setCategories] = useState(predefinedCategories);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [togglingItemId, setTogglingItemId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [statusDisplay, setStatusDisplay] = useState('full'); // 'full' | 'short'

  const statusLabel = (isAvailable) =>
    statusDisplay === 'short'
      ? isAvailable
        ? 'Avail'
        : 'Unavail'
      : isAvailable
        ? 'Available'
        : 'Unavailable';

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
    mainCategory: '',
    subcategory: '',
  });

  // Main categories (Breakfast, Lunch, Dinner, Lunch & Dinner)
  const mainCategories = ['Breakfast', 'Lunch', 'Dinner', 'Lunch & Dinner'];

  // Subcategories for each main category
  const subcategoriesByMainCategory = {
    Breakfast: [
      'Mix & Match Tiffin',
      'Full Tiffin',
      'Khichdi Tiffin',
      'Rotis & Parathas',
      'Add-ons',
      'Breakfast Combos',
    ],
    Lunch: [
      'Mix & Match Tiffin',
      'Full Tiffin',
      'Khichdi Tiffin',
      'Rotis & Parathas',
      'Add-ons',
      'Lunch Combos',
    ],
    Dinner: [
      'Mix & Match Tiffin',
      'Full Tiffin',
      'Khichdi Tiffin',
      'Rotis & Parathas',
      'Add-ons',
      'Dinner Combos',
    ],
    'Lunch & Dinner': [
      'Mix & Match Tiffin',
      'Full Tiffin',
      'Khichdi Tiffin',
      'Rotis & Parathas',
      'Add-ons',
      'Lunch Combos',
      'Dinner Combos',
    ],
  };

  const getImageUrl = (item) => {
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
    const normalizeName = (name) =>
      name
        ?.toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '')
        .trim() ?? '';
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
        if (normalizedName.includes(key)) return '/' + imageFile;
      }
      for (const image of publicImages) {
        const imageName = normalizeName(
          image.replace(/\.(jpg|jpeg|png)$/i, '')
        );
        if (
          imageName.includes(normalizedName) ||
          normalizedName.includes(imageName)
        ) {
          return '/' + image;
        }
      }
      return '/food.jpeg';
    };
    if (item.imageUrl?.trim()) {
      const imageUrl = item.imageUrl.trim();
      if (imageUrl.startsWith('/')) return imageUrl;
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
      }
      return '/' + imageUrl;
    }
    return findImageByName(item.name);
  };

  const categoryColors = {
    Lunch: {
      bg: 'var(--admin-accent-light, rgba(68, 144, 49, 0.1))',
      color: 'var(--admin-accent, #449031)',
      icon: 'utensils',
    },
    Dinner: {
      bg: 'var(--admin-secondary-light, rgba(196, 92, 45, 0.1))',
      color: 'var(--admin-secondary, #c45c2d)',
      icon: 'moon',
    },
    Breakfast: {
      bg: 'rgba(255, 193, 7, 0.1)',
      color: '#ffc107',
      icon: 'sun',
    },
  };

  const getCategoryStyle = (item) =>
    categoryColors[item.category] || {
      bg: 'var(--admin-glass-border)',
      color: 'var(--admin-text-secondary)',
      icon: 'circle',
    };

  // Load when tab is shown or when global refresh runs (so table updates without needing delete/edit)
  useEffect(() => {
    if (activeTab === 'menuPrice') {
      loadMenuItems();
    }
  }, [activeTab, dataRefreshKey]);

  useEffect(() => {
    // Ensure predefined categories are always present
    if (
      categories.length === 0 ||
      !categories.some((cat) => predefinedCategories.includes(cat))
    ) {
      if (process.env.NODE_ENV === 'development')
        console.log(
          '[Categories] Ensuring predefined categories are present. Current:',
          categories
        );
      const merged = [...new Set([...predefinedCategories, ...categories])];
      setCategories(merged);
    }
  }, [categories]);

  const loadMenuItems = async () => {
    setLoadingMenu(true);
    try {
      if (process.env.NODE_ENV === 'development')
        console.log('[Menu Load] Starting to load menu items...');
      const response = await api.getMenu();

      if (process.env.NODE_ENV === 'development')
        console.log('[Menu Load] Backend response:', {
          success: response?.success,
          hasData: !!response?.data,
          isArray: Array.isArray(response?.data),
          dataLength: response?.data?.length || 0,
          responseData: response?.data,
        });

      if (response.success && response.data && Array.isArray(response.data)) {
        const totalItems = response.data.reduce(
          (sum, cat) => sum + (cat.items?.length || 0),
          0
        );
        if (process.env.NODE_ENV === 'development')
          console.log('[Menu Load] Loaded categories:', {
            categoriesCount: response.data.length,
            totalItems: totalItems,
          });

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

        if (process.env.NODE_ENV === 'development')
          console.log('[Menu Load] Flattened items:', {
            itemsCount: flattenedItems.length,
            categories: [
              ...new Set(flattenedItems.map((item) => item.category)),
            ],
          });

        if (process.env.NODE_ENV === 'development')
          console.log('[Menu Load] Setting menu items:', {
            itemsCount: flattenedItems.length,
            items: flattenedItems.map((item) => ({
              name: item.name,
              category: item.category,
            })),
          });

        setMenuItems(flattenedItems);

        const uniqueCategories = [
          ...new Set(flattenedItems.map((item) => item.category)),
        ];

        if (process.env.NODE_ENV === 'development')
          console.log('[Menu Load] Category processing:', {
            predefinedCategories,
            uniqueCategoriesFromItems: uniqueCategories,
          });

        // Merge predefined categories with categories from existing items
        const allCategories = [
          ...new Set([...predefinedCategories, ...uniqueCategories]),
        ];
        setCategories(allCategories);

        if (process.env.NODE_ENV === 'development')
          console.log('[Menu Load] Menu loaded successfully:', {
            totalItems: flattenedItems.length,
            categories: allCategories,
          });
      } else {
        if (process.env.NODE_ENV === 'development')
          console.warn('[Menu Load] Invalid response structure:', response);
        if (process.env.NODE_ENV === 'development')
          console.warn('[Menu Load] Response details:', {
            response: response,
            success: response?.success,
            data: response?.data,
            dataType: typeof response?.data,
          });
        setMenuItems([]);
        setOriginalCategories([]);
        setCategories(predefinedCategories);

        if (showNotification) {
          showNotification(
            'No menu items found. Click "Import Menu Items" to add sample items, or add items manually.',
            'info'
          );
        }
      }
    } catch (error) {
      console.error('[Menu Load] Error loading menu items:', error);
      if (process.env.NODE_ENV === 'development')
        console.error('[Menu Load] Error details:', {
          message: error.message,
          stack: error.stack,
        });
      setMenuItems([]);
      setCategories(['Breakfast', 'Lunch', 'Dinner']);

      if (showNotification) {
        showNotification(
          'Error loading menu items: ' +
            (error.message || 'Unknown error') +
            '. Please try refreshing the page.',
          'error'
        );
      }
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
            icon: originalCategory.icon || 'utensils',
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
        if (process.env.NODE_ENV === 'development')
          console.log('[Convert Categories] Assigned category to item:', {
            itemName: item.name,
            assignedCategory: categoryName,
          });
      }

      if (!categoriesMap[categoryName]) {
        const existingItemInCategory = items.find(
          (i) => i.category === categoryName && i.categoryId
        );

        categoriesMap[categoryName] = {
          id:
            existingItemInCategory?.categoryId || item.categoryId || Date.now(),
          category: categoryName,
          icon:
            existingItemInCategory?.categoryIcon ||
            item.categoryIcon ||
            'utensils',
          tag: existingItemInCategory?.categoryTag || item.categoryTag || '',
          description:
            existingItemInCategory?.categoryDescription ||
            item.categoryDescription ||
            '',
          items: [],
        };
      }

      const {
        category,
        categoryId,
        categoryIcon,
        categoryTag,
        categoryDescription,
        ...itemData
      } = item;
      categoriesMap[categoryName].items.push(itemData);
    });

    const result = Object.values(categoriesMap);
    const totalItems = result.reduce(
      (sum, cat) => sum + (cat.items?.length || 0),
      0
    );

    if (process.env.NODE_ENV === 'development')
      console.log('[Convert Categories] Converted to categories:', {
        categoriesCount: result.length,
        totalItems,
      });

    const categoriesWithItems = result.filter(
      (cat) => cat.items && cat.items.length > 0
    );

    if (categoriesWithItems.length === 0) {
      if (process.env.NODE_ENV === 'development')
        console.error(
          '[Convert Categories] Error: No categories with items found after conversion'
        );
      throw new Error(
        'No menu items found. Please add at least one menu item.'
      );
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
      if (
        imageName.includes(normalizedName) ||
        normalizedName.includes(imageName)
      ) {
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
      } else if (
        imageUrl.startsWith('http://') ||
        imageUrl.startsWith('https://')
      ) {
        return imageUrl;
      } else {
        return '/' + imageUrl;
      }
    }

    return findImageByName(item.name);
  };

  const syncMenuItemsToGallery = async (items, showNotification = null) => {
    try {
      if (process.env.NODE_ENV === 'development')
        console.log(
          '[Gallery Sync] Starting sync for',
          items.length,
          'menu items'
        );

      let galleryResponse;
      try {
        galleryResponse = await api.getGallery();
        if (process.env.NODE_ENV === 'development')
          console.log(
            '[Gallery Sync] Fetched',
            galleryResponse?.data?.length || 0,
            'existing gallery items'
          );
      } catch (error) {
        console.error('[Gallery Sync] Error fetching gallery:', error);
        throw new Error(
          'Failed to fetch gallery: ' + (error.message || 'Unknown error')
        );
      }

      const existingGalleryItems =
        galleryResponse.success && galleryResponse.data
          ? galleryResponse.data
          : [];

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

      if (process.env.NODE_ENV === 'development')
        console.log('[Gallery Sync] Filtering items for gallery:', {
          totalItems: items.length,
          itemsWithImageAndPrice: itemsToSync.length,
        });

      if (itemsToSync.length === 0 && process.env.NODE_ENV === 'development')
        console.warn(
          '[Gallery Sync] No items to sync - items need imageUrl and price to appear in gallery'
        );

      let created = 0;
      let updated = 0;

      for (const item of itemsToSync) {
        const finalImageUrl = item.imageUrl;

        if (process.env.NODE_ENV === 'development')
          console.log('[Gallery Sync] Syncing item:', { name: item.name });

        const galleryItemData = {
          name: item.name,
          imageUrl: finalImageUrl,
          alt: item.name,
          caption: item.price ? `${item.name} - ₹${item.price}` : item.name,
          price: item.price,
          category: item.category || 'Menu',
          details:
            item.details &&
            Array.isArray(item.details) &&
            item.details.length > 0
              ? item.details
              : [],
          order: item.order || 0,
          isActive: item.isAvailable !== false,
        };

        const existingItem = existingGalleryItems.find(
          (gi) => gi.name === item.name
        );

        if (existingItem) {
          try {
            await api.updateGalleryItem(
              existingItem._id || existingItem.id,
              galleryItemData
            );
            updated++;
            if (process.env.NODE_ENV === 'development')
              console.log('[Gallery Sync] Updated gallery item:', item.name);
          } catch (error) {
            console.error(
              '[Gallery Sync] Error updating gallery item',
              item.name,
              ':',
              error
            );
            throw error;
          }
        } else {
          try {
            await api.createGalleryItem(galleryItemData);
            created++;
            if (process.env.NODE_ENV === 'development')
              console.log(
                '[Gallery Sync] Created gallery item:',
                item.name,
                '- Now visible on website gallery'
              );
          } catch (error) {
            console.error(
              '[Gallery Sync] Error creating gallery item',
              item.name,
              ':',
              error
            );
            throw error;
          }
        }
      }

      const menuItemNames = new Set(itemsToSync.map((item) => item.name));

      let deactivated = 0;
      for (const galleryItem of existingGalleryItems) {
        if (!menuItemNames.has(galleryItem.name) && galleryItem.isActive) {
          await api.updateGalleryItem(galleryItem._id || galleryItem.id, {
            isActive: false,
          });
          deactivated++;
        }
      }

      if (process.env.NODE_ENV === 'development')
        console.log('[Gallery Sync] Sync complete:', {
          created,
          updated,
          deactivated,
          totalActive: created + updated,
        });

      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('gallery-updated'));

          localStorage.setItem('gallery-last-update', Date.now().toString());

          if (process.env.NODE_ENV === 'development')
            console.log('[Gallery Sync] Triggered gallery refresh event');
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development')
          console.warn('[Gallery Sync] Could not trigger refresh event:', e);
      }

      if (showNotification && (created > 0 || updated > 0)) {
        showNotification(
          `Gallery sync complete: ${created} created, ${updated} updated. Items should now appear on website.`,
          'success'
        );
      }
    } catch (error) {
      console.error(
        '[Gallery Sync] Error syncing menu items to gallery:',
        error
      );
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
        if (process.env.NODE_ENV === 'development')
          console.warn('[Menu Save] Attempting to save empty menu items array');
        if (showNotification) {
          showNotification(
            'Cannot save empty menu. Please add at least one menu item.',
            'error'
          );
        }
        throw new Error(
          'Cannot save empty menu. Please add at least one menu item.'
        );
      }

      const categories = convertItemsToCategories(items);

      const totalItemsInCategories = categories.reduce(
        (sum, cat) => sum + (cat.items?.length || 0),
        0
      );
      if (totalItemsInCategories === 0) {
        if (process.env.NODE_ENV === 'development')
          console.warn(
            '[Menu Save] Warning: No items to save after conversion'
          );
        throw new Error(
          'No menu items to save. Please add at least one menu item.'
        );
      }

      if (process.env.NODE_ENV === 'development')
        console.log('[Menu Save] Sending categories to backend:', {
          categoriesCount: categories.length,
          itemsCount: items.length,
        });

      const response = await api.updateMenu(categories);
      if (process.env.NODE_ENV === 'development')
        console.log('[Menu Save] Backend response:', {
          success: response?.success,
          dataLength: response?.data?.length || 0,
        });

      if (!response) {
        console.error('[Menu Save] No response from server');
        throw new Error('No response from server');
      }

      if (response.success !== true) {
        const errorMsg = response?.error || 'Failed to save menu';
        console.error('[Menu Save] Backend returned error:', errorMsg);
        throw new Error(errorMsg);
      }

      if (!response.data || !Array.isArray(response.data)) {
        if (process.env.NODE_ENV === 'development')
          console.warn(
            '[Menu Save] Backend response missing valid data:',
            response
          );
      } else if (process.env.NODE_ENV === 'development')
        console.log(
          '[Menu Save] Successfully saved menu with',
          response.data.length,
          'categories'
        );

      // Sync to gallery in background (non-blocking, fire and forget)
      // This runs asynchronously and doesn't block the save operation
      syncMenuItemsToGallery(items, null).catch((syncError) => {
        if (process.env.NODE_ENV === 'development')
          console.warn(
            '[Menu Save] Gallery sync failed (non-critical):',
            syncError
          );
      });

      if (showNotification) {
        showNotification('Menu saved successfully', 'success');
      }

      return true;
    } catch (error) {
      console.error('[Menu Save] Error saving menu to backend:', error);
      if (process.env.NODE_ENV === 'development')
        console.error('[Menu Save] Error details:', {
          message: error.message,
          stack: error.stack,
        });
      if (showNotification)
        showNotification(
          'Error saving menu: ' + (error.message || 'Unknown error'),
          'error'
        );
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
      /* Available on top first */
      const aAvail = a.isAvailable !== false ? 1 : 0;
      const bAvail = b.isAvailable !== false ? 1 : 0;
      if (bAvail !== aAvail) return bAvail - aAvail;

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

        // Determine final category: use mainCategory if provided, otherwise use category field
        let finalCategory =
          formData.mainCategory || formData.category || itemCategory;

        // If both mainCategory and subcategory are provided, use mainCategory (subcategory is for organization)
        // The category field will be the main category (Breakfast, Lunch, or Dinner)
        if (formData.mainCategory) {
          finalCategory = formData.mainCategory;
        }

        const newItem = {
          id: Date.now(),
          name: formData.name.trim(),
          description: formData.description || '',
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl || '',
          isAvailable: formData.isAvailable !== false,
          category: finalCategory,
        };

        if (process.env.NODE_ENV === 'development')
          console.log('[Add Item] New item created:', {
            name: newItem.name,
            category: newItem.category,
            price: newItem.price,
          });

        const updatedItems = [...menuItems, newItem];

        if (process.env.NODE_ENV === 'development')
          console.log('[Add Item] Saving new item to backend:', {
            itemName: newItem.name,
            category: newItem.category,
            price: newItem.price,
            totalItemsBefore: menuItems.length,
            totalItemsAfter: updatedItems.length,
            allItemsBefore: menuItems.map((i) => ({ name: i.name, id: i.id })),
            allItemsAfter: updatedItems.map((i) => ({
              name: i.name,
              id: i.id,
            })),
          });

        try {
          // Optimistically update local state first for instant feedback
          setMenuItems(updatedItems);

          // Save to backend
          await saveMenuItemsToBackend(updatedItems);

          // Reload in background to ensure sync (non-blocking)
          loadMenuItems().catch((reloadError) => {
            console.error('[Add Item] Background reload failed:', reloadError);
            // If reload fails, we still have the optimistic update
          });
        } catch (error) {
          console.error('[Add Item] Failed to save to backend:', error);
          // Revert optimistic update on error
          await loadMenuItems();
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
          mainCategory: '',
          subcategory: '',
        });
      } catch (error) {
        console.error('Error adding menu item:', error);
        if (showNotification)
          showNotification('Error adding menu item', 'error');
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
              currentMenuResponse.success &&
              Array.isArray(currentMenuResponse.data)
                ? currentMenuResponse.data
                : [];

            const mergedCategories = [...existingCategories];

            newCategories.forEach((newCategory) => {
              const existingIndex = mergedCategories.findIndex(
                (cat) => cat.category === newCategory.category
              );

              if (existingIndex >= 0) {
                const existingItems =
                  mergedCategories[existingIndex].items || [];
                const existingItemNames = new Set(
                  existingItems.map((item) => item.name)
                );

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
            if (showNotification)
              showNotification(
                'Error importing menu items: ' +
                  (error.message || 'Unknown error'),
                'error'
              );
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
        // Determine final category: use mainCategory if provided, otherwise use category field
        let finalCategory =
          formData.mainCategory ||
          formData.category ||
          selectedItem.category ||
          '';

        // If mainCategory is provided, use it as the category
        if (formData.mainCategory) {
          finalCategory = formData.mainCategory;
        }

        const updatedItem = {
          ...selectedItem,
          name: formData.name.trim(),
          description: formData.description || '',
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl || '',
          isAvailable: formData.isAvailable !== false,
          category: finalCategory,
        };

        const updatedItems = menuItems.map((item) =>
          item.id === selectedItem.id ? updatedItem : item
        );

        if (process.env.NODE_ENV === 'development')
          console.log('[Edit Item] Updating item:', {
            itemId: selectedItem.id,
            itemName: updatedItem.name,
            totalItems: updatedItems.length,
            allItems: updatedItems.map((i) => ({ name: i.name, id: i.id })),
          });

        // Optimistically update local state first for instant feedback
        setMenuItems(updatedItems);

        // Save to backend
        await saveMenuItemsToBackend(updatedItems);

        // Reload in background to ensure sync (non-blocking)
        loadMenuItems().catch((reloadError) => {
          console.error('[Edit Item] Background reload failed:', reloadError);
          // If reload fails, we still have the optimistic update
        });

        setShowEditModal(false);
        setSelectedItem(null);
        setFormData({
          name: '',
          description: '',
          price: 0,
          isAvailable: true,
          imageUrl: '',
          category: '',
          mainCategory: '',
          subcategory: '',
        });
      } catch (error) {
        console.error('Error updating menu item:', error);
        if (showNotification)
          showNotification('Error updating menu item', 'error');
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
      const updatedItems = menuItems.filter(
        (item) => item.id !== selectedItem.id
      );

      if (process.env.NODE_ENV === 'development')
        console.log('[Delete Item] Deleting item:', {
          itemId: selectedItem.id,
          itemName: selectedItem.name,
          totalItemsBefore: menuItems.length,
          totalItemsAfter: updatedItems.length,
          remainingItems: updatedItems.map((i) => ({ name: i.name, id: i.id })),
        });

      // Optimistically update local state first for instant feedback
      setMenuItems(updatedItems);

      // Save to backend
      await saveMenuItemsToBackend(updatedItems);

      // Reload in background to ensure sync (non-blocking)
      loadMenuItems().catch((reloadError) => {
        console.error('[Delete Item] Background reload failed:', reloadError);
        // If reload fails, we still have the optimistic update
      });

      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      if (showNotification)
        showNotification('Error deleting menu item', 'error');
    }
  };

  const handleToggleAvailability = async (item) => {
    // Prevent multiple clicks
    if (togglingItemId === item.id) return;

    setTogglingItemId(item.id);

    // Show notification about status change
    if (showNotification) {
      showNotification(
        `Changing item status to ${!item.isAvailable ? 'Available' : 'Unavailable'}...`,
        'info'
      );
    }

    try {
      const updatedItem = { ...item, isAvailable: !item.isAvailable };
      const updatedItems = menuItems.map((i) =>
        i.id === item.id ? updatedItem : i
      );

      // Optimistically update local state first for instant feedback
      setMenuItems(updatedItems);

      // Save to backend
      await saveMenuItemsToBackend(updatedItems);

      // Reload in background to ensure sync (non-blocking)
      loadMenuItems().catch((reloadError) => {
        console.error('[Toggle Status] Background reload failed:', reloadError);
        // If reload fails, we still have the optimistic update
      });

      // Show success notification
      if (showNotification) {
        showNotification(
          `Item status changed to ${updatedItem.isAvailable ? 'Available' : 'Unavailable'}`,
          'success'
        );
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      if (showNotification) {
        showNotification('Error updating item status', 'error');
      }
    } finally {
      setTogglingItemId(null);
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);

    // Parse category to extract main category and subcategory
    const itemCategory = item.category || '';
    let mainCategory = '';
    let subcategory = '';

    // Check if category is a main category (Breakfast, Lunch, Dinner)
    const mainCat = mainCategories.find(
      (cat) => cat.toLowerCase() === itemCategory.toLowerCase()
    );

    if (mainCat) {
      mainCategory = mainCat;
      // Try to detect subcategory from item name
      const itemName = (item.name || '').toLowerCase();
      const allSubcategories = [
        ...subcategoriesByMainCategory.Breakfast,
        ...subcategoriesByMainCategory.Lunch,
        ...subcategoriesByMainCategory.Dinner,
      ];
      const uniqueSubcategories = [...new Set(allSubcategories)];

      for (const subcat of uniqueSubcategories) {
        const subcatLower = subcat.toLowerCase();
        if (
          itemName.includes('mix') &&
          itemName.includes('match') &&
          subcatLower.includes('mix') &&
          subcatLower.includes('match')
        ) {
          subcategory = subcat;
          break;
        } else if (
          (itemName.includes('full') || itemName.includes('thali')) &&
          subcatLower.includes('full')
        ) {
          subcategory = subcat;
          break;
        } else if (
          itemName.includes('khichdi') &&
          subcatLower.includes('khichdi')
        ) {
          subcategory = subcat;
          break;
        } else if (
          (itemName.includes('roti') || itemName.includes('paratha')) &&
          subcatLower.includes('roti')
        ) {
          subcategory = subcat;
          break;
        } else if (
          (itemName.includes('add') || itemName.includes('curd')) &&
          subcatLower.includes('add')
        ) {
          subcategory = subcat;
          break;
        } else if (
          itemName.includes('combo') &&
          subcatLower.includes('combo')
        ) {
          subcategory = subcat;
          break;
        }
      }
    } else if (itemCategory) {
      // If category is not a main category, it might be a subcategory
      // Try to find which main category it belongs to
      for (const mainCat of mainCategories) {
        if (subcategoriesByMainCategory[mainCat].includes(itemCategory)) {
          mainCategory = mainCat;
          subcategory = itemCategory;
          break;
        }
      }
      // If not found, use category as subcategory and try to infer main category
      if (!mainCategory) {
        subcategory = itemCategory;
      }
    }

    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || 0,
      isAvailable: item.isAvailable !== false,
      imageUrl: item.imageUrl || '',
      category: item.category || '',
      mainCategory: mainCategory,
      subcategory: subcategory,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  if (loading || loadingMenu) {
    return (
      <div className="admin-content">
        <InlineLoader message="Loading menu..." />
      </div>
    );
  }

  return (
    <div className="admin-content menu-price-tab">
      <div className="kitchen-tab">
        <div className="kitchen-tab-actions">
          <div
            className="kitchen-tab-actions-left"
            style={{ flex: 1, minWidth: 0, flexWrap: 'wrap', gap: '12px' }}
          >
            <div className="filter-container menu-price-filters">
              <div className="search-input-wrapper search-input-wrapper-flex">
                <input
                  type="text"
                  className="input-field search-input-with-icon"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filter-field-group-standard min-width-140">
                <select
                  className="input-field filter-input-standard"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-field-group-standard min-width-160">
                <select
                  className="input-field filter-input-standard"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [by, order] = e.target.value.split('-');
                    setSortBy(by);
                    setSortOrder(order);
                  }}
                >
                  <option value="name-asc">Sort By Name</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="category-asc">Category (A-Z)</option>
                  <option value="category-desc">Category (Z-A)</option>
                </select>
              </div>
              {(searchQuery || filterCategory) && (
                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterCategory('');
                  }}
                  title="Clear all filters"
                >
                  <Icon name="xmark" />
                  Clear Filters
                </button>
              )}
              <div className="action-buttons-group menu-price-actions">
                <div
                  className="view-mode-toggle"
                  role="group"
                  aria-label="View mode"
                >
                  <button
                    type="button"
                    className={`btn btn-ghost btn-icon btn-small ${
                      viewMode === 'grid' ? 'active' : ''
                    }`}
                    onClick={() => setViewMode('grid')}
                    title="Grid view"
                    aria-pressed={viewMode === 'grid'}
                  >
                    <Icon name="th" />
                  </button>
                  <button
                    type="button"
                    className={`btn btn-ghost btn-icon btn-small ${
                      viewMode === 'list' ? 'active' : ''
                    }`}
                    onClick={() => setViewMode('list')}
                    title="List / table view"
                    aria-pressed={viewMode === 'list'}
                  >
                    <Icon name="table" />
                  </button>
                </div>
                <button
                  className="btn btn-primary btn-small"
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
                  <Icon name="plus" /> Add Menu Item
                </button>
                <button
                  className="btn btn-secondary btn-small"
                  onClick={async () => {
                    try {
                      showNotification(
                        'Syncing menu items to gallery...',
                        'info'
                      );
                      await syncMenuItemsToGallery(menuItems, showNotification);
                    } catch (error) {
                      console.error('[Manual Sync] Error:', error);
                      showNotification(
                        'Gallery sync failed: ' +
                          (error.message || 'Unknown error'),
                        'error'
                      );
                    }
                  }}
                  title="Sync all menu items with images to website gallery"
                >
                  <Icon name="sync-alt" /> Sync to Gallery
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="kitchen-tab-card">
          {filteredMenuItems.length === 0 ? (
            <div className="kitchen-tab-empty">
              <Icon
                name="utensils"
                className="kitchen-tab-empty-icon"
                aria-hidden
              />
              <h3 className="kitchen-tab-empty-title">No Menu Items</h3>
              <p className="kitchen-tab-empty-desc">
                {searchQuery || filterCategory
                  ? 'No items match your filters'
                  : 'Get started by adding your first menu item'}
              </p>
              {!searchQuery && !filterCategory && (
                <button
                  className="btn btn-primary"
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
                  <Icon name="plus" /> Add Menu Item
                </button>
              )}
            </div>
          ) : (
            <div className="kitchen-tab-body-inner">
              {viewMode === 'grid' && (
                <div className="dashboard-grid-layout menu-items-grid">
                  {filteredMenuItems.map((item, index) => {
                    const categoryStyle = getCategoryStyle(item);
                    return (
                      <div
                        key={`${item.id}-${item.name}-${index}`}
                        className="menu-item-card-enhanced"
                      >
                        <div className="menu-item-card-header">
                          <div className="menu-item-image-wrapper">
                            <img
                              src={getImageUrl(item)}
                              alt={item.name || 'Menu item'}
                              className="menu-item-image"
                              onError={(e) => {
                                const fallback = '/food.jpeg';
                                if (
                                  e.target.src !== fallback &&
                                  !e.target.src.includes(fallback)
                                ) {
                                  e.target.src = fallback;
                                }
                              }}
                              loading="lazy"
                            />
                            <div
                              className="menu-item-availability-badge menu-item-availability-badge-clickable"
                              role="button"
                              tabIndex={0}
                              onClick={() =>
                                setStatusDisplay((s) =>
                                  s === 'full' ? 'short' : 'full'
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setStatusDisplay((s) =>
                                    s === 'full' ? 'short' : 'full'
                                  );
                                }
                              }}
                              title="Click to toggle full/short status label"
                              aria-label={`Status: ${item.isAvailable ? 'Available' : 'Unavailable'}. Click to toggle label length.`}
                            >
                              <Icon
                                name={
                                  item.isAvailable
                                    ? 'check-circle'
                                    : 'times-circle'
                                }
                              />
                              <span>{statusLabel(item.isAvailable)}</span>
                            </div>
                            <div className="menu-item-category-badge">
                              <Icon name={categoryStyle.icon} />
                              <span>{item.category || 'Uncategorized'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="menu-item-card-body">
                          <div className="menu-item-title-section">
                            <h3 className="menu-item-title">{item.name}</h3>
                            {item.description && (
                              <p className="menu-item-description">
                                {item.description}
                              </p>
                            )}
                          </div>

                          <div className="menu-item-footer">
                            <div className="menu-item-price-section">
                              <span className="menu-item-price-label">
                                Price
                              </span>
                              <div className="menu-item-price">
                                <span className="menu-item-price-symbol">
                                  ₹
                                </span>
                                <span className="menu-item-price-amount">
                                  {formatCurrency(item.price || 0)}
                                </span>
                              </div>
                            </div>
                            <div className="menu-item-actions">
                              <button
                                className="menu-item-action-btn menu-item-action-view"
                                onClick={() => openViewModal(item)}
                                title="View Item Details"
                              >
                                <Icon name="eye" />
                              </button>
                              <button
                                className={`menu-item-action-btn menu-item-action-toggle ${
                                  togglingItemId === item.id ? 'toggling' : ''
                                }`}
                                onClick={() => handleToggleAvailability(item)}
                                disabled={togglingItemId === item.id}
                                title={
                                  togglingItemId === item.id
                                    ? 'Changing status...'
                                    : item.isAvailable
                                      ? 'Mark as Unavailable'
                                      : 'Mark as Available'
                                }
                              >
                                {togglingItemId === item.id ? (
                                  <Spinner type="circular" size="small" />
                                ) : (
                                  <Icon
                                    name={
                                      item.isAvailable
                                        ? 'toggle-on'
                                        : 'toggle-off'
                                    }
                                  />
                                )}
                              </button>
                              <button
                                className="menu-item-action-btn menu-item-action-edit"
                                onClick={() => openEditModal(item)}
                                title="Edit Item"
                              >
                                <Icon name="pencil" />
                              </button>
                              <button
                                className="menu-item-action-btn menu-item-action-delete"
                                onClick={() => openDeleteModal(item)}
                                title="Delete Item"
                              >
                                <Icon name="trash" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {viewMode === 'list' && (
                <div className="orders-table-container">
                  <table className="menu-items-table orders-table">
                    <thead>
                      <tr>
                        <th scope="col">S.No.</th>
                        <th scope="col">Image</th>
                        <th scope="col">Name</th>
                        <th scope="col">Category</th>
                        <th scope="col">Price</th>
                        <th scope="col">Status</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMenuItems.map((item, index) => {
                        const categoryStyle = getCategoryStyle(item);
                        return (
                          <tr key={`${item.id}-${item.name}-${index}`}>
                            <td className="menu-items-table-cell-sno">
                              {index + 1}
                            </td>
                            <td className="menu-items-table-cell-image">
                              <img
                                src={getImageUrl(item)}
                                alt={item.name || 'Menu item'}
                                className="menu-items-table-thumb"
                                onError={(e) => {
                                  if (e.target.src !== '/food.jpeg') {
                                    e.target.src = '/food.jpeg';
                                  }
                                }}
                                loading="lazy"
                              />
                            </td>
                            <td className="menu-items-table-cell-name">
                              <span className="menu-items-table-name">
                                {item.name}
                              </span>
                              {item.description && (
                                <span className="menu-items-table-desc">
                                  {item.description}
                                </span>
                              )}
                            </td>
                            <td className="menu-items-table-cell-category">
                              <span
                                className="menu-items-table-category-badge"
                                style={{
                                  background: categoryStyle.bg,
                                  color: categoryStyle.color,
                                }}
                              >
                                <Icon name={categoryStyle.icon} />
                                {item.category || 'Uncategorized'}
                              </span>
                            </td>
                            <td className="menu-items-table-cell-price">
                              <span className="menu-item-price">
                                <span className="menu-item-price-symbol">
                                  ₹
                                </span>
                                <span className="menu-item-price-amount">
                                  {formatCurrency(item.price || 0)}
                                </span>
                              </span>
                            </td>
                            <td className="menu-items-table-cell-status">
                              <span
                                className={`menu-items-table-status menu-items-table-status-clickable ${
                                  item.isAvailable ? 'available' : 'unavailable'
                                }`}
                                role="button"
                                tabIndex={0}
                                onClick={() =>
                                  setStatusDisplay((s) =>
                                    s === 'full' ? 'short' : 'full'
                                  )
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setStatusDisplay((s) =>
                                      s === 'full' ? 'short' : 'full'
                                    );
                                  }
                                }}
                                title="Click to toggle full/short status label"
                                aria-label={`Status: ${item.isAvailable ? 'Available' : 'Unavailable'}. Click to toggle label length.`}
                              >
                                <Icon
                                  name={
                                    item.isAvailable
                                      ? 'check-circle'
                                      : 'times-circle'
                                  }
                                />
                                {statusLabel(item.isAvailable)}
                              </span>
                            </td>
                            <td className="menu-items-table-cell-actions">
                              <div className="menu-item-actions">
                                <button
                                  className="menu-item-action-btn menu-item-action-view"
                                  onClick={() => openViewModal(item)}
                                  title="View Item Details"
                                >
                                  <Icon name="eye" />
                                </button>
                                <button
                                  className={`menu-item-action-btn menu-item-action-toggle ${
                                    togglingItemId === item.id ? 'toggling' : ''
                                  }`}
                                  onClick={() => handleToggleAvailability(item)}
                                  disabled={togglingItemId === item.id}
                                  title={
                                    togglingItemId === item.id
                                      ? 'Changing status...'
                                      : item.isAvailable
                                        ? 'Mark as Unavailable'
                                        : 'Mark as Available'
                                  }
                                >
                                  {togglingItemId === item.id ? (
                                    <Spinner type="circular" size="small" />
                                  ) : (
                                    <Icon
                                      name={
                                        item.isAvailable
                                          ? 'toggle-on'
                                          : 'toggle-off'
                                      }
                                    />
                                  )}
                                </button>
                                <button
                                  className="menu-item-action-btn menu-item-action-edit"
                                  onClick={() => openEditModal(item)}
                                  title="Edit Item"
                                >
                                  <Icon name="pencil" />
                                </button>
                                <button
                                  className="menu-item-action-btn menu-item-action-delete"
                                  onClick={() => openDeleteModal(item)}
                                  title="Delete Item"
                                >
                                  <Icon name="trash" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container max-width-540">
            <div className="modal-header-compact">
              <h2 className="modal-header-title">Add Menu Item</h2>
              <button
                className="btn btn-ghost btn-icon modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <Icon name="times" />
              </button>
            </div>
            <div className="modal-body-compact">
              <div className="form-grid menu-form-grid">
                <div className="form-group-full">
                  <label className="form-label-small">Item Name *</label>
                  <input
                    type="text"
                    className="input-field form-input-small"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Lunch Combo"
                    required
                  />
                </div>
                <div className="form-group-full">
                  <label className="form-label-small">Description</label>
                  <textarea
                    className="input-field form-textarea"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Item description..."
                    rows={2}
                  />
                </div>
                <div className="form-group-full">
                  <label className="form-label-small">Price (₹) *</label>
                  <input
                    type="number"
                    className="input-field form-input-small"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="menu-form-input"
                  />
                </div>
                <div className="form-group menu-form-group-full">
                  <label className="menu-form-label">
                    Main Category{' '}
                    <span className="menu-form-label-optional">(Optional)</span>
                  </label>
                  <select
                    className="input-field menu-form-input"
                    value={formData.mainCategory}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        mainCategory: e.target.value,
                        subcategory: '', // Reset subcategory when main category changes
                      });
                    }}
                  >
                    <option value="">Select Main Category</option>
                    {mainCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.mainCategory && (
                  <div className="form-group menu-form-group-full">
                    <label className="menu-form-label">
                      Subcategory / Package{' '}
                      <span className="menu-form-label-optional">
                        (Optional)
                      </span>
                    </label>
                    <select
                      className="input-field menu-form-input"
                      value={formData.subcategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subcategory: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Subcategory</option>
                      {subcategoriesByMainCategory[formData.mainCategory]?.map(
                        (subcat) => (
                          <option key={subcat} value={subcat}>
                            {subcat}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}
                <div className="form-group menu-form-group-full">
                  <label className="menu-form-label">
                    Image URL{' '}
                    <span className="menu-form-label-optional">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="input-field menu-form-input"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="/food.jpeg or https://example.com/image.jpg"
                  />
                  <small className="menu-form-helper-text">
                    Use /filename.jpg for public folder, or full URL for
                    external images
                  </small>
                </div>
                <div className="form-group menu-form-group-full-mt">
                  <label className="menu-checkbox-label">
                    <input
                      type="checkbox"
                      className="menu-checkbox-input"
                      checked={formData.isAvailable}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isAvailable: e.target.checked,
                        })
                      }
                    />
                    <span>Available for ordering</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer menu-modal-footer">
              <button
                className="btn btn-ghost menu-modal-btn"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary menu-modal-btn"
                onClick={handleAddItem}
              >
                <Icon name="plus" /> Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-container menu-edit-modal-container">
            <div className="modal-header menu-edit-modal-header">
              <h2>Edit Menu Item</h2>
              <button
                className="btn btn-ghost btn-icon modal-close"
                onClick={() => setShowEditModal(false)}
              >
                <Icon name="times" />
              </button>
            </div>
            <div className="modal-body menu-edit-modal-body">
              <div className="form-grid menu-form-grid">
                <div className="form-group menu-form-group-full">
                  <label className="menu-form-label">Item Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Lunch Combo"
                    required
                    className="menu-form-input"
                  />
                </div>
                <div className="form-group menu-form-group-full">
                  <label className="menu-form-label">Description</label>
                  <textarea
                    className="input-field"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Item description..."
                    rows={2}
                    className="menu-form-input"
                    className="menu-form-textarea"
                  />
                </div>
                <div className="form-group menu-form-group-full">
                  <label className="menu-form-label">Price (₹) *</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="menu-form-input"
                  />
                </div>
                <div className="form-group menu-form-group-full">
                  <label className="menu-form-label">
                    Main Category{' '}
                    <span className="menu-form-label-optional">(Optional)</span>
                  </label>
                  <select
                    className="input-field menu-form-input"
                    value={formData.mainCategory}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        mainCategory: e.target.value,
                        subcategory: '', // Reset subcategory when main category changes
                      });
                    }}
                  >
                    <option value="">Select Main Category</option>
                    {mainCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.mainCategory && (
                  <div className="form-group menu-form-group-full">
                    <label className="menu-form-label">
                      Subcategory / Package{' '}
                      <span className="menu-form-label-optional">
                        (Optional)
                      </span>
                    </label>
                    <select
                      className="input-field menu-form-input"
                      value={formData.subcategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subcategory: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Subcategory</option>
                      {subcategoriesByMainCategory[formData.mainCategory]?.map(
                        (subcat) => (
                          <option key={subcat} value={subcat}>
                            {subcat}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}
                <div className="form-group menu-form-group-full">
                  <label className="menu-form-label">
                    Image URL{' '}
                    <span className="menu-form-label-optional">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="input-field menu-form-input"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="Leave empty to auto-match, or enter /filename.jpg"
                  />
                  <small className="menu-form-helper-text">
                    {formData.imageUrl ? (
                      <>Custom: {formData.imageUrl}</>
                    ) : (
                      <>
                        Auto-matching: Finds image from public folder based on
                        item name
                      </>
                    )}
                  </small>
                </div>
                <div className="form-group menu-form-group-full-mt">
                  <label className="menu-checkbox-label">
                    <input
                      type="checkbox"
                      className="menu-checkbox-input"
                      checked={formData.isAvailable}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isAvailable: e.target.checked,
                        })
                      }
                    />
                    <span>Available for ordering</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer menu-modal-footer">
              <button
                className="btn btn-ghost menu-modal-btn"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary menu-modal-btn"
                onClick={handleEditItem}
              >
                <Icon name="save" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-container max-width-540">
            <div className="modal-header-compact">
              <h2 className="modal-header-title">View Menu Item</h2>
              <button
                className="btn btn-ghost btn-icon modal-close"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedItem(null);
                }}
              >
                <Icon name="times" />
              </button>
            </div>
            <div className="modal-body-compact">
              <div className="menu-view-content">
                <div className="menu-view-image-wrapper">
                  {(() => {
                    const getImageUrl = () => {
                      if (
                        selectedItem.imageUrl &&
                        selectedItem.imageUrl.trim() !== ''
                      ) {
                        const imageUrl = selectedItem.imageUrl.trim();
                        if (imageUrl.startsWith('/')) {
                          return imageUrl;
                        } else if (
                          imageUrl.startsWith('http://') ||
                          imageUrl.startsWith('https://')
                        ) {
                          return imageUrl;
                        } else {
                          return '/' + imageUrl;
                        }
                      }
                      // Try to find image by name
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
                        for (const [key, imageFile] of Object.entries(
                          commonMatches
                        )) {
                          if (normalizedName.includes(key)) {
                            return '/' + imageFile;
                          }
                        }
                        return '/food.jpeg';
                      };
                      return findImageByName(selectedItem.name);
                    };
                    const imageUrl = getImageUrl();
                    return (
                      <img
                        src={imageUrl}
                        alt={selectedItem.name || 'Menu item'}
                        className="menu-view-image"
                        onError={(e) => {
                          const fallback = '/food.jpeg';
                          if (
                            e.target.src !== fallback &&
                            !e.target.src.includes(fallback)
                          ) {
                            e.target.src = fallback;
                          }
                        }}
                      />
                    );
                  })()}
                </div>
                <div className="menu-view-details">
                  <div className="menu-view-detail-row">
                    <span className="menu-view-label">Item Name:</span>
                    <span className="menu-view-value">{selectedItem.name}</span>
                  </div>
                  {selectedItem.description && (
                    <div className="menu-view-detail-row">
                      <span className="menu-view-label">Description:</span>
                      <span className="menu-view-value">
                        {selectedItem.description}
                      </span>
                    </div>
                  )}
                  <div className="menu-view-detail-row">
                    <span className="menu-view-label">Price:</span>
                    <span className="menu-view-value">
                      ₹ {formatCurrency(selectedItem.price || 0)}
                    </span>
                  </div>
                  <div className="menu-view-detail-row">
                    <span className="menu-view-label">Category:</span>
                    <span className="menu-view-value">
                      {(() => {
                        const itemCategory = selectedItem.category || '';
                        // Check if category is a main category
                        const mainCat = mainCategories.find(
                          (cat) =>
                            cat.toLowerCase() === itemCategory.toLowerCase()
                        );
                        if (mainCat) {
                          return mainCat;
                        }
                        // If not a main category, check if it's a subcategory and find its main category
                        for (const mainCat of mainCategories) {
                          if (
                            subcategoriesByMainCategory[mainCat]?.includes(
                              itemCategory
                            )
                          ) {
                            return `${mainCat} - ${itemCategory}`;
                          }
                        }
                        // Fallback to original category or Uncategorized
                        return itemCategory || 'Uncategorized';
                      })()}
                    </span>
                  </div>
                  <div className="menu-view-detail-row">
                    <span className="menu-view-label">Status:</span>
                    <span
                      className={`menu-view-status menu-view-status-clickable ${
                        selectedItem.isAvailable ? 'available' : 'unavailable'
                      }`}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        setStatusDisplay((s) =>
                          s === 'full' ? 'short' : 'full'
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setStatusDisplay((s) =>
                            s === 'full' ? 'short' : 'full'
                          );
                        }
                      }}
                      title="Click to toggle full/short status label"
                      aria-label={`Status: ${selectedItem.isAvailable ? 'Available' : 'Unavailable'}. Click to toggle label length.`}
                    >
                      <Icon
                        name={
                          selectedItem.isAvailable
                            ? 'check-circle'
                            : 'times-circle'
                        }
                      />
                      <span>{statusLabel(selectedItem.isAvailable)}</span>
                    </span>
                  </div>
                  {selectedItem.imageUrl && selectedItem.imageUrl.trim() && (
                    <div className="menu-view-detail-row">
                      <span className="menu-view-label">Image URL:</span>
                      <span className="menu-view-value menu-view-url">
                        {selectedItem.imageUrl}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer menu-modal-footer">
              <button
                className="btn btn-ghost menu-modal-btn"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedItem(null);
                }}
              >
                Close
              </button>
              <button
                className="btn btn-primary menu-modal-btn"
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedItem);
                }}
              >
                <Icon name="pencil" /> Edit Item
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedItem && (
        <ConfirmationModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteItem}
          title="Delete Menu Item"
          message={`Are you sure you want to delete "${selectedItem.name}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmType="danger"
        />
      )}
    </div>
  );
};

export default MenuPriceTab;
