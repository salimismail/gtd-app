import { db } from '../db/database';
import type { GtdItem, GtdList, GtdContext } from '../types/gtd';

export async function captureItem(rawInput: string): Promise<number> {
  const now = new Date().toISOString();
  const count = await db.gtdItems.where('list').equals('inbox').count();
  const id = await db.gtdItems.add({
    rawInput,
    title: rawInput,
    notes: '',
    list: 'inbox',
    context: null,
    projectId: null,
    waitingOnPerson: null,
    delegatedDate: null,
    scheduledDate: null,
    scheduledTime: null,
    dueDate: null,
    energy: null,
    timeEstimate: null,
    priority: null,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    sortOrder: count,
    isParsing: true,
  });
  return id as number;
}

export async function updateItem(
  id: number,
  changes: Partial<GtdItem>,
): Promise<void> {
  await db.gtdItems.update(id, {
    ...changes,
    updatedAt: new Date().toISOString(),
  });
}

export async function moveItem(
  id: number,
  toList: GtdList,
  context?: GtdContext | null,
): Promise<void> {
  const count = await db.gtdItems.where('list').equals(toList).count();
  await db.gtdItems.update(id, {
    list: toList,
    context: context ?? null,
    sortOrder: count,
    updatedAt: new Date().toISOString(),
  });
}

export async function completeItem(id: number): Promise<void> {
  await db.gtdItems.update(id, {
    list: 'done',
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function uncompleteItem(
  id: number,
  toList: GtdList = 'inbox',
): Promise<void> {
  await db.gtdItems.update(id, {
    list: toList,
    completedAt: null,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteItem(id: number): Promise<void> {
  await db.gtdItems.delete(id);
}
