import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Product extends Model {
  static table = 'products';

  @text('project_id') projectId!: string;
  @text('vendor_id') vendorId!: string;
  @text('product_name') productName!: string;
  @field('price') price!: number;
  @text('description') description?: string;
  @text('image') image?: string;
  @readonly @date('created_at') createdAt!: Date;
}
