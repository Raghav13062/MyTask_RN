import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'password', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'vendors',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'vendor_name', type: 'string' },
        { name: 'address', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'projects',
      columns: [
        { name: 'vendor_id', type: 'string', isIndexed: true },
        { name: 'project_name', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'products',
      columns: [
        { name: 'project_id', type: 'string', isIndexed: true },
        { name: 'vendor_id', type: 'string', isIndexed: true },
        { name: 'product_name', type: 'string' },
        { name: 'price', type: 'number' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'image', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
