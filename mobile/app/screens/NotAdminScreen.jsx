import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function NotAdminScreen() {
  const { logout, user } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin access required</Text>
      <Text style={styles.sub}>Your account does not have admin rights.</Text>
      {user?.email ? <Text style={styles.email}>{user.email}</Text> : null}
      <TouchableOpacity style={styles.btn} onPress={logout} activeOpacity={0.8}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f9fafb' },
  title: { fontSize: 20, fontWeight: '600', color: '#111', marginBottom: 8 },
  sub: { fontSize: 15, color: '#6b7280', marginBottom: 4 },
  email: { fontSize: 14, color: '#9ca3af', marginBottom: 24 },
  btn: { backgroundColor: '#449031', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
