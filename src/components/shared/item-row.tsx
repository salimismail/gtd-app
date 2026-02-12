import {
  Check,
  Circle,
  MoreHorizontal,
  ArrowRight,
  Trash2,
  Loader2,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { GtdItem, GtdList, GtdContext } from '../../types/gtd';
import { completeItem, deleteItem, moveItem } from '../../stores/gtd-store';
import { useUiStore } from '../../stores/ui-store';
import { ContextBadge } from './context-badge';
import { ProjectBadge } from './project-badge';
import { GTD_LISTS, GTD_CONTEXTS, CONTEXT_LABELS } from '../../lib/constants';

export function ItemRow({ item }: { item: GtdItem }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const openDetailModal = useUiStore((s) => s.openDetailModal);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
        setShowMoveMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.id != null) await completeItem(item.id);
  };

  const handleDelete = async () => {
    if (item.id != null) await deleteItem(item.id);
    setShowMenu(false);
  };

  const handleMove = async (list: GtdList, context?: GtdContext) => {
    if (item.id != null) await moveItem(item.id, list, context);
    setShowMenu(false);
    setShowMoveMenu(false);
  };

  return (
    <div
      className="group flex items-center gap-3 px-4 py-3 hover:bg-surface-100 rounded-lg cursor-pointer transition-colors"
      onClick={() => item.id != null && openDetailModal(item.id)}
    >
      <button
        onClick={handleComplete}
        className="flex-shrink-0 text-surface-400 hover:text-green-500 transition-colors"
      >
        {item.list === 'done' ? (
          <Check className="w-5 h-5 text-green-500" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm truncate ${item.list === 'done' ? 'line-through text-surface-400' : ''}`}
          >
            {item.title}
          </span>
          {item.isParsing && (
            <Loader2 className="w-3.5 h-3.5 text-primary-500 animate-spin flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {item.context && <ContextBadge context={item.context} />}
          {item.projectId && <ProjectBadge projectId={item.projectId} />}
          {item.dueDate && (
            <span className="text-xs text-surface-500">
              Due {item.dueDate}
            </span>
          )}
        </div>
      </div>

      <div className="relative flex-shrink-0" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-200 rounded transition-all"
        >
          <MoreHorizontal className="w-4 h-4 text-surface-500" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-surface-200 py-1 z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMoveMenu(!showMoveMenu);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-surface-100"
            >
              <ArrowRight className="w-4 h-4" />
              Move to...
            </button>

            {showMoveMenu && (
              <div className="border-t border-surface-200 py-1">
                {GTD_LISTS.filter((l) => l.key !== item.list).map((l) => (
                  <div key={l.key}>
                    {l.key === 'next-action' ? (
                      GTD_CONTEXTS.map((ctx) => (
                        <button
                          key={ctx}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMove('next-action', ctx);
                          }}
                          className="w-full px-6 py-1.5 text-xs text-left hover:bg-surface-100"
                        >
                          Next Action → {CONTEXT_LABELS[ctx]}
                        </button>
                      ))
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMove(l.key);
                        }}
                        className="w-full px-6 py-1.5 text-xs text-left hover:bg-surface-100"
                      >
                        {l.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
