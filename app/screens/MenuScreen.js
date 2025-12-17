import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { getMenuData } from '../utils/menuDataMobile'

export default function MenuScreen() {
  const navigation = useNavigation()
  const [menuData, setMenuData] = useState([])
  const [cart, setCart] = useState({})

  useEffect(() => {
    loadMenu()
  }, [])

  const loadMenu = async () => {
    const data = await getMenuData()
    setMenuData(data)
  }

  const addToCart = (categoryId, itemId, itemName, itemPrice) => {
    const key = `${categoryId}-${itemId}`
    setCart(prev => ({
      ...prev,
      [key]: {
        name: itemName,
        price: itemPrice,
        quantity: (prev[key]?.quantity || 0) + 1
      }
    }))
  }

  const removeFromCart = (key) => {
    setCart(prev => {
      const newCart = { ...prev }
      if (newCart[key].quantity > 1) {
        newCart[key].quantity -= 1
      } else {
        delete newCart[key]
      }
      return newCart
    })
  }

  const getTotal = () => {
    return Object.values(cart).reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  }

  const getCartCount = () => {
    return Object.values(cart).reduce((count, item) => count + item.quantity, 0)
  }

  // Pass cart to CartScreen when navigating
  const navigateToCart = () => {
    navigation.navigate('Cart', { cart })
  }

  // Update cart when component updates
  useEffect(() => {
    // This ensures cart state is maintained
  }, [cart])

  const renderCategory = ({ item: category }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <Ionicons name={category.icon} size={24} color="#FF6B35" />
        <Text style={styles.categoryTitle}>{category.category}</Text>
        {category.tag && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{category.tag}</Text>
          </View>
        )}
      </View>
      {category.description && (
        <Text style={styles.categoryDesc}>{category.description}</Text>
      )}
      {category.items.map((menuItem) => {
        const key = `${category.id}-${menuItem.id}`
        const cartItem = cart[key]
        return (
          <View key={menuItem.id} style={styles.menuItem}>
            <View style={styles.menuItemInfo}>
              <Text style={styles.itemName}>{menuItem.name}</Text>
              <Text style={styles.itemPrice}>₹{menuItem.price}</Text>
            </View>
            {cartItem ? (
              <View style={styles.cartControls}>
                <TouchableOpacity 
                  style={styles.qtyButton}
                  onPress={() => removeFromCart(key)}
                >
                  <Text style={styles.qtyButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{cartItem.quantity}</Text>
                <TouchableOpacity 
                  style={styles.qtyButton}
                  onPress={() => addToCart(category.id, menuItem.id, menuItem.name, menuItem.price)}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => addToCart(category.id, menuItem.id, menuItem.name, menuItem.price)}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        )
      })}
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu & Pricing</Text>
        {getCartCount() > 0 && (
          <TouchableOpacity 
            style={styles.cartBadge}
            onPress={navigateToCart}
          >
            <Ionicons name="cart" size={24} color="#fff" />
            <View style={styles.cartCount}>
              <Text style={styles.cartCountText}>{getCartCount()}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={menuData}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      {getCartCount() > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <Text style={styles.footerTotal}>Total: ₹{getTotal()}</Text>
            <Text style={styles.footerItems}>{getCartCount()} items</Text>
          </View>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={navigateToCart}
          >
            <Text style={styles.checkoutButtonText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  cartBadge: {
    position: 'relative',
  },
  cartCount: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#39b86f',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  cartCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    padding: 15,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    flex: 1,
  },
  tag: {
    backgroundColor: '#39b86f',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  categoryDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 15,
    lineHeight: 18,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuItemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
  },
  addButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cartControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 30,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  footerInfo: {
    flex: 1,
  },
  footerTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
  },
  footerItems: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  checkoutButton: {
    backgroundColor: '#39b86f',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

