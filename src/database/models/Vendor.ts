import { Model } from '@nozbe/watermelondb';
import { field, text, date, relation, children } from '@nozbe/watermelondb/decorators';
import User from './User';
import Project from './Project';

export default class Vendor extends Model {
  static table = 'vendors';

  @text('vendor_name') vendorName!: string;
  @text('address') address!: string;
  @date('created_at') createdAt!: number;

  @relation('users', 'user_id') user!: any;
  @children('projects') projects!: any;
}
