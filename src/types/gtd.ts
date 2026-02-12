export type GtdList =
  | 'inbox'
  | 'next-action'
  | 'waiting-for'
  | 'someday-maybe'
  | 'calendar'
  | 'reference'
  | 'done';

export type GtdContext =
  | '@calls'
  | '@computer'
  | '@errands'
  | '@home'
  | '@office'
  | '@anywhere'
  | '@agenda';

export type EnergyLevel = 'low' | 'medium' | 'high';

export type TimeEstimate = '5min' | '15min' | '30min' | '1hr' | '2hr+';

export interface GtdItem {
  id?: number;
  rawInput: string;
  title: string;
  notes: string;
  list: GtdList;
  context: GtdContext | null;
  projectId: number | null;
  waitingOnPerson: string | null;
  delegatedDate: string | null;
  scheduledDate: string | null;
  scheduledTime: string | null;
  dueDate: string | null;
  energy: EnergyLevel | null;
  timeEstimate: TimeEstimate | null;
  priority: number | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  sortOrder: number;
  isParsing: boolean;
}

export interface Project {
  id?: number;
  name: string;
  outcome: string;
  isActive: boolean;
  category: string | null;
  createdAt: string;
  updatedAt: string;
  sortOrder: number;
}

export interface ParsedGtdInput {
  title: string;
  notes: string;
  suggestedList: GtdList;
  suggestedContext: GtdContext | null;
  suggestedProjectName: string | null;
  waitingOnPerson: string | null;
  scheduledDate: string | null;
  scheduledTime: string | null;
  dueDate: string | null;
  energy: EnergyLevel | null;
  timeEstimate: TimeEstimate | null;
  priority: number | null;
  confidence: number;
  reasoning: string;
}

export interface AppSettings {
  id: number;
  anthropicApiKey: string | null;
  theme: 'light' | 'dark' | 'system';
  lastWeeklyReview: string | null;
}
