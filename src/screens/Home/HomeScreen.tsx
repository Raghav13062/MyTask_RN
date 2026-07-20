import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Card } from '../../components/Card';
import colors from '../../theme/colors';
import { setDashboardStats } from '../../redux/dashboard/dashboardSlice';
import { vendorService } from '../../services/vendor.service';
import { projectService } from '../../services/project.service';
import { productService } from '../../services/product.service';
import { logout } from '../../redux/auth/authSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button as PaperButton, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStatusBar from '@/components/AppStatusBar';

export default function HomeScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const { totalVendors, totalProjects, totalProducts, recentVendors, recentProducts } = useSelector((state: RootState) => state.dashboard);

  const loadStats = async () => {
    if (!userId) return;
    try {
      const vendors = await vendorService.getVendorsByUser(userId);
      const projects = await projectService.getAllProjectsByUser(userId);
      const products = await productService.getAllProductsByUser(userId);
      
      dispatch(setDashboardStats({
        totalVendors: vendors.length,
        totalProjects: projects.length,
        totalProducts: products.length,
        recentVendors: vendors.slice(0, 3), // Just grab first 3 for demo
        recentProducts: products, // All products for e-commerce list
      }));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadStats();
    });
    return unsubscribe;
  }, [navigation, userId, dispatch]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) }
    ]);
  };

  const handleRemoveProduct = async (productId: string, productName: string) => {
    Alert.alert('Remove Product', `Are you sure you want to remove ${productName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
        try {
           await productService.deleteProduct(productId);
           loadStats(); // Reload after delete
        } catch (e) {
           console.error(e);
        }
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <AppStatusBar/>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Icon name="logout" size={24} color={colors.danger} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        
        <View style={styles.statsContainer}>
          <Surface style={styles.statCard} elevation={2}>
            <Text style={styles.statValue}>{totalVendors}</Text>
            <Text style={styles.statLabel}>Vendors</Text>
          </Surface>
          <Surface style={styles.statCard} elevation={2}>
            <Text style={styles.statValue}>{totalProjects}</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </Surface>
          <Surface style={styles.statCard} elevation={2}>
            <Text style={styles.statValue}>{totalProducts}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </Surface>
        </View>

        <Text style={styles.sectionTitle}>Recent Vendors</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vendorScroll}>
          {recentVendors.map((vendor, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.horizontalCard}
              onPress={() => navigation.navigate('VendorDetails', { vendorId: vendor.id, vendorName: vendor.vendorName })}
            >
              <Icon name="store" size={32} color={colors.primary} />
              <Text style={styles.vendorName} numberOfLines={1}>{vendor.vendorName}</Text>
              <Text style={styles.vendorAddress} numberOfLines={1}>{vendor.address || 'N/A'}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Your Products</Text>
        <View style={styles.productGrid}>
          {recentProducts.map((product, index) => (
            <Surface key={index} style={styles.productCard} elevation={2}>
              <View style={styles.imagePlaceholder}>
                <Icon name="image-outline" size={40} color={colors.placeholder} />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{product.productName}</Text>
                <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
              </View>
              <View style={styles.productActions}>
                <PaperButton mode="contained" buttonColor={colors.secondary} compact style={styles.actionBtn}>
                  Add to Cart
                </PaperButton>
                <PaperButton mode="text" textColor={colors.danger} compact onPress={() => handleRemoveProduct(product.id, product.productName)}>
                  Remove
                </PaperButton>
              </View>
            </Surface>
          ))}
          {recentProducts.length === 0 && (
            <Text style={{ textAlign: 'center', color: colors.placeholder, marginTop: 20 }}>No products found. Add a vendor and project first!</Text>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.surface,
   },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  logoutBtn: {
    padding: 5,
  },
  container: {
    flex: 1,
    padding: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    marginTop: 5,
  },
  vendorScroll: {
    marginBottom: 20,
  },
  horizontalCard: {
    width: 140,
    padding: 15,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
    textAlign: 'center',
  },
  vendorAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.success,
    marginTop: 5,
  },
  productActions: {
    padding: 10,
    paddingTop: 0,
    alignItems: 'center',
  },
  actionBtn: {
    width: '100%',
    marginBottom: 5,
  }
});
