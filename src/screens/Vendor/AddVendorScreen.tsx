import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { vendorService } from '../../services/vendor.service';
import colors from '../../theme/colors';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { database } from '../../database';
import Vendor from '../../database/models/Vendor';

const schema = yup.object().shape({
  vendorName: yup.string().required('Vendor Name is required'),
  address: yup.string().required('Address is required'),
});

export default function AddVendorScreen({ route, navigation }: any) {
  const vendorId = route.params?.vendorId;
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { vendorName: '', address: '' },
  });

  useEffect(() => {
    if (vendorId) {
      const loadVendor = async () => {
        const v = await database.collections.get<Vendor>('vendors').find(vendorId);
        reset({ vendorName: v.vendorName, address: v.address });
      };
      loadVendor();
    }
  }, [vendorId, reset]);

  const onSubmit = async (data: any) => {
    if (!userId) return;
    setLoading(true);
    try {
      if (vendorId) {
        await vendorService.updateVendor(vendorId, data.vendorName, data.address);
      } else {
        await vendorService.addVendor(userId, data.vendorName, data.address);
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input control={control} name="vendorName" label="Vendor Name" />
      <Input control={control} name="address" label="Address" />
      <Button title={vendorId ? "Update Vendor" : "Add Vendor"} onPress={handleSubmit(onSubmit)} loading={loading || isSubmitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.background,
  },
});
