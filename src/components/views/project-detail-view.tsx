import { ArrowLeft, FolderKanban } from 'lucide-react';
import { useProject, useItemsByProject } from '../../hooks/use-gtd-items';
import { useUiStore } from '../../stores/ui-store';
import { ItemRow } from '../shared/item-row';
import { EmptyState } from '../shared/empty-state';
import type { GtdList } from '../../types/gtd';

const SECTIONS: { list: GtdList; label: string }[] = [
  { list: 'next-action', label: 'Next Actions' },
  { list: 'waiting-for', label: 'Waiting For' },
  { list: 'calendar', label: 'Calendar' },
  { list: 'inbox', label: 'Inbox (Unprocessed)' },
  { list: 'done', label: 'Completed' },
];

export function ProjectDetailView({ projectId }: { projectId: number }) {
  const project = useProject(projectId);
  const items = useItemsByProject(projectId);
  const setActiveView = useUiStore((s) => s.setActiveView);

  if (!project) return null;

  const grouped = new Map<GtdList, typeof items>();
  if (items) {
    for (const item of items) {
      const existing = grouped.get(item.list) ?? [];
      existing.push(item);
      grouped.set(item.list, existing);
    }
  }

  return (
    <div>
      <button
        onClick={() => setActiveView({ type: 'projects' })}
        className="flex items-center gap-1 text-sm text-surface-500 hover:text-surface-700 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </button>

      <h2 className="text-xl font-semibold text-surface-900 mb-1">
        {project.name}
      </h2>
      {project.outcome && (
        <p className="text-sm text-surface-500 mb-6">{project.outcome}</p>
      )}

      {items && items.length > 0 ? (
        SECTIONS.map(({ list, label }) => {
          const sectionItems = grouped.get(list);
          if (!sectionItems || sectionItems.length === 0) return null;
          return (
            <div key={list} className="mb-6">
              <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-2 px-4">
                {label}
              </h3>
              <div className="space-y-1">
                {sectionItems.map((item) => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <EmptyState
          message="No items in this project yet."
          icon={FolderKanban}
        />
      )}
    </div>
  );
}
