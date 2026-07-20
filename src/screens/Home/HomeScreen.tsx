import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import colors from '../../theme/colors';
import { setDashboardStats } from '../../redux/dashboard/dashboardSlice';
import { vendorService } from '../../services/vendor.service';
import { projectService } from '../../services/project.service';
import { productService } from '../../services/product.service';
import { logout } from '../../redux/auth/authSlice';
import { addToCart, removeFromCart } from '../../redux/cart/cartSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button as PaperButton, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStatusBar from '@/components/AppStatusBar';

import { authService } from '../../services/auth.service';

export const DUMMY_VENDORS = [
  {
    id: 1,
    vendorName: "Sharma Electronics",
    ownerName: "Rajesh Sharma",
    phone: "+91 9876543210",
    address: "MG Road, Indore",
    products: [
      {
        id: 101,
        productName: "iPhone 15 Pro",
        icon: "cellphone",
        category: "Mobile",
        price: 129999,
        stock: 10,
        offer: "10%",
      },
      {
        id: 102,
        productName: "Samsung Galaxy S24",
        icon: "cellphone",
        category: "Mobile",
        price: 89999,
        stock: 15,
        offer: "8%",
      },
      {
        id: 103,
        productName: "Dell XPS 13",
        icon: "laptop",
        category: "Laptop",
        price: 119999,
        stock: 5,
        offer: "5%",
      },
    ],
  },

  {
    id: 2,
    vendorName: "Gupta Mobile Hub",
    ownerName: "Amit Gupta",
    phone: "+91 9876543211",
    address: "Vijay Nagar, Indore",
    products: [
      {
        id: 201,
        productName: "OnePlus 13",
        icon: "cellphone",
        category: "Mobile",
        price: 69999,
        stock: 20,
        offer: "12%",
      },
      {
        id: 202,
        productName: "Apple Watch Series 10",
        icon: "watch-variant",
        category: "Watch",
        price: 45999,
        stock: 12,
        offer: "10%",
      },
      {
        id: 203,
        productName: "Sony WH-1000XM5",
        icon: "headphones",
        category: "Audio",
        price: 27999,
        stock: 8,
        offer: "15%",
      },
    ],
  },

  {
    id: 3,
    vendorName: "Tech World",
    ownerName: "Rahul Verma",
    phone: "+91 9876543212",
    address: "Palasia, Indore",
    products: [
      {
        id: 301,
        productName: "MacBook Air M3",
        icon: "laptop",
        category: "Laptop",
        price: 114999,
        stock: 6,
        offer: "7%",
      },
      {
        id: 302,
        productName: "HP Pavilion",
        icon: "laptop",
        category: "Laptop",
        price: 74999,
        stock: 9,
        offer: "9%",
      },
      {
        id: 303,
        productName: "LG 32-inch Monitor",
        icon: "monitor",
        category: "Monitor",
        price: 18999,
        stock: 14,
        offer: "11%",
      },
    ],
  },
];

export default function HomeScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const { totalVendors, totalProjects, totalProducts } = useSelector((state: RootState) => state.dashboard);
  const { items: cartItems, totalQuantity, totalPrice } = useSelector((state: RootState) => state.cart);
  
  const [activeVendor, setActiveVendor] = useState<string>('All');
  const [userEmail, setUserEmail] = useState<string>('');

  const allDummyProducts = DUMMY_VENDORS.flatMap(v => v.products.map(p => ({ ...p, vendorName: v.vendorName })));
  const vendorNames = ['All', ...Array.from(new Set(allDummyProducts.map(p => p.vendorName)))];

  const filteredProducts = activeVendor === 'All' 
    ? allDummyProducts 
    : allDummyProducts.filter(p => p.vendorName === activeVendor);

  const loadStats = async () => {
    if (!userId) return;
    try {
      const user = await authService.getUserById(userId);
      setUserEmail(user.email);
      
      const vendors = await vendorService.getVendorsByUser(userId);
      const projects = await projectService.getAllProjectsByUser(userId);
      const products = await productService.getAllProductsByUser(userId);
      
      dispatch(setDashboardStats({
        totalVendors: vendors.length,
        totalProjects: projects.length,
        totalProducts: products.length,
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

  const getProductQuantity = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <AppStatusBar/>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Home Store</Text>
          {userEmail ? <Text style={styles.userEmail}>{userEmail}</Text> : null}
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Icon name="logout" size={24} color={colors.danger} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Cart')}>
        <Surface style={styles.cartSummary} >
          <View style={styles.cartIconContainer}>
            <Icon name="cart-outline" size={28} color={colors.primary} />
            {totalQuantity > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalQuantity}</Text>
              </View>
            )}
          </View>
          <View style={styles.cartDetails}>
            <Text style={styles.cartTotalText}>Total Cart Value</Text>
            <Text style={styles.cartPriceText}>₹{totalPrice.toLocaleString('en-IN')}</Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </Surface>
      </TouchableOpacity>

      <ScrollView style={styles.container}>
     

        <Text style={styles.sectionTitle}>Vendors</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {vendorNames.map((vendor, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.categoryChip, activeVendor === vendor && styles.categoryChipActive]}
              onPress={() => setActiveVendor(vendor)}
            >
              <Text style={[styles.categoryChipText, activeVendor === vendor && styles.categoryChipTextActive]}>{vendor}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Trending Products ({filteredProducts.length})</Text>
        <View style={styles.productGrid}>
          {filteredProducts.map((product, index) => {
            const quantity = getProductQuantity(product.id);
            return (
              <Surface key={index} style={styles.productCard} >
                <View style={styles.imagePlaceholder}>
                  <Icon name={product.icon as any} size={40} color={colors.placeholder} />
                  <View style={styles.offerBadge}>
                    <Text style={styles.offerText}>{product.offer} OFF</Text>
                  </View>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{product.productName}</Text>
                  <Text style={styles.productCategory}>{product.category} - {product.vendorName}</Text>
                  <Text style={styles.productPrice}>₹{product.price.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.productActions}>
                  {quantity > 0 ? (
                    <View style={styles.stepperContainer}>
                      <TouchableOpacity 
                        style={styles.stepperBtn} 
                        onPress={() => dispatch(removeFromCart(product.id))}
                      >
                        <Icon name="minus" size={20} color={colors.white} />
                      </TouchableOpacity>
                      <Text style={styles.stepperText}>{quantity}</Text>
                      <TouchableOpacity 
                        style={styles.stepperBtn} 
                        onPress={() => dispatch(addToCart({ id: product.id, productName: product.productName, price: product.price }))}
                      >
                        <Icon name="plus" size={20} color={colors.white} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <PaperButton 
                      mode="contained" 
                      buttonColor={colors.secondary} 
                      compact 
                      style={styles.actionBtn}
                      onPress={() => dispatch(addToCart({ id: product.id, productName: product.productName, price: product.price }))}
                    >
                      Add to Cart
                    </PaperButton>
                  )}
                </View>
              </Surface>
            );
          })}
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
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutBtn: {
    padding: 5,
  },
  cartSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cartIconContainer: {
    position: 'relative',
    marginRight: 15,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: colors.danger,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartDetails: {
    flex: 1,
  },
  cartTotalText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  cartPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.success,
  },
  clearBtn: {
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
  categoryScroll: {
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: "white",
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
    position: 'relative',
  },
  offerBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  offerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  productCategory: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
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
    minHeight: 45,
    justifyContent: 'center',
  },
  actionBtn: {
    width: '100%',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperBtn: {
    backgroundColor: colors.primary,
    padding: 6,
    borderRadius: 6,
  },
  stepperText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    paddingHorizontal: 10,
  },
});
