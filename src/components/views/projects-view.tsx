import { useState } from 'react';
import { FolderKanban, Plus, Trash2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { useUiStore } from '../../stores/ui-store';
import { EmptyState } from '../shared/empty-state';

export function ProjectsView() {
  const projects = useLiveQuery(() =>
    db.projects
      .orderBy('sortOrder')
      .filter((p) => p.isActive)
      .toArray(),
  );
  const setActiveView = useUiStore((s) => s.setActiveView);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAddProject = async () => {
    const name = newName.trim();
    if (!name) return;
    const now = new Date().toISOString();
    const count = (await db.projects.count()) ?? 0;
    await db.projects.add({
      name,
      outcome: '',
      isActive: true,
      category: null,
      createdAt: now,
      updatedAt: now,
      sortOrder: count,
    });
    setNewName('');
    setShowAdd(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-semibold text-surface-900">Projects</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>
      <p className="text-sm text-surface-500 mb-6">
        Active projects. Each should have at least one next action.
      </p>

      {showAdd && (
        <div className="flex gap-2 mb-4">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddProject();
              if (e.key === 'Escape') setShowAdd(false);
            }}
            placeholder="Project name..."
            className="flex-1 px-3 py-2 rounded-lg border border-surface-300 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
          />
          <button
            onClick={handleAddProject}
            disabled={!newName.trim()}
            className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-30 transition-colors"
          >
            Create
          </button>
          <button
            onClick={() => setShowAdd(false)}
            className="px-3 py-2 text-sm text-surface-500 hover:bg-surface-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {projects && projects.length > 0 ? (
        <div className="grid gap-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() =>
                project.id != null &&
                setActiveView({ type: 'project', projectId: project.id })
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState message="No active projects." icon={FolderKanban} />
      )}
    </div>
  );
}

function ProjectCard({
  project,
  onClick,
}: {
  project: { id?: number; name: string; outcome: string };
  onClick: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const itemCount = useLiveQuery(
    () =>
      project.id != null
        ? db.gtdItems
            .where('projectId')
            .equals(project.id)
            .and((item) => item.list !== 'done')
            .count()
        : 0,
    [project.id],
  );

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    if (project.id != null) {
      // Unlink all items from this project
      const items = await db.gtdItems
        .where('projectId')
        .equals(project.id)
        .toArray();
      await Promise.all(
        items.map((item) =>
          item.id != null
            ? db.gtdItems.update(item.id, { projectId: null })
            : Promise.resolve(),
        ),
      );
      await db.projects.delete(project.id);
    }
  };

  return (
    <div
      onClick={onClick}
      className="group w-full text-left p-4 bg-white rounded-lg border border-surface-200 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-surface-900">{project.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-surface-500">
            {itemCount ?? 0} active items
          </span>
          {confirmDelete ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleDelete}
                className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(false);
                }}
                className="px-2 py-1 text-xs text-surface-500 hover:bg-surface-100 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
            </button>
          )}
        </div>
      </div>
      {project.outcome && (
        <p className="text-sm text-surface-500 mt-1">{project.outcome}</p>
      )}
    </div>
  );
}
