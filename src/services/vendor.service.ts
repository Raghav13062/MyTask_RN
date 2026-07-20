import { database } from '../database';
import Vendor from '../database/models/Vendor';
import { Q } from '@nozbe/watermelondb';

export const vendorService = {
  async getVendorsByUser(userId: string): Promise<Vendor[]> {
    return await database.collections
      .get<Vendor>('vendors')
      .query(Q.where('user_id', userId))
      .fetch();
  },

  async addVendor(userId: string, vendorName: string, address: string): Promise<Vendor> {
    let newVendor: Vendor | undefined;
    await database.write(async () => {
      newVendor = await database.collections.get<Vendor>('vendors').create(vendor => {
        vendor.user.id = userId;
        vendor.vendorName = vendorName;
        vendor.address = address;
      });
    });
    if (!newVendor) throw new Error('Failed to add vendor');
    return newVendor;
  },

  async updateVendor(vendorId: string, vendorName: string, address: string): Promise<void> {
    const vendor = await database.collections.get<Vendor>('vendors').find(vendorId);
    await database.write(async () => {
      await vendor.update(v => {
        v.vendorName = vendorName;
        v.address = address;
      });
    });
  },

  async deleteVendor(vendorId: string): Promise<void> {
    const vendor = await database.collections.get<Vendor>('vendors').find(vendorId);
    await database.write(async () => {
      await vendor.markAsDeleted();
      await vendor.destroyPermanently();
    });
  },
};
