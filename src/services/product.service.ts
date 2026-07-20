import { database } from '../database';
import Product from '../database/models/Product';
import { Q } from '@nozbe/watermelondb';

export const productService = {
  async getProductsByProject(projectId: string): Promise<Product[]> {
    return await database.collections
      .get<Product>('products')
      .query(Q.where('project_id', projectId))
      .fetch();
  },

  async getAllProductsByUser(userId: string): Promise<Product[]> {
    const vendors = await database.collections.get('vendors').query(Q.where('user_id', userId)).fetch();
    const vendorIds = vendors.map(v => v.id);
    if (vendorIds.length === 0) return [];

    return await database.collections
      .get<Product>('products')
      .query(Q.where('vendor_id', Q.oneOf(vendorIds)))
      .fetch();
  },

  async addProduct(projectId: string, vendorId: string, productName: string, price: number, description: string, image?: string): Promise<Product> {
    let newProduct: Product | undefined;
    await database.write(async () => {
      newProduct = await database.collections.get<Product>('products').create(product => {
        product.projectId = projectId;
        product.vendorId = vendorId;
        product.productName = productName;
        product.price = price;
        product.description = description;
        if (image) product.image = image;
      });
    });
    if (!newProduct) throw new Error('Failed to add product');
    return newProduct;
  },

  async updateProduct(productId: string, productName: string, price: number, description: string, image?: string): Promise<void> {
    const product = await database.collections.get<Product>('products').find(productId);
    await database.write(async () => {
      await product.update(p => {
        p.productName = productName;
        p.price = price;
        p.description = description;
        if (image) p.image = image;
      });
    });
  },

  async deleteProduct(productId: string): Promise<void> {
    const product = await database.collections.get<Product>('products').find(productId);
    await database.write(async () => {
      await product.markAsDeleted();
      await product.destroyPermanently();
    });
  },
};
