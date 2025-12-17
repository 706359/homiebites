import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export default function HomeScreen() {
  const navigation = useNavigation()

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>HOMIEBITES</Text>
        <Text style={styles.tagline}>Homely, Healthy Meals</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Experience the Taste of Home</Text>
        <Text style={styles.heroSubtitle}>
          Authentic Indian Vegetarian Meals, Freshly Prepared Daily
        </Text>
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Menu')}
        >
          <Text style={styles.ctaButtonText}>Order Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        <View style={styles.featureCard}>
          <Ionicons name="leaf" size={32} color="#39b86f" />
          <Text style={styles.featureTitle}>Pure Vegetarian</Text>
          <Text style={styles.featureText}>Fresh, wholesome ingredients</Text>
        </View>
        <View style={styles.featureCard}>
          <Ionicons name="water" size={32} color="#FF6B35" />
          <Text style={styles.featureTitle}>Less Oil & Spices</Text>
          <Text style={styles.featureText}>Healthy, balanced meals</Text>
        </View>
        <View style={styles.featureCard}>
          <Ionicons name="restaurant" size={32} color="#FF6B35" />
          <Text style={styles.featureTitle}>Home-like Taste</Text>
          <Text style={styles.featureText}>Authentic desi flavors</Text>
        </View>
        <View style={styles.featureCard}>
          <Ionicons name="bicycle" size={32} color="#39b86f" />
          <Text style={styles.featureTitle}>On-time Delivery</Text>
          <Text style={styles.featureText}>Meals delivered fresh</Text>
        </View>
      </View>

      <View style={styles.offerSection}>
        <Text style={styles.offerTitle}>Weekly Subscription Offer</Text>
        <Text style={styles.offerText}>
          Subscribe for a full week (7 days) and get 10% OFF on your total bill!
        </Text>
        <TouchableOpacity style={styles.offerButton}>
          <Text style={styles.offerButtonText}>Get This Deal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactItem}>
          <Ionicons name="call" size={24} color="#FF6B35" />
          <Text style={styles.contactText}>+91-9958983578</Text>
        </View>
        <View style={styles.contactItem}>
          <Ionicons name="location" size={24} color="#FF6B35" />
          <Text style={styles.contactText}>A1-405, Panchsheel Greens</Text>
        </View>
        <View style={styles.contactItem}>
          <Ionicons name="time" size={24} color="#FF6B35" />
          <Text style={styles.contactText}>Last order 7:30 PM • Delivery by 8:30 PM</Text>
        </View>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#000',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 14,
    color: '#666',
  },
  hero: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#fff7ef',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 25,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  offerSection: {
    margin: 20,
    padding: 25,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#39b86f',
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#000',
  },
  offerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  offerButton: {
    backgroundColor: '#39b86f',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  offerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  contactSection: {
    padding: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 15,
  },
})

