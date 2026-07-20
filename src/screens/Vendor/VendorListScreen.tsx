import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setVendors, setLoading } from '../../redux/vendor/vendorSlice';
import { vendorService } from '../../services/vendor.service';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { FAB, Searchbar, ActivityIndicator } from 'react-native-paper';
import colors from '../../theme/colors';

export default function VendorListScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const { vendors, loading } = useSelector((state: RootState) => state.vendor);
  const [searchQuery, setSearchQuery] = useState('');

  const loadVendors = async () => {
    if (!userId) return;
    dispatch(setLoading(true));
    try {
      const data = await vendorService.getVendorsByUser(userId);
      dispatch(setVendors(data));
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadVendors();
    });
    return unsubscribe;
  }, [navigation, userId]);

  const handleDelete = (vendorId: string, vendorName: string) => {
    Alert.alert('Delete', `Delete vendor ${vendorName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await vendorService.deleteVendor(vendorId);
        loadVendors();
      }}
    ]);
  };

  const filteredVendors = vendors.filter(v => v.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search Vendors"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      {loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : (
        <FlatList
          data={filteredVendors}
          keyExtractor={item => item.id}
          ListEmptyComponent={<EmptyState title="No vendors found" />}
          renderItem={({ item }) => (
            <Card
              title={item.vendorName}
              subtitle={item.address}
              onPress={() => navigation.navigate('VendorDetails', { vendorId: item.id, vendorName: item.vendorName })}
              action={
                <View style={{ flexDirection: 'row' }}>
                  <FAB icon="pencil" size="small" onPress={() => navigation.navigate('EditVendor', { vendorId: item.id })} style={styles.actionFab} />
                  <FAB icon="delete" size="small" onPress={() => handleDelete(item.id, item.vendorName)} style={[styles.actionFab, { backgroundColor: colors.danger }]} color="white" />
                </View>
              }
            />
          )}
        />
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddVendor')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.background,
  },
  searchbar: {
    marginBottom: 15,
    backgroundColor: colors.surface,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  actionFab: {
    marginHorizontal: 4,
    backgroundColor: colors.secondary,
  }
});
