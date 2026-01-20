import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getBaseUrl, api } from '../../lib/api';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [changing, setChanging] = useState(false);
  const [pwError, setPwError] = useState('');
  const base = getBaseUrl();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  const validateNewPassword = (p) => {
    if (!p || p.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(p)) return 'Include an uppercase letter';
    if (!/[a-z]/.test(p)) return 'Include a lowercase letter';
    if (!/\d/.test(p)) return 'Include a number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(p)) return 'Include a special character';
    return '';
  };

  const handleChangePassword = async () => {
    setPwError('');
    const curr = (currentPw || '').trim();
    const newp = (newPw || '').trim();
    const conf = (confirmPw || '').trim();
    if (!curr) {
      setPwError('Current password is required');
      return;
    }
    const err = validateNewPassword(newp);
    if (err) {
      setPwError(err);
      return;
    }
    if (newp !== conf) {
      setPwError('New password and confirm do not match');
      return;
    }
    setChanging(true);
    try {
      await api.changePassword(curr, newp);
      Alert.alert('Done', 'Password changed successfully.');
      setShowChangePw(false);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (e) {
      setPwError(e?.message || 'Failed to change password');
    } finally {
      setChanging(false);
    }
  };

  const closePwModal = () => {
    setShowChangePw(false);
    setPwError('');
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {user?.email ? (
        <View style={styles.card}>
          <Text style={styles.label}>Account</Text>
          <Text style={styles.value}>{user.email}</Text>
          {user.name ? <Text style={styles.sub}>{user.name}</Text> : null}
        </View>
      ) : null}
      <View style={styles.card}>
        <Text style={styles.label}>API</Text>
        <Text style={styles.value} numberOfLines={2}>{base || 'Not set (EXPO_PUBLIC_API_URL)'}</Text>
      </View>
      <TouchableOpacity
        style={styles.cardButton}
        onPress={() => setShowChangePw(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.cardButtonText}>Change password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, loggingOut && styles.btnDisabled]} onPress={handleLogout} disabled={loggingOut} activeOpacity={0.8}>
        <Text style={styles.btnText}>{loggingOut ? 'Logging out…' : 'Logout'}</Text>
      </TouchableOpacity>

      <Modal visible={showChangePw} transparent={true} animationType="fade">
        <TouchableOpacity style={modalStyles.overlay} activeOpacity={1} onPress={closePwModal}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={modalStyles.kav}>
            <View style={modalStyles.box} onStartShouldSetResponder={() => true}>
              <Text style={modalStyles.title}>Change password</Text>
              {pwError ? <Text style={modalStyles.err}>{pwError}</Text> : null}
              <Text style={modalStyles.label}>Current password</Text>
              <TextInput
                style={modalStyles.input}
                value={currentPw}
                onChangeText={setCurrentPw}
                placeholder="Current password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={true}
                autoCapitalize="none"
                editable={!changing}
              />
              <Text style={modalStyles.label}>New password</Text>
              <TextInput
                style={modalStyles.input}
                value={newPw}
                onChangeText={setNewPw}
                placeholder="Min 8 chars, upper, lower, number, special"
                placeholderTextColor="#9ca3af"
                secureTextEntry={true}
                autoCapitalize="none"
                editable={!changing}
              />
              <Text style={modalStyles.label}>Confirm new password</Text>
              <TextInput
                style={modalStyles.input}
                value={confirmPw}
                onChangeText={setConfirmPw}
                placeholder="Confirm"
                placeholderTextColor="#9ca3af"
                secureTextEntry={true}
                autoCapitalize="none"
                editable={!changing}
              />
              <View style={modalStyles.row}>
                <TouchableOpacity style={modalStyles.cancel} onPress={closePwModal} disabled={changing}>
                  <Text style={modalStyles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[modalStyles.submit, changing && modalStyles.submitDisabled]}
                  onPress={handleChangePassword}
                  disabled={changing}
                >
                  {changing ? <ActivityIndicator size="small" color="#fff" /> : <Text style={modalStyles.submitText}>Change</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  label: { fontSize: 13, color: '#6b7280', marginBottom: 4 },
  value: { fontSize: 16, color: '#111', fontWeight: '500' },
  sub: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  cardButton: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  cardButtonText: { fontSize: 16, color: '#449031', fontWeight: '600' },
  btn: { backgroundColor: '#dc2626', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  kav: { width: '100%', alignItems: 'center' },
  box: { backgroundColor: '#fff', borderRadius: 14, padding: 20, width: '100%', maxWidth: 360 },
  title: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 14 },
  err: { color: '#dc2626', fontSize: 14, marginBottom: 10 },
  label: { fontSize: 14, color: '#374151', marginBottom: 6, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, marginBottom: 14, backgroundColor: '#fafafa' },
  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancel: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  cancelText: { fontSize: 16, color: '#6b7280', fontWeight: '500' },
  submit: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10, backgroundColor: '#449031' },
  submitDisabled: { opacity: 0.6 },
  submitText: { fontSize: 16, color: '#fff', fontWeight: '600' },
});
