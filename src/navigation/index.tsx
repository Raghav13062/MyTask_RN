import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import LoginScreen from '../screens/Login/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VendorsScreen from '../screens/VendorsScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import ProductsScreen from '../screens/ProductsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const userId = useSelector((state: RootState) => state.auth.userId);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userId == null ? (
           <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          </>
        ) : (
           <>
            <Stack.Screen name="Vendors" component={VendorsScreen} />
            <Stack.Screen name="Projects" component={ProjectsScreen} />
            <Stack.Screen name="Products" component={ProductsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
