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

export const DUMMY_VENDORS = [
  {
    id: 1,
    vendorName: "Apple Store",
    products: [
      { id: 101, productName: "iPhone 15 Pro", icon: "cellphone", category: "Mobile", price: 129999, stock: 15, offer: "10%" },
      { id: 102, productName: "iPhone 15", icon: "cellphone", category: "Mobile", price: 89999, stock: 20, offer: "8%" },
      { id: 103, productName: "MacBook Air M3", icon: "laptop", category: "Laptop", price: 114999, stock: 10, offer: "5%" },
      { id: 104, productName: "MacBook Pro M4", icon: "laptop", category: "Laptop", price: 189999, stock: 6, offer: "7%" },
      { id: 105, productName: "Apple Watch", icon: "watch-variant", category: "Watch", price: 45999, stock: 18, offer: "10%" },
      { id: 106, productName: "AirPods Pro", icon: "headphones", category: "Audio", price: 24999, stock: 25, offer: "12%" },
      { id: 107, productName: "iPad Pro", icon: "tablet", category: "Tablet", price: 89999, stock: 12, offer: "6%" },
      { id: 108, productName: "Magic Mouse", icon: "mouse", category: "Accessory", price: 7999, stock: 30, offer: "15%" },
      { id: 109, productName: "Magic Keyboard", icon: "keyboard", category: "Accessory", price: 12999, stock: 16, offer: "9%" },
      { id: 110, productName: "Studio Display", icon: "monitor", category: "Monitor", price: 159999, stock: 5, offer: "4%" },
    ],
  },
  {
    id: 2,
    vendorName: "Samsung Store",
    products: [
      { id: 201, productName: "Galaxy S24 Ultra", icon: "cellphone", category: "Mobile", price: 109999, stock: 20, offer: "15%" },
      { id: 202, productName: "Galaxy S24", icon: "cellphone", category: "Mobile", price: 79999, stock: 22, offer: "10%" },
      { id: 203, productName: "Galaxy Z Fold", icon: "cellphone", category: "Mobile", price: 154999, stock: 8, offer: "5%" },
      { id: 204, productName: "Galaxy Tab S9", icon: "tablet", category: "Tablet", price: 74999, stock: 10, offer: "8%" },
      { id: 205, productName: "Galaxy Watch 7", icon: "watch-variant", category: "Watch", price: 29999, stock: 22, offer: "12%" },
      { id: 206, productName: "Galaxy Buds 3", icon: "headphones", category: "Audio", price: 14999, stock: 35, offer: "18%" },
      { id: 207, productName: "Samsung TV", icon: "television", category: "TV", price: 68999, stock: 12, offer: "14%" },
      { id: 208, productName: "Samsung Monitor", icon: "monitor", category: "Monitor", price: 18999, stock: 18, offer: "9%" },
      { id: 209, productName: "Samsung SSD", icon: "harddisk", category: "Storage", price: 8999, stock: 50, offer: "20%" },
      { id: 210, productName: "Samsung Keyboard", icon: "keyboard", category: "Accessory", price: 2999, stock: 40, offer: "16%" },
      { id: 211, productName: "Samsung Mouse", icon: "mouse", category: "Accessory", price: 1999, stock: 55, offer: "22%" },
      { id: 212, productName: "Samsung Speaker", icon: "speaker", category: "Speaker", price: 9999, stock: 15, offer: "11%" },
    ],
  },
  {
    id: 3,
    vendorName: "Sony Center",
    products: [
      { id: 301, productName: "PlayStation 5", icon: "gamepad-variant", category: "Gaming", price: 54999, stock: 8, offer: "5%" },
      { id: 302, productName: "DualSense", icon: "controller-classic", category: "Gaming", price: 5999, stock: 30, offer: "10%" },
      { id: 303, productName: "Sony Camera", icon: "camera", category: "Camera", price: 65999, stock: 9, offer: "12%" },
      { id: 304, productName: "Sony Lens", icon: "camera-iris", category: "Camera", price: 32999, stock: 6, offer: "7%" },
      { id: 305, productName: "Sony WH-1000XM5", icon: "headphones", category: "Headphone", price: 27999, stock: 18, offer: "20%" },
      { id: 306, productName: "Sony Speaker", icon: "speaker", category: "Speaker", price: 9999, stock: 30, offer: "25%" },
      { id: 307, productName: "Sony Bravia TV", icon: "television", category: "TV", price: 84999, stock: 6, offer: "10%" },
      { id: 308, productName: "Sony Soundbar", icon: "speaker-wireless", category: "Audio", price: 24999, stock: 15, offer: "14%" },
      { id: 309, productName: "Sony Microphone", icon: "microphone", category: "Audio", price: 12999, stock: 20, offer: "9%" },
    ],
  },
  {
    id: 4,
    vendorName: "Dell Store",
    products: [
      { id: 401, productName: "Dell XPS 13", icon: "laptop", category: "Laptop", price: 139999, stock: 8, offer: "8%" },
      { id: 402, productName: "Dell Inspiron", icon: "laptop", category: "Laptop", price: 69999, stock: 15, offer: "10%" },
      { id: 403, productName: "Dell Alienware", icon: "laptop", category: "Gaming", price: 189999, stock: 5, offer: "6%" },
      { id: 404, productName: "Dell Monitor", icon: "monitor", category: "Monitor", price: 18999, stock: 25, offer: "12%" },
      { id: 405, productName: "Dell Keyboard", icon: "keyboard", category: "Accessory", price: 2999, stock: 40, offer: "18%" },
      { id: 406, productName: "Dell Mouse", icon: "mouse", category: "Accessory", price: 1499, stock: 60, offer: "20%" },
      { id: 407, productName: "Dell Dock", icon: "dock-window", category: "Accessory", price: 9999, stock: 12, offer: "9%" },
      { id: 408, productName: "Dell Webcam", icon: "webcam", category: "Accessory", price: 4999, stock: 18, offer: "14%" },
      { id: 409, productName: "Dell Backpack", icon: "bag-personal", category: "Bag", price: 2499, stock: 35, offer: "15%" },
      { id: 410, productName: "Dell SSD", icon: "harddisk", category: "Storage", price: 7999, stock: 22, offer: "17%" },
    ],
  },
];

export default function HomeScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const { totalVendors, totalProjects, totalProducts } = useSelector((state: RootState) => state.dashboard);
  const { items: cartItems, totalQuantity, totalPrice } = useSelector((state: RootState) => state.cart);
  
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const allDummyProducts = DUMMY_VENDORS.flatMap(v => v.products.map(p => ({ ...p, vendorName: v.vendorName })));
  const categories = ['All', ...Array.from(new Set(allDummyProducts.map(p => p.category)))];

  const filteredProducts = activeCategory === 'All' 
    ? allDummyProducts 
    : allDummyProducts.filter(p => p.category === activeCategory);

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
        <Text style={styles.headerTitle}>Home Store</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Icon name="logout" size={24} color={colors.danger} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Cart')}>
        <Surface style={styles.cartSummary} elevation={4}>
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
     

        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((cat, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryChipText, activeCategory === cat && styles.categoryChipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Trending Products ({filteredProducts.length})</Text>
        <View style={styles.productGrid}>
          {filteredProducts.map((product, index) => {
            const quantity = getProductQuantity(product.id);
            return (
              <Surface key={index} style={styles.productCard} elevation={2}>
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
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
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
