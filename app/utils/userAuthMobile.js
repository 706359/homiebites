// Mobile-compatible user authentication using AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

const USER_KEY = 'homiebites_user'
const USERS_KEY = 'homiebites_users'
const ORDERS_KEY = 'homiebites_orders'

// Get current user
export const getCurrentUser = async () => {
  try {
    const userStr = await AsyncStorage.getItem(USER_KEY)
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  } catch (error) {
    return null
  }
}

// Register new user
export const register = async (name, email, phone, password) => {
  try {
    const usersStr = await AsyncStorage.getItem(USERS_KEY)
    const users = usersStr ? JSON.parse(usersStr) : []
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' }
    }
    
    // Check if phone already exists
    if (users.find(u => u.phone === phone)) {
      return { success: false, error: 'Phone number already registered' }
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      password,
      addresses: [],
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users))
    
    // Auto login after registration
    const { password: _, ...userWithoutPassword } = newUser
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword))
    
    return { success: true, user: userWithoutPassword }
  } catch (error) {
    return { success: false, error: 'Registration failed' }
  }
}

// Login user
export const loginUser = async (emailOrPhone, password) => {
  try {
    const usersStr = await AsyncStorage.getItem(USERS_KEY)
    const users = usersStr ? JSON.parse(usersStr) : []
    const user = users.find(u => 
      (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password
    )
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword))
      return { success: true, user: userWithoutPassword }
    }
    
    return { success: false, error: 'Invalid email/phone or password' }
  } catch (error) {
    return { success: false, error: 'Login failed' }
  }
}

// Logout user
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY)
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Check if user is logged in
export const isUserLoggedIn = async () => {
  const user = await getCurrentUser()
  return user !== null
}

// Save user address
export const saveAddress = async (address) => {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Not logged in' }
    
    const usersStr = await AsyncStorage.getItem(USERS_KEY)
    const users = usersStr ? JSON.parse(usersStr) : []
    const userIndex = users.findIndex(u => u.id === user.id)
    
    if (userIndex === -1) return { success: false, error: 'User not found' }
    
    const addressToSave = {
      id: Date.now().toString(),
      ...address,
      isDefault: users[userIndex].addresses.length === 0
    }
    
    users[userIndex].addresses.push(addressToSave)
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users))
    
    // Update current user
    const updatedUser = { ...user, addresses: users[userIndex].addresses }
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
    
    return { success: true, address: addressToSave }
  } catch (error) {
    return { success: false, error: 'Failed to save address' }
  }
}

// Update user profile
export const updateProfile = async (updates) => {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Not logged in' }
    
    const usersStr = await AsyncStorage.getItem(USERS_KEY)
    const users = usersStr ? JSON.parse(usersStr) : []
    const userIndex = users.findIndex(u => u.id === user.id)
    
    if (userIndex === -1) return { success: false, error: 'User not found' }
    
    const updatedUser = { ...users[userIndex], ...updates }
    users[userIndex] = updatedUser
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users))
    
    // Remove password from stored user object
    const { password: _, ...userWithoutPassword } = updatedUser
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword))
    
    return { success: true, user: userWithoutPassword }
  } catch (error) {
    return { success: false, error: 'Failed to update profile' }
  }
}

// Save order
export const saveOrder = async (orderData) => {
  try {
    const ordersStr = await AsyncStorage.getItem(ORDERS_KEY)
    const orders = ordersStr ? JSON.parse(ordersStr) : []
    const user = await getCurrentUser()
    
    const order = {
      id: Date.now().toString(),
      userId: user ? user.id : null,
      customerName: orderData.name,
      customerPhone: orderData.phone,
      customerAddress: orderData.address,
      items: orderData.items,
      total: orderData.total,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    orders.push(order)
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
    
    return { success: true, order }
  } catch (error) {
    return { success: false, error: 'Failed to save order' }
  }
}

// Get user orders
export const getUserOrders = async () => {
  try {
    const user = await getCurrentUser()
    if (!user) return []
    
    const ordersStr = await AsyncStorage.getItem(ORDERS_KEY)
    const orders = ordersStr ? JSON.parse(ordersStr) : []
    return orders.filter(o => o.userId === user.id).reverse()
  } catch (error) {
    return []
  }
}

