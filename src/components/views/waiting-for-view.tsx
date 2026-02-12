import { Clock } from 'lucide-react';
import { useGtdItemsByList } from '../../hooks/use-gtd-items';
import { ItemRow } from '../shared/item-row';
import { EmptyState } from '../shared/empty-state';

export function WaitingForView() {
  const items = useGtdItemsByList('waiting-for');

  return (
    <div>
      <h2 className="text-xl font-semibold text-surface-900 mb-1">
        Waiting For
      </h2>
      <p className="text-sm text-surface-500 mb-6">
        Items delegated or waiting on someone else.
      </p>

      {items && items.length > 0 ? (
        <div className="space-y-1">
          {items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState message="Nothing waiting. You're all clear!" icon={Clock} />
      )}
    </div>
  );
}
