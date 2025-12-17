// User authentication utility using localStorage
// In production, this should use a proper backend API

const USER_KEY = 'homiebites_user';
const USERS_KEY = 'homiebites_users';
const ORDERS_KEY = 'homiebites_orders';

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Register new user
export const register = (name, email, phone, password) => {
  const users = getUsers();

  // Check if email already exists
  if (users.find((u) => u.email === email)) {
    return { success: false, error: 'Email already registered' };
  }

  // Check if phone already exists
  if (users.find((u) => u.phone === phone)) {
    return { success: false, error: 'Phone number already registered' };
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    phone,
    password, // In production, hash this!
    addresses: [],
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Auto login after registration
  localStorage.setItem(USER_KEY, JSON.stringify(newUser));

  return { success: true, user: newUser };
};

// Login user
export const loginUser = (emailOrPhone, password) => {
  const users = getUsers();
  const user = users.find(
    (u) => (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password
  );

  if (user) {
    // Remove password from stored user object
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
    return { success: true, user: userWithoutPassword };
  }

  return { success: false, error: 'Invalid email/phone or password' };
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem(USER_KEY);
};

// Check if user is logged in
export const isUserLoggedIn = () => {
  return getCurrentUser() !== null;
};

// Get all users (for admin)
const getUsers = () => {
  const usersStr = localStorage.getItem(USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : [];
};

// Save user address
export const saveAddress = (address) => {
  const user = getCurrentUser();
  if (!user) return { success: false, error: 'Not logged in' };

  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === user.id);

  if (userIndex === -1) return { success: false, error: 'User not found' };

  const addressToSave = {
    id: Date.now().toString(),
    ...address,
    isDefault: users[userIndex].addresses.length === 0,
  };

  users[userIndex].addresses.push(addressToSave);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Update current user
  const updatedUser = { ...user, addresses: users[userIndex].addresses };
  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

  return { success: true, address: addressToSave };
};

// Update user profile
export const updateProfile = (updates) => {
  const user = getCurrentUser();
  if (!user) return { success: false, error: 'Not logged in' };

  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === user.id);

  if (userIndex === -1) return { success: false, error: 'User not found' };

  const updatedUser = { ...users[userIndex], ...updates };
  users[userIndex] = updatedUser;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Remove password from stored user object
  const { password: _, ...userWithoutPassword } = updatedUser;
  localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));

  return { success: true, user: userWithoutPassword };
};

// Save order
export const saveOrder = (orderData) => {
  // Format order to match Google Sheets structure
  const orders = getOrders();
  const user = getCurrentUser();
  const now = new Date();

  // Calculate quantity and unit price from items
  const totalQuantity = orderData.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalAmount = orderData.total || 0;
  const unitPrice = totalQuantity > 0 ? Math.round(totalAmount / totalQuantity) : 0;

  // Format date as DD/MM/YYYY
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  // Format billing month and reference month
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthIndex = now.getMonth();
  const billingMonth = `${monthNames[monthIndex]}'${year.toString().slice(-2)}`;
  const referenceMonth = `${monthIndex + 1}(${monthNames[monthIndex].substring(0, 3)}'${year.toString().slice(-2)})`;

  const order = {
    id: Date.now().toString(),
    sNo: (orders.length + 1).toString(),
    userId: user ? user.id : null,
    // Google Sheets structure
    date: formattedDate,
    deliveryAddress: orderData.address,
    quantity: totalQuantity,
    unitPrice: unitPrice,
    totalAmount: totalAmount,
    status: 'pending',
    paymentMode: orderData.paymentMode || 'Online',
    billingMonth: billingMonth,
    referenceMonth: referenceMonth,
    year: year.toString(),
    // Backward compatibility
    customerName: orderData.name,
    customerPhone: orderData.phone,
    customerAddress: orderData.address,
    items: orderData.items,
    total: totalAmount,
    createdAt: now.toISOString(),
  };

  orders.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

  

  return { success: true, order };
};

// Get user orders
export const getUserOrders = () => {
  const user = getCurrentUser();
  if (!user) return [];

  const orders = getOrders();
  return orders.filter((o) => o.userId === user.id).reverse();
};

// Get all orders (for admin)
const getOrders = () => {
  const ordersStr = localStorage.getItem(ORDERS_KEY);
  return ordersStr ? JSON.parse(ordersStr) : [];
};
