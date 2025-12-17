// Mobile-compatible menu data management with AsyncStorage
// Uses shared menu data structure
import AsyncStorage from '@react-native-async-storage/async-storage'
import { defaultMenuData } from '../../shared/utils/menuData'

const MENU_DATA_KEY = 'homiebites_menu_data'

// Map web icons to mobile icons
const iconMap = {
  'fa-star': 'star',
  'fa-utensils': 'restaurant',
  'fa-bowl-rice': 'bowl',
  'fa-bread-slice': 'bread',
  'fa-plus': 'add',
  'fa-person-walking': 'walk'
}

const mapMenuDataForMobile = (data) => {
  return data.map(category => ({
    ...category,
    icon: iconMap[category.icon] || category.icon
  }))
}

export const getMenuData = async () => {
  try {
    const stored = await AsyncStorage.getItem(MENU_DATA_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return mapMenuDataForMobile(data)
    }
    // Initialize with default data
    const mappedData = mapMenuDataForMobile(defaultMenuData)
    await AsyncStorage.setItem(MENU_DATA_KEY, JSON.stringify(defaultMenuData))
    return mappedData
  } catch (error) {
    return mapMenuDataForMobile(defaultMenuData)
  }
}

export const saveMenuData = async (data) => {
  try {
    await AsyncStorage.setItem(MENU_DATA_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving menu data:', error)
  }
}

