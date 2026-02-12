import { useEffect } from 'react';
import { Sidebar } from './sidebar';
import { CaptureInput } from '../capture/capture-input';
import { InboxView } from '../views/inbox-view';
import { NextActionsView } from '../views/next-actions-view';
import { WaitingForView } from '../views/waiting-for-view';
import { SomedayMaybeView } from '../views/someday-maybe-view';
import { CalendarView } from '../views/calendar-view';
import { ReferenceView } from '../views/reference-view';
import { ProjectsView } from '../views/projects-view';
import { ProjectDetailView } from '../views/project-detail-view';
import { WeeklyReviewView } from '../views/weekly-review-view';
import { SettingsModal } from '../shared/settings-modal';
import { ItemDetailModal } from '../shared/item-detail-modal';
import { useUiStore } from '../../stores/ui-store';
import { useSettingsStore } from '../../stores/settings-store';
import { seedDatabase } from '../../db/seed';

function MainContent() {
  const activeView = useUiStore((s) => s.activeView);

  if (activeView.type === 'projects') {
    return <ProjectsView />;
  }

  if (activeView.type === 'project') {
    return <ProjectDetailView projectId={activeView.projectId} />;
  }

  if (activeView.type === 'weekly-review') {
    return <WeeklyReviewView />;
  }

  if (activeView.type === 'settings') {
    return <InboxView />;
  }

  switch (activeView.list) {
    case 'inbox':
      return <InboxView />;
    case 'next-action':
      return <NextActionsView />;
    case 'waiting-for':
      return <WaitingForView />;
    case 'someday-maybe':
      return <SomedayMaybeView />;
    case 'calendar':
      return <CalendarView />;
    case 'reference':
      return <ReferenceView />;
    default:
      return <InboxView />;
  }
}

export function AppShell() {
  const loadSettings = useSettingsStore((s) => s.loadSettings);

  useEffect(() => {
    seedDatabase();
    loadSettings();
  }, [loadSettings]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="p-4 border-b border-surface-200 bg-white">
          <CaptureInput />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <MainContent />
        </main>
      </div>
      <SettingsModal />
      <ItemDetailModal />
    </div>
  );
}
