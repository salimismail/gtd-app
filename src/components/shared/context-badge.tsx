import type { GtdContext } from '../../types/gtd';
import { CONTEXT_LABELS, CONTEXT_COLORS } from '../../lib/constants';

export function ContextBadge({ context }: { context: GtdContext }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${CONTEXT_COLORS[context]}`}
    >
      {CONTEXT_LABELS[context]}
    </span>
  );
}
