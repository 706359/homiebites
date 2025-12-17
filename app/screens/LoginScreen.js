import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { loginUser, register } from '../utils/userAuthMobile'

export default function LoginScreen() {
  const navigation = useNavigation()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })
  
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields')
      return
    }

    setError('')
    setLoading(true)
    const result = await loginUser(loginForm.email, loginForm.password)
    setLoading(false)
    
    if (result.success) {
      // Force navigation reset
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      })
    } else {
      setError(result.error || 'Invalid credentials')
    }
  }

  const handleRegister = async () => {
    if (!registerForm.name || !registerForm.email || !registerForm.phone || !registerForm.password) {
      setError('Please fill in all fields')
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setError('')
    setLoading(true)
    const result = await register(
      registerForm.name,
      registerForm.email,
      registerForm.phone,
      registerForm.password
    )
    setLoading(false)
    
    if (result.success) {
      // Force navigation reset
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      })
    } else {
      setError(result.error || 'Registration failed')
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.wrapper}>
        {/* Left Section - Image (hidden on mobile, shown on tablet) */}
        <View style={styles.leftSection}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>🍽️</Text>
          </View>
        </View>

        {/* Right Section - Form */}
        <View style={styles.rightSection}>
          <View style={styles.content}>
            <Text style={styles.title}>Account</Text>

            {/* Tabs */}
            <View style={styles.tabs}>
              <TouchableOpacity 
                style={[styles.tab, isLogin && styles.tabActive]}
                onPress={() => {
                  setIsLogin(true)
                  setError('')
                }}
              >
                <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>LOG IN</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, !isLogin && styles.tabActive]}
                onPress={() => {
                  setIsLogin(false)
                  setError('')
                }}
              >
                <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>SIGN UP</Text>
              </TouchableOpacity>
            </View>

            {isLogin ? (
              <View style={styles.form}>
                <View style={styles.formField}>
                  <Text style={styles.label}>Email or Phone</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email or phone"
                    value={loginForm.email}
                    onChangeText={(text) => setLoginForm({...loginForm, email: text})}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChangeText={(text) => setLoginForm({...loginForm, password: text})}
                    secureTextEntry
                  />
                </View>
                {error ? <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View> : null}
                <TouchableOpacity 
                  style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={styles.submitButtonText}>
                    {loading ? 'LOGGING IN...' : 'LOG IN'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.form}>
                <View style={styles.formField}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={registerForm.name}
                    onChangeText={(text) => setRegisterForm({...registerForm, name: text})}
                  />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.label}>Email or Phone</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={registerForm.email}
                    onChangeText={(text) => setRegisterForm({...registerForm, email: text})}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.label}>Phone</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your phone number"
                    value={registerForm.phone}
                    onChangeText={(text) => setRegisterForm({...registerForm, phone: text})}
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter password (min 6 characters)"
                    value={registerForm.password}
                    onChangeText={(text) => setRegisterForm({...registerForm, password: text})}
                    secureTextEntry
                  />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    value={registerForm.confirmPassword}
                    onChangeText={(text) => setRegisterForm({...registerForm, confirmPassword: text})}
                    secureTextEntry
                  />
                </View>
                {error ? <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View> : null}
                <TouchableOpacity 
                  style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  <Text style={styles.submitButtonText}>
                    {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Info Section */}
          </View>
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
  contentContainer: {
    flexGrow: 1,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 600,
  },
  leftSection: {
    flex: 1,
    backgroundColor: '#FF6B35', // var(--primary-orange)
    display: 'none', // Hidden on mobile by default
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B35', // var(--primary-orange)
  },
  imagePlaceholderText: {
    fontSize: 80,
  },
  rightSection: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },
  content: {
    maxWidth: 450,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 40,
    color: '#000',
    letterSpacing: -0.5,
  },
  tabs: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tab: {
    paddingVertical: 12,
    position: 'relative',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B35', // var(--primary-orange)
    marginBottom: -1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  form: {
    marginBottom: 32,
  },
  formField: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  errorContainer: {
    backgroundColor: 'rgba(204, 51, 51, 0.1)',
    borderRadius: 4,
    padding: 12,
    marginTop: -8,
    marginBottom: 16,
  },
  errorText: {
    color: '#cc3333',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#FF6B35', // var(--primary-orange)
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  info: {
    marginTop: 32,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoText: {
    color: '#666',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 24,
  },
  benefits: {
    gap: 12,
  },
  benefitItem: {
    color: '#000',
    fontSize: 15,
    lineHeight: 24,
    paddingLeft: 24,
  },
})

