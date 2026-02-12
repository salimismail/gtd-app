import Dexie, { type EntityTable } from 'dexie';
import type { GtdItem, Project, AppSettings } from '../types/gtd';

export class GtdDatabase extends Dexie {
  gtdItems!: EntityTable<GtdItem, 'id'>;
  projects!: EntityTable<Project, 'id'>;
  settings!: EntityTable<AppSettings, 'id'>;

  constructor() {
    super('gtd-flow');

    this.version(1).stores({
      gtdItems:
        '++id, list, context, projectId, scheduledDate, dueDate, createdAt, sortOrder, [list+context], [list+projectId]',
      projects: '++id, name, isActive, sortOrder',
      settings: 'id',
    });
  }
}

export const db = new GtdDatabase();
