import type { GtdContext, GtdList } from '../types/gtd';

export const GTD_CONTEXTS: GtdContext[] = [
  '@calls',
  '@computer',
  '@errands',
  '@home',
  '@office',
  '@anywhere',
  '@agenda',
];

export const GTD_LISTS: { key: GtdList; label: string }[] = [
  { key: 'inbox', label: 'Inbox' },
  { key: 'next-action', label: 'Next Actions' },
  { key: 'waiting-for', label: 'Waiting For' },
  { key: 'someday-maybe', label: 'Someday/Maybe' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'reference', label: 'Reference' },
];

export const DEFAULT_PROJECTS = [
  { name: 'Ukraine', outcome: '', category: null },
  { name: 'Luck', outcome: '', category: null },
  { name: 'YxO', outcome: '', category: null },
  { name: 'ExO', outcome: '', category: null },
  { name: 'MoL', outcome: '', category: null },
  { name: 'Household', outcome: '', category: null },
  { name: 'Finance', outcome: '', category: null },
];

export const CONTEXT_LABELS: Record<GtdContext, string> = {
  '@calls': 'Calls',
  '@computer': 'Computer',
  '@errands': 'Errands',
  '@home': 'Home',
  '@office': 'Office',
  '@anywhere': 'Anywhere',
  '@agenda': 'Agenda',
};

export const CONTEXT_COLORS: Record<GtdContext, string> = {
  '@calls': 'bg-green-100 text-green-800',
  '@computer': 'bg-blue-100 text-blue-800',
  '@errands': 'bg-orange-100 text-orange-800',
  '@home': 'bg-purple-100 text-purple-800',
  '@office': 'bg-indigo-100 text-indigo-800',
  '@anywhere': 'bg-gray-100 text-gray-800',
  '@agenda': 'bg-yellow-100 text-yellow-800',
};
