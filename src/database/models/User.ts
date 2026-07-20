import { Model } from '@nozbe/watermelondb';
import { field, text, children } from '@nozbe/watermelondb/decorators';
import Vendor from './Vendor';

export default class User extends Model {
  static table = 'users';

  @text('name') name!: string;
  @text('email') email!: string;
  @text('password') password!: string;

  @children('vendors') vendors!: any;
}
