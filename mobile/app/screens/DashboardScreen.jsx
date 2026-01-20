import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { api } from '../../lib/api';
import { formatCurrency, getTotalRevenue, isPendingStatus } from '../utils/orderUtils';

export default function DashboardScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await api.getOrders();
      const list = Array.isArray(res?.data) ? res.data : [];
      setOrders(list);
    } catch (e) {
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);
  const onRefresh = () => { setRefreshing(true); load(); };

  const revenue = getTotalRevenue(orders);
  const pending = orders.filter((o) => isPendingStatus(o.status, o.paymentStatus));
  const pendingAmount = getTotalRevenue(pending);

  if (loading) {
    return <View style={styles.centered}><Text style={styles.muted}>Loading…</Text></View>;
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#449031" />}
    >
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Total revenue</Text>
        <Text style={styles.cardValue}>{formatCurrency(revenue)}</Text>
      </View>
      <View style={styles.row}>
        <View style={[styles.card, styles.half]}>
          <Text style={styles.cardLabel}>Orders</Text>
          <Text style={styles.cardValue}>{orders.length}</Text>
        </View>
        <View style={[styles.card, styles.half]}>
          <Text style={styles.cardLabel}>Pending</Text>
          <Text style={[styles.cardValue, styles.pending]}>{formatCurrency(pendingAmount)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingBottom: 32 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  muted: { color: '#9ca3af', fontSize: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  cardLabel: { fontSize: 13, color: '#6b7280', marginBottom: 4 },
  cardValue: { fontSize: 22, fontWeight: '700', color: '#111' },
  pending: { color: '#d97706' },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1, marginBottom: 0 },
});
