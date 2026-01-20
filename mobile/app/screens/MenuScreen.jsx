import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, SectionList } from 'react-native';
import { api } from '../../lib/api';

function formatPrice(n) {
  if (n == null || isNaN(Number(n))) return '';
  return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 });
}

export default function MenuScreen() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await api.getMenu();
      const data = Array.isArray(res?.data) ? res.data : [];
      setMenu(data);
    } catch {
      setMenu([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);
  const onRefresh = () => { setRefreshing(true); load(); };

  const sections = menu
    .filter((cat) => cat && (cat.category || cat.name))
    .map((cat) => ({
      title: cat.category || cat.name || 'Other',
      data: Array.isArray(cat.items) ? cat.items : [],
    }))
    .filter((s) => s.data.length > 0);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>Loading menu…</Text>
      </View>
    );
  }

  if (sections.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.empty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#449031" />}
      >
        <Text style={styles.muted}>No menu items yet</Text>
      </ScrollView>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.name || item.id || String(Math.random())}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.itemName}>{item.name || '—'}</Text>
          {item.price != null && item.price !== '' ? (
            <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
          ) : null}
        </View>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      )}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#449031" />}
      stickySectionHeadersEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 32, backgroundColor: '#f9fafb' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f9fafb' },
  muted: { color: '#9ca3af', fontSize: 15, textAlign: 'center' },
  sectionHeader: { backgroundColor: '#449031', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, marginTop: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 14, marginBottom: 6, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  itemName: { fontSize: 15, color: '#111', flex: 1 },
  itemPrice: { fontSize: 15, fontWeight: '600', color: '#449031', marginLeft: 12 },
});
