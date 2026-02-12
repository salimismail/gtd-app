import {
  Inbox,
  Zap,
  FolderKanban,
  Clock,
  Lightbulb,
  CalendarDays,
  FileText,
  RotateCcw,
  Settings,
} from 'lucide-react';
import { useUiStore } from '../../stores/ui-store';
import { useSettingsStore } from '../../stores/settings-store';
import { useInboxCount, useAllProjects } from '../../hooks/use-gtd-items';
import type { GtdList } from '../../types/gtd';

const NAV_ITEMS: {
  key: GtdList | 'weekly-review' | 'settings';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'inbox', label: 'Inbox', icon: Inbox },
  { key: 'next-action', label: 'Next Actions', icon: Zap },
  { key: 'waiting-for', label: 'Waiting For', icon: Clock },
  { key: 'calendar', label: 'Calendar', icon: CalendarDays },
  { key: 'someday-maybe', label: 'Someday/Maybe', icon: Lightbulb },
  { key: 'reference', label: 'Reference', icon: FileText },
];

const PROJECT_NAV = {
  key: 'projects' as const,
  label: 'Projects',
  icon: FolderKanban,
};

export function Sidebar() {
  const { activeView, setActiveView } = useUiStore();
  const openSettings = useSettingsStore((s) => s.openSettings);
  const inboxCount = useInboxCount();
  const projects = useAllProjects();

  const isActive = (key: string) => {
    if (activeView.type === 'list') return activeView.list === key;
    if (activeView.type === 'weekly-review') return key === 'weekly-review';
    if (activeView.type === 'settings') return key === 'settings';
    return false;
  };

  return (
    <aside className="w-56 bg-white border-r border-surface-200 flex flex-col h-full">
      <div className="p-4">
        <h1 className="text-lg font-bold text-surface-900">GTD Flow</h1>
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveView({ type: 'list', list: key as GtdList })}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive(key)
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-surface-600 hover:bg-surface-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="flex-1 text-left">{label}</span>
            {key === 'inbox' && inboxCount != null && inboxCount > 0 && (
              <span className="bg-primary-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                {inboxCount}
              </span>
            )}
          </button>
        ))}

        <div className="pt-2 pb-1">
          <span className="px-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">
            Projects
          </span>
        </div>
        <button
          onClick={() => setActiveView({ type: 'projects' })}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            activeView.type === 'projects'
              ? 'bg-primary-50 text-primary-700 font-medium'
              : 'text-surface-600 hover:bg-surface-100'
          }`}
        >
          <PROJECT_NAV.icon className="w-4 h-4" />
          <span className="flex-1 text-left">All Projects</span>
        </button>
        {projects?.map((project) => (
          <button
            key={project.id}
            onClick={() => setActiveView({ type: 'project', projectId: project.id! })}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeView.type === 'project' && activeView.projectId === project.id
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-surface-600 hover:bg-surface-100'
            }`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-surface-400" />
            </div>
            <span className="flex-1 text-left">{project.name}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-surface-200 px-2 py-2 space-y-0.5">
        <button
          onClick={() => setActiveView({ type: 'weekly-review' })}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            isActive('weekly-review')
              ? 'bg-primary-50 text-primary-700 font-medium'
              : 'text-surface-600 hover:bg-surface-100'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          Weekly Review
        </button>
        <button
          onClick={openSettings}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-surface-600 hover:bg-surface-100 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}
