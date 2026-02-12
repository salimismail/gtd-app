import { db } from './database';
import { DEFAULT_PROJECTS } from '../lib/constants';

export async function seedDatabase(): Promise<void> {
  const projectCount = await db.projects.count();
  if (projectCount === 0) {
    const now = new Date().toISOString();
    await db.projects.bulkAdd(
      DEFAULT_PROJECTS.map((p, i) => ({
        name: p.name,
        outcome: p.outcome,
        isActive: true,
        category: p.category,
        createdAt: now,
        updatedAt: now,
        sortOrder: i,
      })),
    );
  }

  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.add({
      id: 1,
      anthropicApiKey: null,
      theme: 'light',
      lastWeeklyReview: null,
    });
  }
}
