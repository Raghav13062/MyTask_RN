import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
  import ProductListScreen from '../screens/Product/ProductListScreen';
import AddProductScreen from '../screens/Product/AddProductScreen';
 import CartScreen from '../screens/Cart/CartScreen';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,  
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.surface,
        contentStyle: { backgroundColor: colors.background },
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
       <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />

     </Stack.Navigator>
  );
}