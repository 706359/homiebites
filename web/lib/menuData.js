// Menu data management with localStorage persistence

const MENU_DATA_KEY = 'homiebites_menu_data'

const defaultMenuData = [
  {
    id: 1,
    category: 'Full Tiffin',
    icon: 'fa-star',
    tag: 'Best Seller',
    description: 'Gravy Sabji + Dry Sabji + 4 Rotis + Rice (4 Rotis with Rice / 6 Rotis without Rice)',
    items: [{ id: 1, name: '1 Full Tiffin', price: 120 }],
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
]

export const getMenuData = () => {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return defaultMenuData
  }

  try {
    const stored = localStorage.getItem(MENU_DATA_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Validate that parsed data is an array with items
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      } catch (e) {
        console.warn('Error parsing menu data from localStorage:', e)
      }
    }
    // Initialize with default data
    localStorage.setItem(MENU_DATA_KEY, JSON.stringify(defaultMenuData))
    return defaultMenuData
  } catch (error) {
    console.error('Error accessing localStorage:', error)
    return defaultMenuData
  }
}

export const saveMenuData = (data) => {
  localStorage.setItem(MENU_DATA_KEY, JSON.stringify(data))
}

export const resetMenuData = () => {
  localStorage.setItem(MENU_DATA_KEY, JSON.stringify(defaultMenuData))
  return defaultMenuData
}

