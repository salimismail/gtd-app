import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { GtdList, GtdContext } from '../types/gtd';

export function useGtdItemsByList(list: GtdList) {
  return useLiveQuery(
    () => db.gtdItems.where('list').equals(list).sortBy('sortOrder'),
    [list],
  );
}

export function useNextActionsByContext(context: GtdContext) {
  return useLiveQuery(
    () =>
      db.gtdItems
        .where('[list+context]')
        .equals(['next-action', context])
        .sortBy('sortOrder'),
    [context],
  );
}

export function useItemsByProject(projectId: number) {
  return useLiveQuery(
    () => db.gtdItems.where('projectId').equals(projectId).toArray(),
    [projectId],
  );
}

export function useInboxCount() {
  return useLiveQuery(() =>
    db.gtdItems.where('list').equals('inbox').count(),
  );
}

export function useAllProjects() {
  return useLiveQuery(() =>
    db.projects
      .orderBy('sortOrder')
      .filter((p) => p.isActive)
      .toArray(),
  );
}

export function useProject(id: number) {
  return useLiveQuery(() => db.projects.get(id), [id]);
}

export function useGtdItem(id: number | null) {
  return useLiveQuery(
    () => (id ? db.gtdItems.get(id) : undefined),
    [id],
  );
}
