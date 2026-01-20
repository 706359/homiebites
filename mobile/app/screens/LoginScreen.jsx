import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getBaseUrl } from '../../lib/api';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const base = getBaseUrl();
  const hasApi = !!base;

  const handleLogin = async () => {
    setError('');
    const e = (email || '').trim();
    const p = (password || '').trim();
    if (!e || !p) {
      setError('Email/username and password are required');
      return;
    }
    setLoading(true);
    try {
      await login(e, p);
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
        <Text style={styles.title}>HomieBites Admin</Text>
        <Text style={styles.sub}>Sign in to continue</Text>
        {!hasApi && (
          <View style={styles.warn}>
            <Text style={styles.warnText}>Set EXPO_PUBLIC_API_URL to your backend (e.g. https://your-app.vercel.app or http://localhost:5050)</Text>
          </View>
        )}
        {error ? <Text style={styles.err}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email or username"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="default"
          autoCorrect={false}
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Sign in</Text>}
        </TouchableOpacity>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ee' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 360, backgroundColor: '#fff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  title: { fontSize: 24, fontWeight: '700', color: '#111', marginBottom: 4 },
  sub: { fontSize: 15, color: '#6b7280', marginBottom: 20 },
  warn: { backgroundColor: '#fef3c7', padding: 12, borderRadius: 10, marginBottom: 16 },
  warnText: { fontSize: 13, color: '#92400e' },
  err: { color: '#dc2626', fontSize: 14, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, marginBottom: 12, backgroundColor: '#fafafa' },
  btn: { backgroundColor: '#449031', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
