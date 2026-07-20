import { database } from '../database';
import Project from '../database/models/Project';
import { Q } from '@nozbe/watermelondb';

export const projectService = {
  async getProjectsByVendor(vendorId: string): Promise<Project[]> {
    return await database.collections
      .get<Project>('projects')
      .query(Q.where('vendor_id', vendorId))
      .fetch();
  },

  async getAllProjectsByUser(userId: string): Promise<Project[]> {
     const vendors = await database.collections.get('vendors').query(Q.where('user_id', userId)).fetch();
    const vendorIds = vendors.map(v => v.id);
    if (vendorIds.length === 0) return [];

    return await database.collections
      .get<Project>('projects')
      .query(Q.where('vendor_id', Q.oneOf(vendorIds)))
      .fetch();
  },

  async addProject(vendorId: string, projectName: string, description: string): Promise<Project> {
    let newProject: Project | undefined;
    await database.write(async () => {
      newProject = await database.collections.get<Project>('projects').create(project => {
        project.vendorId = vendorId;
        project.projectName = projectName;
        project.description = description;
      });
    });
    if (!newProject) throw new Error('Failed to add project');
    return newProject;
  },

  async updateProject(projectId: string, projectName: string, description: string): Promise<void> {
    const project = await database.collections.get<Project>('projects').find(projectId);
    await database.write(async () => {
      await project.update(p => {
        p.projectName = projectName;
        p.description = description;
      });
    });
  },

  async deleteProject(projectId: string): Promise<void> {
    const project = await database.collections.get<Project>('projects').find(projectId);
    await database.write(async () => {
      await project.markAsDeleted();
      await project.destroyPermanently();
    });
  },
};
