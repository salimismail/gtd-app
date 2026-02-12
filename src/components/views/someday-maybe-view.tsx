import { Lightbulb } from 'lucide-react';
import { useGtdItemsByList } from '../../hooks/use-gtd-items';
import { ItemRow } from '../shared/item-row';
import { EmptyState } from '../shared/empty-state';

export function SomedayMaybeView() {
  const items = useGtdItemsByList('someday-maybe');

  return (
    <div>
      <h2 className="text-xl font-semibold text-surface-900 mb-1">
        Someday/Maybe
      </h2>
      <p className="text-sm text-surface-500 mb-6">
        Ideas and possibilities you might want to pursue later.
      </p>

      {items && items.length > 0 ? (
        <div className="space-y-1">
          {items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState message="No ideas parked here yet." icon={Lightbulb} />
      )}
    </div>
  );
}
