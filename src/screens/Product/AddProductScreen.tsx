import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { productService } from '../../services/product.service';
import colors from '../../theme/colors';
import { database } from '../../database';
import Product from '../../database/models/Product';

const schema = yup.object().shape({
  productName: yup.string().required('Product Name is required'),
  price: yup.number().required('Price is required').positive(),
  description: yup.string().required('Description is required'),
});

export default function AddProductScreen({ route, navigation }: any) {
  const { projectId, vendorId, productId } = route.params;
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { productName: '', price: '' as any, description: '' },
  });

  useEffect(() => {
    if (productId) {
      const loadProduct = async () => {
        const p = await database.collections.get<Product>('products').find(productId);
        reset({ productName: p.productName, price: p.price, description: p.description });
      };
      loadProduct();
    }
  }, [productId, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (productId) {
        await productService.updateProduct(productId, data.productName, Number(data.price), data.description);
      } else {
        await productService.addProduct(projectId, vendorId, data.productName, Number(data.price), data.description);
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
      <Input control={control} name="productName" label="Product Name" />
      <Input control={control} name="price" label="Price" keyboardType="numeric" />
      <Input control={control} name="description" label="Description" />
      <Button title={productId ? "Update Product" : "Add Product"} onPress={handleSubmit(onSubmit)} loading={loading || isSubmitting} />
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
