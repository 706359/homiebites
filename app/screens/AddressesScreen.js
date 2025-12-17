import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getCurrentUser, saveAddress, updateProfile } from '../utils/userAuthMobile'

export default function AddressesScreen({ navigation }) {
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    landmark: '',
    pincode: ''
  })

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }

  const handleSave = async () => {
    if (!form.name || !form.phone || !form.address) {
      Alert.alert('Error', 'Please fill in required fields')
      return
    }

    const result = await saveAddress(form)
    if (result.success) {
      await loadUser()
      setForm({
        name: '',
        phone: '',
        address: '',
        landmark: '',
        pincode: ''
      })
      Alert.alert('Success', 'Address saved successfully!')
    } else {
      Alert.alert('Error', result.error)
    }
  }

  const setDefault = async (addressId) => {
    const updatedAddresses = user.addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }))
    
    const result = await updateProfile({ addresses: updatedAddresses })
    if (result.success) {
      await loadUser()
    }
  }

  const deleteAddress = async (addressId) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId)
            const result = await updateProfile({ addresses: updatedAddresses })
            if (result.success) {
              await loadUser()
            }
          }
        }
      ]
    )
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Addresses</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Add New Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={form.name}
          onChangeText={(text) => setForm({...form, name: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={form.phone}
          onChangeText={(text) => setForm({...form, phone: text})}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Address"
          value={form.address}
          onChangeText={(text) => setForm({...form, address: text})}
          multiline
          numberOfLines={3}
        />
        <TextInput
          style={styles.input}
          placeholder="Landmark (optional)"
          value={form.landmark}
          onChangeText={(text) => setForm({...form, landmark: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Pincode (optional)"
          value={form.pincode}
          onChangeText={(text) => setForm({...form, pincode: text})}
          keyboardType="number-pad"
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Address</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.addresses}>
        <Text style={styles.sectionTitle}>Your Addresses</Text>
        {user.addresses && user.addresses.length > 0 ? (
          user.addresses.map((addr) => (
            <View key={addr.id} style={[styles.addressCard, addr.isDefault && styles.defaultCard]}>
              {addr.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Default</Text>
                </View>
              )}
              <Text style={styles.addressName}>{addr.name}</Text>
              <Text style={styles.addressPhone}>{addr.phone}</Text>
              <Text style={styles.addressText}>{addr.address}</Text>
              {addr.landmark && <Text style={styles.addressText}>Landmark: {addr.landmark}</Text>}
              {addr.pincode && <Text style={styles.addressText}>Pincode: {addr.pincode}</Text>}
              <View style={styles.addressActions}>
                {!addr.isDefault && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => setDefault(addr.id)}
                  >
                    <Text style={styles.actionButtonText}>Set as Default</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => deleteAddress(addr.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#c33" />
                  <Text style={[styles.actionButtonText, styles.deleteText]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noAddresses}>No saved addresses yet</Text>
        )}
      </View>
    </ScrollView>
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
  form: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#FF6B35',
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  addresses: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    position: 'relative',
  },
  defaultCard: {
    borderColor: '#39b86f',
    backgroundColor: '#f0fdf4',
  },
  defaultBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#39b86f',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  addressPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
    lineHeight: 20,
  },
  addressActions: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    gap: 5,
  },
  deleteButton: {
    borderColor: '#ffcccc',
    backgroundColor: '#fff5f5',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  deleteText: {
    color: '#c33',
  },
  noAddresses: {
    textAlign: 'center',
    color: '#666',
    padding: 40,
  },
})

