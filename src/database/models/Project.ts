import { Model } from '@nozbe/watermelondb';
import { field, text, date, relation, children } from '@nozbe/watermelondb/decorators';
import Vendor from './Vendor';
import Product from './Product';

export default class Project extends Model {
  static table = 'projects';

  @text('project_name') projectName!: string;
  @text('description') description!: string;
  @date('created_at') createdAt!: number;

  @relation('vendors', 'vendor_id') vendor!: any;
  @children('products') products!: any;
}
