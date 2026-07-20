import { Model } from '@nozbe/watermelondb';
import { text, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Vendor extends Model {
  static table = 'vendors';

  @text('user_id') userId!: string;
  @text('vendor_name') vendorName!: string;
  @text('address') address?: string;
  @readonly @date('created_at') createdAt!: Date;
}
