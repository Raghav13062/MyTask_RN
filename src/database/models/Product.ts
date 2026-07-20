import { Model } from '@nozbe/watermelondb';
import { field, text, date, relation } from '@nozbe/watermelondb/decorators';
import Project from './Project';
import Vendor from './Vendor';

export default class Product extends Model {
  static table = 'products';

  @text('product_name') productName!: string;
  @field('price') price!: number;
  @text('description') description!: string;
  @text('image') image!: string;
  @date('created_at') createdAt!: number;

  @relation('projects', 'project_id') project!: any;
  @relation('vendors', 'vendor_id') vendor!: any;
}
