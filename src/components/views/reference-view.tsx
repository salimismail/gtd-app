import { FileText } from 'lucide-react';
import { useGtdItemsByList } from '../../hooks/use-gtd-items';
import { ItemRow } from '../shared/item-row';
import { EmptyState } from '../shared/empty-state';

export function ReferenceView() {
  const items = useGtdItemsByList('reference');

  return (
    <div>
      <h2 className="text-xl font-semibold text-surface-900 mb-1">
        Reference
      </h2>
      <p className="text-sm text-surface-500 mb-6">
        Information and notes for future reference. No action needed.
      </p>

      {items && items.length > 0 ? (
        <div className="space-y-1">
          {items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState message="No reference items stored yet." icon={FileText} />
      )}
    </div>
  );
}
