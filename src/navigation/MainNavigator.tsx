import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import VendorListScreen from '../screens/Vendor/VendorListScreen';
import VendorDetailsScreen from '../screens/Vendor/VendorDetailsScreen';
import AddVendorScreen from '../screens/Vendor/AddVendorScreen';
 import ProductListScreen from '../screens/Product/ProductListScreen';
import AddProductScreen from '../screens/Product/AddProductScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import CartScreen from '../screens/Cart/CartScreen';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide header for all screens
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.surface,
        contentStyle: { backgroundColor: colors.background },
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="VendorList" component={VendorListScreen} />
      <Stack.Screen name="VendorDetails" component={VendorDetailsScreen} />
      <Stack.Screen name="AddVendor" component={AddVendorScreen} />
      <Stack.Screen name="EditVendor" component={AddVendorScreen} />

      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />

      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}