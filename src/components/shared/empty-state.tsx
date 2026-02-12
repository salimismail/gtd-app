import { Inbox } from 'lucide-react';

export function EmptyState({
  message = 'No items here yet',
  icon: Icon = Inbox,
}: {
  message?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-surface-400">
      <Icon className="w-12 h-12 mb-3" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
