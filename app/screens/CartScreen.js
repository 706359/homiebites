import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { getCurrentUser, saveOrder } from '../utils/userAuthMobile'

export default function CartScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const [cart, setCart] = useState(route.params?.cart || {})
  const [user, setUser] = useState(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const currentUser = await getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      if (currentUser.addresses && currentUser.addresses.length > 0) {
        const defaultAddress = currentUser.addresses.find(a => a.isDefault) || currentUser.addresses[0]
        setCustomerInfo({
          name: currentUser.name,
          phone: currentUser.phone,
          address: `${defaultAddress.address}${defaultAddress.landmark ? ', ' + defaultAddress.landmark : ''}${defaultAddress.pincode ? ' - ' + defaultAddress.pincode : ''}`
        })
      } else {
        setCustomerInfo({
          name: currentUser.name,
          phone: currentUser.phone,
          address: ''
        })
      }
    }
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

  const handleOrder = async () => {
    if (Object.keys(cart).length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart')
      return
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      Alert.alert('Missing Information', 'Please fill in all customer details')
      return
    }

    const items = Object.entries(cart).map(([key, item]) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }))

    const orderData = {
      name: customerInfo.name,
      phone: customerInfo.phone,
      address: customerInfo.address,
      items: items,
      total: getTotal()
    }

    // Save order
    await saveOrder(orderData)

    const itemsText = items.map(item => 
      `${item.name} x${item.quantity} (₹${item.price * item.quantity})`
    ).join('\n')

    const message = `🍽️ *Order from HomieBites*

👤 *Customer Details:*
Name: ${customerInfo.name}
Phone: ${customerInfo.phone}
Address: ${customerInfo.address}

📋 *Order Items:*
${itemsText}

💰 *Total Amount: ₹${getTotal()}*

Please confirm this order. Thank you!`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/919958983578?text=${encodedMessage}`
    
    Linking.openURL(whatsappUrl).catch(() => {
      Alert.alert('Error', 'Could not open WhatsApp')
    })

    Alert.alert('Order Sent!', 'Your order has been sent to WhatsApp and saved to your order history.')
    
    // Clear cart and navigate
    setCart({})
    navigation.navigate('Tabs', { screen: 'Menu' })
  }

  if (Object.keys(cart).length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => navigation.navigate('Tabs', { screen: 'Menu' })}
        >
          <Text style={styles.shopButtonText}>Browse Menu</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.cartItems}>
        {Object.entries(cart).map(([key, item]) => (
          <View key={key} style={styles.cartItem}>
            <View style={styles.cartItemInfo}>
              <Text style={styles.cartItemName}>{item.name}</Text>
              <Text style={styles.cartItemPrice}>
                ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => removeFromCart(key)}
            >
              <Ionicons name="trash-outline" size={20} color="#c33" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalAmount}>₹{getTotal()}</Text>
      </View>

      <View style={styles.customerForm}>
        <Text style={styles.formTitle}>Delivery Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={customerInfo.name}
          onChangeText={(text) => setCustomerInfo({...customerInfo, name: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={customerInfo.phone}
          onChangeText={(text) => setCustomerInfo({...customerInfo, phone: text})}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Delivery Address"
          value={customerInfo.address}
          onChangeText={(text) => setCustomerInfo({...customerInfo, address: text})}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
        <Ionicons name="logo-whatsapp" size={24} color="#fff" />
        <Text style={styles.orderButtonText}>Order via WhatsApp</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  cartItems: {
    padding: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 10,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 8,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B35',
  },
  customerForm: {
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  orderButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25D366',
    padding: 18,
    margin: 20,
    borderRadius: 25,
    gap: 10,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
})

