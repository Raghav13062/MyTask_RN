import { Model } from '@nozbe/watermelondb';
import { text, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Project extends Model {
  static table = 'projects';

  @text('vendor_id') vendorId!: string;
  @text('project_name') projectName!: string;
  @text('description') description?: string;
  @readonly @date('created_at') createdAt!: Date;
}
