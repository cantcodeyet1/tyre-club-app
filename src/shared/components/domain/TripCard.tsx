import { CalendarDays, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '../primitives/Badge';
import { Card } from '../primitives/Card';

import type { Trip } from '../../types/domain';

const statusTone = {
  active: 'warning',
  past: 'neutral',
  upcoming: 'primary',
} as const;

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link to={`/trips/${trip.id}`}>
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge tone={statusTone[trip.status]}>{trip.status}</Badge>
            <p className="mt-3 text-[15px] font-semibold text-textPrimary">
              {trip.title}
            </p>
            <p className="mt-1 text-[12px] leading-5 text-textSecondary">
              {trip.route}
            </p>
          </div>
          <ChevronRight aria-hidden className="text-textTertiary" size={18} />
        </div>
        <div className="mt-4 flex items-center justify-between text-[12px] text-textSecondary">
          <span className="inline-flex items-center gap-2">
            <CalendarDays aria-hidden size={16} />
            {trip.date}
          </span>
          <strong className="text-textPrimary">
            ${trip.actualCost ?? trip.estimatedCost}
          </strong>
        </div>
      </Card>
    </Link>
  );
}
