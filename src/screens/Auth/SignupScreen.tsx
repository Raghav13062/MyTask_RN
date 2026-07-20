import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/auth/authSlice';
import { authService } from '../../services/auth.service';
import colors from '../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Snackbar, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppStatusBar from '@/components/AppStatusBar';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function SignupScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data: any) => {
    try {
      const user = await authService.signup(data.name, data.email, data.password);
      dispatch(loginSuccess(user.id));
    } catch (error: any) {
      setSnackbarMessage(error.message);
      setSnackbarVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
                <AppStatusBar />
    
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
           <View style={styles.iconContainer}>
             <Icon name="account-plus-outline" size={60} color={colors.primary} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to start managing vendors</Text>
          
          <Input control={control} name="name" label="Name" />
          <Input control={control} name="email" label="Email" keyboardType="email-address" />
          <Input control={control} name="password" label="Password" secureTextEntry />
          
          <Button title="Sign Up" onPress={handleSubmit(onSubmit)} loading={isSubmitting} style={styles.button} />
          
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
            <Text style={styles.linkText}>Already have an account? <Text style={styles.linkTextBold}>Login</Text></Text>
          </TouchableOpacity>
       </KeyboardAvoidingView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    marginTop: 12,
    paddingVertical: 6,
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  linkTextBold: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  snackbar: {
    backgroundColor: colors.danger,
  },
});

