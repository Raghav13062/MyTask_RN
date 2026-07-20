import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import User from './models/User';
import Vendor from './models/Vendor';
import Project from './models/Project';
import Product from './models/Product';

const adapter = new SQLiteAdapter({
  schema,
  jsi: true, 
  onSetUpError: error => {
    console.error('WatermelonDB setup error', error);
  }
});

export const database = new Database({
  adapter,
  modelClasses: [User, Vendor, Project, Product],
});
