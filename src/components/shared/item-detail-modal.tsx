import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useUiStore } from '../../stores/ui-store';
import { useGtdItem, useAllProjects } from '../../hooks/use-gtd-items';
import { updateItem, moveItem, deleteItem } from '../../stores/gtd-store';
import { GTD_LISTS, GTD_CONTEXTS, CONTEXT_LABELS } from '../../lib/constants';
import type { GtdList, GtdContext } from '../../types/gtd';

export function ItemDetailModal() {
  const { isDetailModalOpen, selectedItemId, closeDetailModal } = useUiStore();
  const item = useGtdItem(selectedItemId);
  const projects = useAllProjects();

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [list, setList] = useState<GtdList>('inbox');
  const [context, setContext] = useState<GtdContext | ''>('');
  const [projectId, setProjectId] = useState<number | ''>('');
  const [dueDate, setDueDate] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [waitingOnPerson, setWaitingOnPerson] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setNotes(item.notes);
      setList(item.list);
      setContext(item.context ?? '');
      setProjectId(item.projectId ?? '');
      setDueDate(item.dueDate ?? '');
      setScheduledDate(item.scheduledDate ?? '');
      setWaitingOnPerson(item.waitingOnPerson ?? '');
    }
  }, [item]);

  if (!isDetailModalOpen || !item || selectedItemId == null) return null;

  const handleSave = async () => {
    await updateItem(selectedItemId, {
      title,
      notes,
      context: context || null,
      projectId: projectId ? Number(projectId) : null,
      dueDate: dueDate || null,
      scheduledDate: scheduledDate || null,
      waitingOnPerson: waitingOnPerson || null,
    });
    if (list !== item.list) {
      await moveItem(selectedItemId, list, context || undefined);
    }
    closeDetailModal();
  };

  const handleDelete = async () => {
    await deleteItem(selectedItemId);
    closeDetailModal();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-surface-200">
          <h2 className="text-lg font-semibold">Edit Item</h2>
          <button
            onClick={closeDetailModal}
            className="p-1 hover:bg-surface-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-surface-700">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-surface-700">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-surface-700">
                List
              </label>
              <select
                value={list}
                onChange={(e) => setList(e.target.value as GtdList)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 text-sm focus:border-primary-400 outline-none"
              >
                {GTD_LISTS.map((l) => (
                  <option key={l.key} value={l.key}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-surface-700">
                Context
              </label>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value as GtdContext | '')}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 text-sm focus:border-primary-400 outline-none"
              >
                <option value="">None</option>
                {GTD_CONTEXTS.map((ctx) => (
                  <option key={ctx} value={ctx}>
                    {CONTEXT_LABELS[ctx]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-surface-700">
              Project
            </label>
            <select
              value={projectId}
              onChange={(e) =>
                setProjectId(e.target.value ? Number(e.target.value) : '')
              }
              className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 text-sm focus:border-primary-400 outline-none"
            >
              <option value="">None</option>
              {projects?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-surface-700">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 text-sm focus:border-primary-400 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-surface-700">
                Scheduled Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 text-sm focus:border-primary-400 outline-none"
              />
            </div>
          </div>

          {list === 'waiting-for' && (
            <div>
              <label className="text-sm font-medium text-surface-700">
                Waiting On
              </label>
              <input
                value={waitingOnPerson}
                onChange={(e) => setWaitingOnPerson(e.target.value)}
                placeholder="Person name"
                className="w-full mt-1 px-3 py-2 rounded-lg border border-surface-300 text-sm focus:border-primary-400 outline-none"
              />
            </div>
          )}

          {item.rawInput !== item.title && (
            <div>
              <label className="text-sm font-medium text-surface-500">
                Original Input
              </label>
              <p className="text-sm text-surface-400 mt-1 italic">
                "{item.rawInput}"
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 border-t border-surface-200">
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Delete
          </button>
          <div className="flex gap-2">
            <button
              onClick={closeDetailModal}
              className="px-4 py-1.5 text-sm text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
