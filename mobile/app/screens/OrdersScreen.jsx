import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { api } from '../../lib/api';
import { formatCurrency, parseOrderDate, isPendingStatus } from '../utils/orderUtils';

function formatD(v) {
  const d = parseOrderDate(v);
  if (!d) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
}

function OrderRow({ item, onPress }) {
  const addr = item.deliveryAddress || item.customerAddress || item.address || '—';
  const status = item.paymentStatus || item.status || '—';
  return (
    <TouchableOpacity style={rowStyles.wrap} onPress={() => onPress(item)} activeOpacity={0.7}>
      <Text style={rowStyles.date}>{formatD(item.date || item.order_date)}</Text>
      <Text style={rowStyles.addr} numberOfLines={1}>{addr}</Text>
      <View style={rowStyles.foot}>
        <Text style={rowStyles.amount}>{formatCurrency(item.totalAmount ?? item.total ?? 0)}</Text>
        <Text style={[rowStyles.status, isPendingStatus(item.status, item.paymentStatus) && rowStyles.statusUnpaid]}>
          {status}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const rowStyles = StyleSheet.create({
  wrap: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  date: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  addr: { fontSize: 15, color: '#111', marginBottom: 6 },
  foot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amount: { fontWeight: '600', color: '#111' },
  status: { fontSize: 13, color: '#6b7280' },
  statusUnpaid: { color: '#d97706', fontWeight: '500' },
});

function OrderDetailModal({ visible, order, onClose, onUpdated }) {
  const [updating, setUpdating] = useState(false);
  if (!order) return null;

  const id = (order._id && String(order._id)) || order.orderId;
  const isPaid = (order.paymentStatus || order.status || '').toLowerCase() === 'paid';

  const setPayment = async (paymentStatus) => {
    if (!id) return;
    setUpdating(true);
    try {
      await api.updateOrder(id, { paymentStatus: paymentStatus === 'paid' ? 'Paid' : 'Unpaid' });
      onUpdated?.();
      onClose();
    } catch (e) {
      Alert.alert('Error', e?.message || 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableOpacity style={modalStyles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={modalStyles.box} onStartShouldSetResponder={() => true}>
          <Text style={modalStyles.title}>Order details</Text>
          <Text style={modalStyles.row}><Text style={modalStyles.label}>Date: </Text>{formatD(order.date)}</Text>
          <Text style={modalStyles.row}><Text style={modalStyles.label}>Address: </Text>{order.deliveryAddress || order.address || '—'}</Text>
          <Text style={modalStyles.row}><Text style={modalStyles.label}>Qty: </Text>{order.quantity ?? '—'}</Text>
          <Text style={modalStyles.row}><Text style={modalStyles.label}>Unit price: </Text>{formatCurrency(order.unitPrice ?? 0)}</Text>
          <Text style={modalStyles.row}><Text style={modalStyles.label}>Total: </Text>{formatCurrency(order.totalAmount ?? order.total ?? 0)}</Text>
          <Text style={modalStyles.row}><Text style={modalStyles.label}>Mode: </Text>{order.mode || '—'}</Text>
          <Text style={modalStyles.row}><Text style={modalStyles.label}>Status: </Text>{order.paymentStatus || order.status || '—'}</Text>
          <Text style={modalStyles.row}><Text style={modalStyles.label}>Payment: </Text>{order.paymentMode || '—'}</Text>
          {order.notes ? <Text style={modalStyles.row}><Text style={modalStyles.label}>Notes: </Text>{order.notes}</Text> : null}
          <View style={modalStyles.actions}>
            {isPaid ? (
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.btnUnpaid]}
                onPress={() => setPayment('unpaid')}
                disabled={updating}
              >
                {updating ? <ActivityIndicator size="small" color="#fff" /> : <Text style={modalStyles.btnText}>Mark Unpaid</Text>}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.btnPaid]}
                onPress={() => setPayment('paid')}
                disabled={updating}
              >
                {updating ? <ActivityIndicator size="small" color="#fff" /> : <Text style={modalStyles.btnText}>Mark Paid</Text>}
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={modalStyles.close} onPress={onClose}>
            <Text style={modalStyles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  box: { backgroundColor: '#fff', borderRadius: 14, padding: 20, width: '100%', maxWidth: 360 },
  title: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 14 },
  row: { fontSize: 15, color: '#374151', marginBottom: 6 },
  label: { color: '#6b7280', fontWeight: '500' },
  actions: { marginTop: 16, marginBottom: 10 },
  btn: { borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  btnPaid: { backgroundColor: '#449031' },
  btnUnpaid: { backgroundColor: '#d97706' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  close: { alignSelf: 'center', paddingVertical: 8 },
  closeText: { color: '#6b7280', fontSize: 15 },
});

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All'); // 'All' | 'Unpaid'
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const load = async () => {
    try {
      const res = await api.getOrders();
      setOrders(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);
  const onRefresh = () => { setRefreshing(true); load(); };

  const filtered = filter === 'Unpaid'
    ? orders.filter((o) => isPendingStatus(o.status, o.paymentStatus))
    : orders;

  const openOrder = (item) => {
    setSelected(item);
    setModalVisible(true);
  };

  if (loading) {
    return <View style={styles.centered}><Text style={styles.muted}>Loading…</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.chips}>
        {['All', 'Unpaid'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, filter === f && styles.chipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(o) => o._id || o.orderId || o.id || String(Math.random())}
        renderItem={({ item }) => <OrderRow item={item} onPress={openOrder} />}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#449031" />}
        ListEmptyComponent={<Text style={styles.muted}>{filter === 'Unpaid' ? 'No unpaid orders' : 'No orders yet'}</Text>}
      />
      <OrderDetailModal
        visible={modalVisible}
        order={selected}
        onClose={() => { setModalVisible(false); setSelected(null); }}
        onUpdated={load}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  chips: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' },
  chipActive: { borderColor: '#449031', backgroundColor: '#ecfdf5' },
  chipText: { fontSize: 15, color: '#6b7280' },
  chipTextActive: { color: '#449031', fontWeight: '600' },
  list: { padding: 16, paddingBottom: 32 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  muted: { color: '#9ca3af', fontSize: 15, textAlign: 'center', marginTop: 24 },
});
