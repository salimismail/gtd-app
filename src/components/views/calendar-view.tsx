import { CalendarDays } from 'lucide-react';
import { useGtdItemsByList } from '../../hooks/use-gtd-items';
import { ItemRow } from '../shared/item-row';
import { EmptyState } from '../shared/empty-state';

export function CalendarView() {
  const items = useGtdItemsByList('calendar');

  const today = new Date().toISOString().split('T')[0];

  const grouped = {
    overdue: [] as typeof items,
    today: [] as typeof items,
    upcoming: [] as typeof items,
    undated: [] as typeof items,
  };

  if (items) {
    for (const item of items) {
      if (!item.scheduledDate && !item.dueDate) {
        grouped.undated!.push(item);
      } else {
        const date = item.scheduledDate ?? item.dueDate ?? '';
        if (date < today) grouped.overdue!.push(item);
        else if (date === today) grouped.today!.push(item);
        else grouped.upcoming!.push(item);
      }
    }
  }

  const sections = [
    { key: 'overdue', label: 'Overdue', items: grouped.overdue },
    { key: 'today', label: 'Today', items: grouped.today },
    { key: 'upcoming', label: 'Upcoming', items: grouped.upcoming },
    { key: 'undated', label: 'No Date', items: grouped.undated },
  ];

  const hasItems = items && items.length > 0;

  return (
    <div>
      <h2 className="text-xl font-semibold text-surface-900 mb-1">Calendar</h2>
      <p className="text-sm text-surface-500 mb-6">
        Date-specific actions and deadlines.
      </p>

      {hasItems ? (
        sections.map(
          ({ key, label, items: sectionItems }) =>
            sectionItems &&
            sectionItems.length > 0 && (
              <div key={key} className="mb-6">
                <h3
                  className={`text-sm font-semibold uppercase tracking-wider mb-2 px-4 ${
                    key === 'overdue' ? 'text-red-600' : 'text-surface-500'
                  }`}
                >
                  {label}
                </h3>
                <div className="space-y-1">
                  {sectionItems.map((item) => (
                    <ItemRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ),
        )
      ) : (
        <EmptyState message="No calendar items." icon={CalendarDays} />
      )}
    </div>
  );
}
