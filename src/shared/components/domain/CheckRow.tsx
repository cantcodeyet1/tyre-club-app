import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { StatusPill } from '../primitives/StatusPill';

import type { HealthCheck, Vehicle } from '../../types/domain';

type CheckRowProps = {
  check: HealthCheck;
  vehicle?: Vehicle;
};

export function CheckRow({ check, vehicle }: CheckRowProps) {
  return (
    <Link
      className="flex items-center justify-between gap-3 rounded-[20px] border border-border-subtle bg-surface p-4 shadow-sm transition hover:bg-primary-light"
      to={`/vehicles/${check.vehicleId}/checks/${check.id}`}
    >
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-textPrimary">
          {check.title}
        </p>
        <p className="mt-1 truncate text-[11px] text-textTertiary">
          {vehicle?.name ?? 'Vehicle'} · {check.dueLabel}
        </p>
        <div className="mt-2">
          <StatusPill status={check.status} />
        </div>
      </div>
      <ChevronRight
        aria-hidden
        className="shrink-0 text-textTertiary"
        size={16}
      />
    </Link>
  );
}
