import { Zap } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { useNextActionsByContext } from '../../hooks/use-gtd-items';
import { ItemRow } from '../shared/item-row';
import { EmptyState } from '../shared/empty-state';
import { GTD_CONTEXTS, CONTEXT_LABELS } from '../../lib/constants';
import type { GtdContext } from '../../types/gtd';

function ContextGroup({ context }: { context: GtdContext }) {
  const items = useNextActionsByContext(context);

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-2 px-4">
        {CONTEXT_LABELS[context]}
      </h3>
      <div className="space-y-1">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export function NextActionsView() {
  const totalCount = useLiveQuery(() =>
    db.gtdItems.where('list').equals('next-action').count(),
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-surface-900 mb-1">
        Next Actions
      </h2>
      <p className="text-sm text-surface-500 mb-6">
        Concrete actions grouped by context. Pick based on where you are and what tools you have.
      </p>

      {GTD_CONTEXTS.map((ctx) => (
        <ContextGroup key={ctx} context={ctx} />
      ))}

      {totalCount === 0 && (
        <EmptyState
          message="No next actions. Process your inbox to create some!"
          icon={Zap}
        />
      )}
    </div>
  );
}
