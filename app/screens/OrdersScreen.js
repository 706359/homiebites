import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native'
import { getUserOrders } from '../utils/userAuthMobile'

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    const userOrders = await getUserOrders()
    setOrders(userOrders)
  }

  const renderOrder = ({ item: order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
          <Text style={styles.orderDate}>
            {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.statusBadge, styles[order.status]]}>
          <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {order.items.map((item, idx) => (
          <View key={idx} style={styles.orderItemRow}>
            <Text style={styles.orderItemName}>
              {item.name} × {item.quantity}
            </Text>
            <Text style={styles.orderItemPrice}>₹{item.price * item.quantity}</Text>
          </View>
        ))}
      </View>

      <View style={styles.orderTotal}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>₹{order.total}</Text>
      </View>

      <View style={styles.orderAddress}>
        <Text style={styles.addressLabel}>Delivery to:</Text>
        <Text style={styles.addressText}>{order.customerAddress}</Text>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 24 }} />
      </View>

      {orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
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
  list: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pending: {
    backgroundColor: '#fff3cd',
  },
  confirmed: {
    backgroundColor: '#d4edda',
  },
  delivered: {
    backgroundColor: '#d1ecf1',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
  },
  orderItems: {
    marginBottom: 15,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  orderItemName: {
    fontSize: 14,
    color: '#666',
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B35',
  },
  orderAddress: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  addressLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: '#000',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
})

