import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { addToCart, removeFromCart, clearCart } from '../../redux/cart/cartSlice';
import colors from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Surface, Button as PaperButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStatusBar from '@/components/AppStatusBar';

export default function CartScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalPrice } = useSelector((state: RootState) => state.cart);

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContent}>
          <Icon name="cart-remove" size={80} color={colors.placeholder} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Looks like you haven't added anything yet.</Text>
          <PaperButton 
            mode="contained" 
            buttonColor={colors.primary} 
            style={styles.shopBtn}
            onPress={() => navigation.goBack()}
          >
            Start Shopping
          </PaperButton>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <AppStatusBar/>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart ({totalQuantity})</Text>
        <TouchableOpacity onPress={() => dispatch(clearCart())} style={styles.clearBtn}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {items.map((item, index) => (
          <Surface key={index} style={styles.cartItem} elevation={1}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.stepperContainer}>
              <TouchableOpacity 
                style={styles.stepperBtn} 
                onPress={() => dispatch(removeFromCart(item.id))}
              >
                <Icon name="minus" size={20} color={colors.white} />
              </TouchableOpacity>
              <Text style={styles.stepperText}>{item.quantity}</Text>
              <TouchableOpacity 
                style={styles.stepperBtn} 
                onPress={() => dispatch(addToCart({ id: item.id, productName: item.productName, price: item.price }))}
              >
                <Icon name="plus" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          </Surface>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      <Surface style={styles.checkoutFooter} elevation={8}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Items</Text>
          <Text style={styles.summaryValue}>{totalQuantity}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabelBold}>Total Price</Text>
          <Text style={styles.summaryValueBold}>₹{totalPrice.toLocaleString('en-IN')}</Text>
        </View>
        <PaperButton 
          mode="contained" 
          buttonColor={colors.secondary} 
          style={styles.checkoutBtn}
          onPress={() => {
            dispatch(clearCart());
            navigation.goBack();
          }}
        >
          Checkout
        </PaperButton>
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  clearBtn: {
    padding: 5,
  },
  clearText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 10,
    textAlign: 'center',
  },
  shopBtn: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    padding: 15,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.success,
    marginTop: 5,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 2,
  },
  stepperBtn: {
    backgroundColor: colors.primary,
    padding: 4,
    borderRadius: 6,
  },
  stepperText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    paddingHorizontal: 12,
  },
  checkoutFooter: {
    padding: 20,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  summaryLabelBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  summaryValueBold: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.success,
  },
  checkoutBtn: {
    marginTop: 15,
    paddingVertical: 6,
  },
});
