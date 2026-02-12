import { Inbox } from 'lucide-react';
import { useGtdItemsByList } from '../../hooks/use-gtd-items';
import { ItemRow } from '../shared/item-row';
import { EmptyState } from '../shared/empty-state';

export function InboxView() {
  const items = useGtdItemsByList('inbox');

  return (
    <div>
      <h2 className="text-xl font-semibold text-surface-900 mb-1">Inbox</h2>
      <p className="text-sm text-surface-500 mb-6">
        Capture everything here. Process items by moving them to the right list.
      </p>

      {items && items.length > 0 ? (
        <div className="space-y-1">
          {items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState message="Inbox zero! Use the capture bar above to add items." icon={Inbox} />
      )}
    </div>
  );
}
