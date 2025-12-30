// Utility to organize menu items into categories and create menu data structure
// This will update the menu data structure and save to backend

const menuItems = [
  { name: 'Thali Plastic (Classic)', category: 'Breakfast', price: 120, active: true },
  { name: 'Tiffin Steel (Zambo)', category: 'Breakfast', price: 150, active: true },
  { name: '2 Sabji + 6 Rotis', category: 'Breakfast', price: 120, active: true },
  { name: '1 Sabji + 4 Rotis + Rice', category: 'Breakfast', price: 100, active: true },
  { name: '2 Sabji + 4 Rotis', category: 'Breakfast', price: 120, active: true },
  { name: '1 Sabji + 6 Rotis', category: 'Breakfast', price: 100, active: true },
  { name: '1 Sabji + 4 Rotis', category: 'Breakfast', price: 80, active: true },
  { name: '1 Sabji + 2 Bowls Rice', category: 'Breakfast', price: 100, active: true },
  { name: 'Only 1 Sabji', category: 'Breakfast', price: 40, active: true },
  { name: 'Khichdi Meal', category: 'Breakfast', price: 120, active: true },
  { name: 'Plain Roti', category: 'Breakfast', price: 10, active: true },
  { name: 'Roti with Ghee', category: 'Breakfast', price: 12, active: true },
  { name: 'Plain Paratha', category: 'Breakfast', price: 20, active: true },
  { name: 'Stuffed Paratha (Aloo/Gobhi/Muli/Methi)', category: 'Breakfast', price: 35, active: true },
  { name: '3 Stuffed Parathas', category: 'Breakfast', price: 100, active: true },
  { name: 'Homemade Curd (1 Bowl)', category: 'Breakfast', price: 25, active: true },
  { name: 'Parathas + Curd Combo', category: 'Breakfast', price: 100, active: true },
  { name: 'Self-Pickup (A1 Tower)', category: 'Breakfast', price: 100, active: true },
];

// Organize items into logical categories based on their names
function organizeMenuItems(items) {
  const categories = {
    'Full Tiffin': {
      id: 1,
      category: 'Full Tiffin',
      icon: 'fa-star',
      tag: 'Best Seller',
      description: 'Gravy Sabji + Dry Sabji + 4 Rotis + Rice (4 Rotis with Rice / 6 Rotis without Rice)',
      items: [],
    },
    'Mix & Match Tiffin': {
      id: 2,
      category: 'Mix & Match Tiffin',
      icon: 'fa-utensils',
      items: [],
    },
    'Khichdi Tiffin': {
      id: 3,
      category: 'Khichdi Tiffin',
      icon: 'fa-bowl-rice',
      description: 'Full Tiffin (4 bowls)',
      items: [],
    },
    'Rotis & Parathas': {
      id: 4,
      category: 'Rotis & Parathas',
      icon: 'fa-bread-slice',
      items: [],
    },
    'Add-ons': {
      id: 5,
      category: 'Add-ons',
      icon: 'fa-plus',
      items: [],
    },
    'Pickup Option': {
      id: 6,
      category: 'Pickup Option',
      icon: 'fa-person-walking',
      description: 'Thali & Tiffin both available',
      items: [],
    },
  };

  let itemIdCounter = 1;

  items.forEach((item) => {
    const menuItem = {
      id: itemIdCounter++,
      name: item.name,
      price: item.price,
      isActive: item.active !== false,
    };

    // Categorize items based on their names (check more specific patterns first)
    const nameLower = item.name.toLowerCase();
    
    if (nameLower.includes('pickup') || nameLower.includes('self-pickup')) {
      categories['Pickup Option'].items.push(menuItem);
    } else if (nameLower.includes('curd') || (nameLower.includes('combo') && nameLower.includes('curd'))) {
      categories['Add-ons'].items.push(menuItem);
    } else if (nameLower.includes('thali') || nameLower.includes('tiffin steel') || nameLower.includes('zambo')) {
      categories['Full Tiffin'].items.push(menuItem);
    } else if (nameLower.includes('khichdi')) {
      categories['Khichdi Tiffin'].items.push(menuItem);
    } else if (
      nameLower.includes('sabji') && 
      !nameLower.includes('only 1 sabji') &&
      !nameLower.includes('khichdi')
    ) {
      categories['Mix & Match Tiffin'].items.push(menuItem);
    } else if (nameLower.includes('only 1 sabji')) {
      categories['Mix & Match Tiffin'].items.push(menuItem);
    } else if (nameLower.includes('roti') || nameLower.includes('paratha')) {
      categories['Rotis & Parathas'].items.push(menuItem);
    } else {
      // Default to Mix & Match if unsure
      categories['Mix & Match Tiffin'].items.push(menuItem);
    }
  });

  // Return only categories that have items
  return Object.values(categories).filter((cat) => cat.items.length > 0);
}

export const createMenuFromList = (items = menuItems) => {
  return organizeMenuItems(items);
};

