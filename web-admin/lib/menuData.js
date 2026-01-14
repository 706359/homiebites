

import api from './api.js';

const MENU_DATA_KEY = 'homiebites_menu_data';

const defaultMenuData = [
  {
    id: 1,
    category: 'Full Tiffin',
    icon: 'fa-star',
    tag: 'Best Seller',

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
  
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    
    try {
      const response = await api.getMenu();
      if (
        response.success &&
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        
        return response.data;
      }
    } catch (apiError) {
      console.error('API fetch failed:', apiError.message);
      
      
    }

    
    return [];
  } catch (error) {
    console.error('Error accessing menu data:', error);
    return [];
  }
};




export const getMenuDataSync = () => {
  
  return [];
};

export const saveMenuData = async (data) => {
  
  try {
    const token = localStorage.getItem('homiebites_token');
    if (token) {
      await api.updateMenu(data);
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem(MENU_DATA_KEY);
        localStorage.removeItem('homiebites_menu_version');
      }
    } else {
      throw new Error('Not authenticated. Please login to save menu data.');
    }
  } catch (error) {
    console.error('Failed to save menu to API:', error.message);
    throw error; 
  }
};

export const resetMenuData = async () => {
  
  
  return defaultMenuData;
};


export const triggerDataSync = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('menuDataUpdated'));
  }
};


export const menuItemsToImport = {
  fullTiffin: [
    {
      id: 'fullTiffin_0',
      name: 'Full Tiffin (Standard)',
      details: [
        '1 Sabzi Gravy + 1 Sabzi Dry + Rice + 4 Rotis',
        '1 Sabzi Gravy + 1 Sabzi Dry + 6 Rotis (without Rice)',
      ],
      price: 120,
    },
  ],

  mixMatchTiffin: [
    { id: 'mixMatchTiffin_1', name: '1 Sabzi + 4 Rotis + Chawal', details: [], price: 100 },
    { id: 'mixMatchTiffin_2', name: '2 Sabzis + 4 Rotis', details: [], price: 120 },
    { id: 'mixMatchTiffin_3', name: '1 Sabzi + 6 Rotis', details: [], price: 100 },
    { id: 'mixMatchTiffin_4', name: '1 Sabzi + 4 Rotis', details: [], price: 80 },
    { id: 'mixMatchTiffin_5', name: '1 Sabzi + 2 Bowls Chawal', details: [], price: 100 },
    { id: 'mixMatchTiffin_6', name: 'Only 1 Sabzi', details: [], price: 40 },
  ],

  khichdiTiffin: [
    { id: 'khichdiTiffin_0', name: 'Moong Dal Khichdi', details: [], price: 120 },
    { id: 'khichdiTiffin_4', name: 'Vegetable Khichdi', details: [], price: 130 },
    { id: 'khichdiTiffin_6', name: 'Masala Khichdi', details: [], price: 120 },
    { id: 'khichdiTiffin_8', name: 'Brown Rice Khichdi', details: [], price: 150 },
    { id: 'khichdiTiffin_10', name: 'Daliya (Broken Wheat) Khichdi', details: [], price: 140 },
    { id: 'khichdiTiffin_13', name: 'Sabudana Khichdi (Fasting)', details: [], price: 120 },
  ],

  rotisParathas: [
    { id: 'rotisParathas_0', name: 'Plain Roti', details: [], price: 10 },
    { id: 'rotisParathas_1', name: 'Roti with Ghee', details: [], price: 12 },
    { id: 'rotisParathas_2', name: 'Plain Paratha', details: [], price: 20 },
    { id: 'rotisParathas_3', name: 'Stuffed Paratha', details: [], price: 35 },
    { id: 'rotisParathas_4', name: '3 Stuffed Parathas', details: [], price: 100 },
  ],

  breakfastCombos: [
    {
      id: 'breakfastCombos_0',
      name: 'Stuffed Paratha Combo',
      details: ['Stuffed paratha + curd + pickle'],
      price: 120,
    },
    {
      id: 'breakfastCombos_1',
      name: 'Paneer Paratha Combo',
      details: ['Paneer paratha + curd + chutney'],
      price: 130,
    },
    {
      id: 'breakfastCombos_2',
      name: 'Desi Ghee Paratha Combo',
      details: ['Paratha made with desi ghee + curd'],
      price: 160,
    },
  ],

  lunchCombos: [
    { id: 'lunchCombos_0', name: 'Full Tiffin Meal', details: [], price: 140 },
    { id: 'lunchCombos_1', name: 'Stuffed Parathas with Curd', details: [], price: 110 },
    { id: 'lunchCombos_2', name: 'Aloo Matar with Chawal', details: [], price: 90 },
    { id: 'lunchCombos_3', name: 'Aloo Matar with Puri + Curd', details: [], price: 120 },
    { id: 'lunchCombos_4', name: 'Chhole & Lobhiya Combo', details: [], price: 100 },
    { id: 'lunchCombos_5', name: 'Rajma & Kala Chana Combo', details: [], price: 100 },
  ],

  dinnerCombos: [
    { id: 'dinnerCombos_0', name: 'Mini Tiffin', details: [], price: 100 },
    { id: 'dinnerCombos_1', name: 'Protein Power Combo', details: [], price: 110 },
    { id: 'dinnerCombos_2', name: 'Desi Comfort Combo', details: [], price: 100 },
    { id: 'dinnerCombos_3', name: 'North Indian Classic', details: [], price: 120 },
    { id: 'dinnerCombos_4', name: 'Puri Bhaji Combo', details: [], price: 120 },
    { id: 'dinnerCombos_5', name: 'Paneer Paratha Deluxe', details: [], price: 150 },
    { id: 'dinnerCombos_6', name: 'Gharwala Combo', details: [], price: 120 },
    { id: 'dinnerCombos_7', name: 'Budget Combo', details: [], price: 90 },
    { id: 'dinnerCombos_8', name: 'Light Meal Combo', details: [], price: 100 },
    { id: 'dinnerCombos_9', name: 'Sabzi Sampler', details: [], price: 110 },
  ],

  addOns: [
    { id: 'addOns_0', name: 'Homemade Curd (1 Bowl)', details: [], price: 25 },
    { id: 'addOns_1', name: 'Homemade Chutney', details: [], price: 10 },
  ],

  pickupOption: [
    { id: 'pickupOption_0', name: 'Full Tiffin (Self-Pickup)', details: [], price: 100 },
  ],
};


export const convertMenuItemsToCategories = () => {
  let categoryId = 1;
  let itemIdCounter = 1;

  const categories = [];

  
  if (menuItemsToImport.fullTiffin && menuItemsToImport.fullTiffin.length > 0) {
    categories.push({
      id: categoryId++,
      category: 'Full Tiffin',
      icon: 'fa-star',
      tag: 'Best Seller',
      description:
        'Gravy Sabji + Dry Sabji + 4 Rotis + Rice (4 Rotis with Rice / 6 Rotis without Rice)',
      items: menuItemsToImport.fullTiffin.map((item) => ({
        id: itemIdCounter++,
        name: item.name,
        price: item.price,
        details: item.details || [],
        description: item.details?.join(', ') || '',
      })),
    });
  }

  
  if (menuItemsToImport.mixMatchTiffin && menuItemsToImport.mixMatchTiffin.length > 0) {
    categories.push({
      id: categoryId++,
      category: 'Mix & Match Tiffin',
      icon: 'fa-utensils',
      items: menuItemsToImport.mixMatchTiffin.map((item) => ({
        id: itemIdCounter++,
        name: item.name,
        price: item.price,
        details: item.details || [],
        description: item.details?.join(', ') || '',
      })),
    });
  }

  
  if (menuItemsToImport.khichdiTiffin && menuItemsToImport.khichdiTiffin.length > 0) {
    categories.push({
      id: categoryId++,
      category: 'Khichdi Tiffin',
      icon: 'fa-bowl-rice',
      description: 'Full Tiffin (4 bowls)',
      items: menuItemsToImport.khichdiTiffin.map((item) => ({
        id: itemIdCounter++,
        name: item.name,
        price: item.price,
        details: item.details || [],
        description: item.details?.join(', ') || '',
      })),
    });
  }

  
  if (menuItemsToImport.rotisParathas && menuItemsToImport.rotisParathas.length > 0) {
    categories.push({
      id: categoryId++,
      category: 'Rotis & Parathas',
      icon: 'fa-bread-slice',
      items: menuItemsToImport.rotisParathas.map((item) => ({
        id: itemIdCounter++,
        name: item.name,
        price: item.price,
        details: item.details || [],
        description: item.details?.join(', ') || '',
      })),
    });
  }

  
  if (menuItemsToImport.breakfastCombos && menuItemsToImport.breakfastCombos.length > 0) {
    categories.push({
      id: categoryId++,
      category: 'Breakfast Combos',
      icon: 'fa-sun',
      items: menuItemsToImport.breakfastCombos.map((item) => ({
        id: itemIdCounter++,
        name: item.name,
        price: item.price,
        details: item.details || [],
        description: item.details?.join(', ') || '',
      })),
    });
  }

  
  if (menuItemsToImport.lunchCombos && menuItemsToImport.lunchCombos.length > 0) {
    categories.push({
      id: categoryId++,
      category: 'Lunch Combos',
      icon: 'fa-utensils',
      items: menuItemsToImport.lunchCombos.map((item) => ({
        id: itemIdCounter++,
        name: item.name,
        price: item.price,
        details: item.details || [],
        description: item.details?.join(', ') || '',
      })),
    });
  }

  
  if (menuItemsToImport.dinnerCombos && menuItemsToImport.dinnerCombos.length > 0) {
    categories.push({
      id: categoryId++,
      category: 'Dinner Combos',
      icon: 'fa-moon',
      items: menuItemsToImport.dinnerCombos.map((item) => ({
        id: itemIdCounter++,
        name: item.name,
        price: item.price,
        details: item.details || [],
        description: item.details?.join(', ') || '',
      })),
    });
  }

  
  if (menuItemsToImport.addOns && menuItemsToImport.addOns.length > 0) {
    categories.push({
      id: categoryId++,
      category: 'Add-ons',
      icon: 'fa-plus',
      items: menuItemsToImport.addOns.map((item) => ({
        id: itemIdCounter++,
        name: item.name,
        price: item.price,
        details: item.details || [],
        description: item.details?.join(', ') || '',
      })),
    });
  }

  
  if (menuItemsToImport.pickupOption && menuItemsToImport.pickupOption.length > 0) {
    categories.push({
      id: categoryId++,
      category: 'Pickup Option',
      icon: 'fa-person-walking',
      description: 'Thali & Tiffin both available',
      items: menuItemsToImport.pickupOption.map((item) => ({
        id: itemIdCounter++,
        name: item.name,
        price: item.price,
        details: item.details || [],
        description: item.details?.join(', ') || '',
      })),
    });
  }

  return categories;
};
