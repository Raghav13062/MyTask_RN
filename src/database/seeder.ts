import { database } from '../database';
import User from '../database/models/User';
import Vendor from '../database/models/Vendor';
import Project from '../database/models/Project';
import Product from '../database/models/Product';
import bcrypt from 'react-native-bcrypt';

export const seedDemoData = async () => {
  const userCount = await database.collections.get('users').query().fetchCount();
  if (userCount > 0) {
    return; 
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync('123456', salt);

  await database.write(async () => {
     const user = await database.collections.get<User>('users').create(u => {
      u.name = 'John Doe';
      u.email = 'john@example.com';
      u.password = hash;
    });

     const appleVendor = await database.collections.get<Vendor>('vendors').create(v => {
      v.user.id = user.id;
      v.vendorName = 'Apple Store';
      v.address = 'Cupertino, CA';
    });

     const iphoneProject = await database.collections.get<Project>('projects').create(p => {
      p.vendor.id = appleVendor.id;
      p.projectName = 'iPhone Project';
      p.description = 'All iPhone products';
    });
    
    const macProject = await database.collections.get<Project>('projects').create(p => {
      p.vendor.id = appleVendor.id;
      p.projectName = 'MacBook Project';
      p.description = 'All Mac products';
    });

     await database.collections.get<Product>('products').create(p => {
      p.project.id = iphoneProject.id;
      p.vendor.id = appleVendor.id;
      p.productName = 'iPhone 16';
      p.price = 999;
      p.description = 'Latest iPhone';
    });

    await database.collections.get<Product>('products').create(p => {
      p.project.id = macProject.id;
      p.vendor.id = appleVendor.id;
      p.productName = 'MacBook Pro';
      p.price = 1999;
      p.description = 'M4 Max';
    });

     const samsungVendor = await database.collections.get<Vendor>('vendors').create(v => {
      v.user.id = user.id;
      v.vendorName = 'Samsung';
      v.address = 'Seoul, SK';
    });

     const galaxyProject = await database.collections.get<Project>('projects').create(p => {
      p.vendor.id = samsungVendor.id;
      p.projectName = 'Galaxy Project';
      p.description = 'Galaxy devices';
    });

     await database.collections.get<Product>('products').create(p => {
      p.project.id = galaxyProject.id;
      p.vendor.id = samsungVendor.id;
      p.productName = 'Galaxy S25';
      p.price = 899;
      p.description = 'Latest Galaxy';
    });

    await database.collections.get<Product>('products').create(p => {
      p.project.id = galaxyProject.id;
      p.vendor.id = samsungVendor.id;
      p.productName = 'Galaxy Tab';
      p.price = 699;
      p.description = 'Android Tablet';
    });
  });
};
