import { create } from 'zustand';
import type { GtdList } from '../types/gtd';

type View =
  | { type: 'list'; list: GtdList }
  | { type: 'projects' }
  | { type: 'project'; projectId: number }
  | { type: 'weekly-review' }
  | { type: 'settings' };

interface UiState {
  activeView: View;
  selectedItemId: number | null;
  isDetailModalOpen: boolean;
  sidebarCollapsed: boolean;

  setActiveView: (view: View) => void;
  selectItem: (id: number | null) => void;
  openDetailModal: (id: number) => void;
  closeDetailModal: () => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeView: { type: 'list', list: 'inbox' },
  selectedItemId: null,
  isDetailModalOpen: false,
  sidebarCollapsed: false,

  setActiveView: (view) => set({ activeView: view }),
  selectItem: (id) => set({ selectedItemId: id }),
  openDetailModal: (id) =>
    set({ selectedItemId: id, isDetailModalOpen: true }),
  closeDetailModal: () =>
    set({ selectedItemId: null, isDetailModalOpen: false }),
  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));
