import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { api } from '../../lib/api';

function genOrderId() {
  const n = new Date();
  const y = n.getFullYear();
  const m = String(n.getMonth() + 1).padStart(2, '0');
  const d = String(n.getDate()).padStart(2, '0');
  const r = Math.random().toString(36).slice(2, 8);
  return `HB-${y}${m}${d}-${r}`;
}

export default function AddOrderScreen() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState('100');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.getSettings();
        const v = res?.data?.defaultUnitPrice;
        if (!cancelled && v != null && !isNaN(Number(v)) && Number(v) >= 0) {
          setUnitPrice(String(Math.round(Number(v))));
        }
      } catch (_) {}
    })();
    return () => { cancelled = true; };
  }, []);
  const [mode, setMode] = useState('Lunch');
  const [status, setStatus] = useState('Unpaid');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const q = Math.max(1, parseInt(quantity, 10) || 1);
  const p = parseFloat(unitPrice) || 0;
  const total = (q * p).toFixed(0);

  const submit = async () => {
    setError('');
    const addr = (deliveryAddress || '').trim();
    if (!addr || addr.length < 3) {
      setError('Address must be at least 3 characters');
      return;
    }
    if (q < 1) { setError('Quantity must be at least 1'); return; }
    if (p < 0) { setError('Unit price cannot be negative'); return; }
    setLoading(true);
    try {
      await api.createOrder({
        orderId: genOrderId(),
        date: new Date(date).toISOString(),
        deliveryAddress: addr,
        quantity: q,
        unitPrice: p,
        totalAmount: q * p,
        mode: mode || 'Lunch',
        status: status || 'Unpaid',
        paymentMode: paymentMode || 'Cash',
        notes: (notes || '').trim(),
      });
      Alert.alert('Done', 'Order added successfully.', [{ text: 'OK' }]);
      setDeliveryAddress('');
      setQuantity('1');
      setUnitPrice('100');
      setStatus('Unpaid');
      setNotes('');
    } catch (e) {
      setError(e?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.kav} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {error ? <Text style={styles.err}>{error}</Text> : null}
        <Text style={styles.label}>Date</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" placeholderTextColor="#9ca3af" editable={!loading} />
        <Text style={styles.label}>Address *</Text>
        <TextInput style={[styles.input, styles.area]} value={deliveryAddress} onChangeText={setDeliveryAddress} placeholder="Delivery address" placeholderTextColor="#9ca3af" multiline={true} editable={!loading} />
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Qty</Text>
            <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="number-pad" placeholder="1" placeholderTextColor="#9ca3af" editable={!loading} />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Unit price (₹)</Text>
            <TextInput style={styles.input} value={unitPrice} onChangeText={setUnitPrice} keyboardType="decimal-pad" placeholder="100" placeholderTextColor="#9ca3af" editable={!loading} />
          </View>
        </View>
        <Text style={styles.label}>Total — ₹{total}</Text>
        <Text style={styles.label}>Mode</Text>
        <View style={styles.row}>
          {['Lunch', 'Dinner'].map((m) => (
            <TouchableOpacity key={m} style={[styles.chip, mode === m && styles.chipActive]} onPress={() => setMode(m)} disabled={loading}>
              <Text style={[styles.chipText, mode === m && styles.chipTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Status</Text>
        <View style={styles.row}>
          {['Paid', 'Unpaid'].map((s) => (
            <TouchableOpacity key={s} style={[styles.chip, status === s && styles.chipActive]} onPress={() => setStatus(s)} disabled={loading}>
              <Text style={[styles.chipText, status === s && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Payment mode</Text>
        <View style={styles.row}>
          {['Cash', 'UPI', 'Card', 'Online'].map((pm) => (
            <TouchableOpacity key={pm} style={[styles.chip, paymentMode === pm && styles.chipActive]} onPress={() => setPaymentMode(pm)} disabled={loading}>
              <Text style={[styles.chipText, paymentMode === pm && styles.chipTextActive]}>{pm}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Notes</Text>
        <TextInput style={[styles.input, styles.area]} value={notes} onChangeText={setNotes} placeholder="Optional" placeholderTextColor="#9ca3af" multiline={true} editable={!loading} />
        <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={submit} disabled={loading} activeOpacity={0.8}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Add Order</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kav: { flex: 1 },
  scroll: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingBottom: 40 },
  err: { color: '#dc2626', fontSize: 14, marginBottom: 12 },
  label: { fontSize: 14, color: '#374151', marginBottom: 6, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, backgroundColor: '#fff', marginBottom: 16 },
  area: { minHeight: 72 },
  row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginBottom: 16 },
  half: { flex: 1, minWidth: 120 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' },
  chipActive: { borderColor: '#449031', backgroundColor: '#ecfdf5' },
  chipText: { fontSize: 15, color: '#6b7280' },
  chipTextActive: { color: '#449031', fontWeight: '600' },
  btn: { backgroundColor: '#449031', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
