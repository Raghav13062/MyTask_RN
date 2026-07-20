import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setProducts, setLoading } from '../../redux/product/productSlice';
import { productService } from '../../services/product.service';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { FAB, ActivityIndicator, Searchbar } from 'react-native-paper';
import colors from '../../theme/colors';

export default function ProductListScreen({ route, navigation }: any) {
  const { projectId, projectName, vendorId } = route.params;
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state: RootState) => state.product);
  const [searchQuery, setSearchQuery] = useState('');

  const loadProducts = async () => {
    dispatch(setLoading(true));
    try {
      const data = await productService.getProductsByProject(projectId);
      dispatch(setProducts(data));
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: `${projectName} Products` });
    const unsubscribe = navigation.addListener('focus', () => {
      loadProducts();
    });
    return unsubscribe;
  }, [navigation, projectId, projectName]);

  const handleDelete = (productId: string, productName: string) => {
    Alert.alert('Delete', `Delete product ${productName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await productService.deleteProduct(productId);
        loadProducts();
      }}
    ]);
  };

  const filteredProducts = products.filter(p => p.productName?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search Products"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      {loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id}
          ListEmptyComponent={<EmptyState title="No products found" />}
          renderItem={({ item }) => (
            <Card
              title={item.productName}
              subtitle={`$${item.price.toFixed(2)} - ${item.description}`}
              action={
                <View style={{ flexDirection: 'row' }}>
                  <FAB icon="pencil" size="small" onPress={() => navigation.navigate('AddProduct', { projectId, vendorId, productId: item.id })} style={styles.actionFab} />
                  <FAB icon="delete" size="small" onPress={() => handleDelete(item.id, item.productName)} style={[styles.actionFab, { backgroundColor: colors.danger }]} color="white" />
                </View>
              }
            />
          )}
        />
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddProduct', { projectId, vendorId })}
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
