import { db } from '../db/database';
import { parseGtdInput } from './claude-service';
import { updateItem } from '../stores/gtd-store';
import type { GtdList } from '../types/gtd';

export async function parseAndUpdateItem(
  itemId: number,
  rawInput: string,
  apiKey: string,
): Promise<void> {
  try {
    const projects = await db.projects.toArray();
    const parsed = await parseGtdInput(rawInput, apiKey, projects);

    let projectId: number | null = null;
    if (parsed.suggestedProjectName) {
      const project = projects.find(
        (p) =>
          p.name.toLowerCase() ===
          parsed.suggestedProjectName!.toLowerCase(),
      );
      if (project?.id) {
        projectId = project.id;
      }
    }

    const autoMove = parsed.confidence > 0.8 && parsed.suggestedList !== 'inbox';

    await updateItem(itemId, {
      title: parsed.title,
      notes: parsed.notes,
      list: autoMove ? (parsed.suggestedList as GtdList) : 'inbox',
      context: parsed.suggestedContext,
      projectId,
      waitingOnPerson: parsed.waitingOnPerson,
      scheduledDate: parsed.scheduledDate,
      scheduledTime: parsed.scheduledTime,
      dueDate: parsed.dueDate,
      energy: parsed.energy,
      timeEstimate: parsed.timeEstimate,
      priority: parsed.priority,
      isParsing: false,
    });
  } catch (error) {
    console.error('Failed to parse item:', error);
    await updateItem(itemId, { isParsing: false });
  }
}
