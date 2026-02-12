import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';

export function ProjectBadge({ projectId }: { projectId: number }) {
  const project = useLiveQuery(() => db.projects.get(projectId), [projectId]);

  if (!project) return null;

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
      {project.name}
    </span>
  );
}
