import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import colors from '../../theme/colors';
import { database } from '../../database';
import Vendor from '../../database/models/Vendor';
import Project from '../../database/models/Project';
import Product from '../../database/models/Product';
import { Q } from '@nozbe/watermelondb';

export default function VendorDetailsScreen({ route, navigation }: any) {
  const { vendorId, vendorName } = route.params;
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    navigation.setOptions({ title: vendorName });
    const loadDetails = async () => {
      const v = await database.collections.get<Vendor>('vendors').find(vendorId);
      setVendor(v);

      const projects = await database.collections.get<Project>('projects').query(Q.where('vendor_id', vendorId)).fetchCount();
      setProjectCount(projects);

      const products = await database.collections.get<Product>('products').query(Q.where('vendor_id', vendorId)).fetchCount();
      setProductCount(products);
    };
    loadDetails();
  }, [vendorId, vendorName, navigation]);

  return (
    <View style={styles.container}>
      {vendor && (
        <Card
          title={vendor.vendorName}
          subtitle={`Address: ${vendor.address}`}
        />
      )}
      <View style={styles.stats}>
        <Card title={projectCount.toString()} subtitle="Projects" style={styles.statCard} />
        <Card title={productCount.toString()} subtitle="Products" style={styles.statCard} />
      </View>

      <Button title="View Projects" onPress={() => navigation.navigate('ProjectList', { vendorId, vendorName })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.background,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  }
});
