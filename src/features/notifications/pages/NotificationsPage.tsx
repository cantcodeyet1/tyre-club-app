import { AlertTriangle, BellOff, Check, ChevronLeft, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingState } from '../../../shared/components/primitives/LoadingState';
import { useChecks, useVehicles } from '../../../shared/hooks/useAppData';
import { cn } from '../../../shared/utils/cn';

import type { HealthCheck } from '../../../shared/types/domain';

function NotificationRow({
  check,
  vehicleName,
}: {
  check: HealthCheck;
  vehicleName: string;
}) {
  const isOverdue = check.status === 'danger';

  return (
    <Link
      className="flex items-start gap-3 border-b border-[#E5E5E5] px-4 py-4 last:border-b-0"
      state={{ tab: check.category === 'compliance' ? 'compliance' : 'checks' }}
      to={`/vehicles/${check.vehicleId}/checks/${check.id}`}
    >
      <span
        className={cn(
          'grid size-[38px] shrink-0 place-items-center rounded-[10px] border',
          isOverdue
            ? 'border-[#F04E4E] bg-[#FFDADA] text-[#E73838]'
            : 'border-[#EFA33A] bg-[#FFD99B] text-[#8A5500]',
        )}
      >
        {isOverdue ? (
          <AlertTriangle size={19} strokeWidth={2.2} />
        ) : (
          <Clock size={19} strokeWidth={2.2} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold leading-tight text-textPrimary">
          {check.title} {isOverdue ? 'is overdue' : 'is due soon'}
        </p>
        <p className="mt-1 text-[12px] font-medium leading-tight text-[#666666]">
          {vehicleName} &bull; {check.dueLabel}
        </p>
      </div>
    </Link>
  );
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const checksQuery = useChecks();
  const vehiclesQuery = useVehicles();
  const checks = checksQuery.data ?? [];
  const vehicles = vehiclesQuery.data ?? [];
  const vehicleName = (vehicleId: string) =>
    vehicles.find((vehicle) => vehicle.id === vehicleId)?.name ?? 'Vehicle';

  const overdue = checks.filter((check) => check.status === 'danger');
  const dueSoon = checks.filter(
    (check) => check.status === 'warning' || check.status === 'neutral',
  );
  const isLoading = checksQuery.isLoading || vehiclesQuery.isLoading;
  const isEmpty = !isLoading && overdue.length === 0 && dueSoon.length === 0;

  return (
    <main className="min-h-full bg-surface px-[18px] pb-8 pt-0 text-textPrimary">
      <header className="mt-[42px] flex items-center gap-4">
        <button
          aria-label="Go back"
          className="grid size-[30px] place-items-center rounded-full bg-yellow-cta text-textPrimary shadow-yellow"
          type="button"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={20} strokeWidth={2.8} />
        </button>
        <div>
          <h1 className="text-[22px] font-bold leading-none">Notifications</h1>
          <p className="mt-2 text-[14px] font-medium leading-none text-[#666666]">
            Checks and compliance items that need attention
          </p>
        </div>
      </header>

      <section className="mt-8">
        {isLoading ? <LoadingState label="Loading notifications" /> : null}

        {isEmpty ? (
          <div className="grid place-items-center gap-3 rounded-[16px] bg-surface px-4 py-12 text-center shadow-[0_5px_16px_rgba(0,0,0,0.12)]">
            <BellOff aria-hidden className="text-[#AAAAAA]" size={32} />
            <p className="text-[14px] font-bold leading-tight">
              You&apos;re all caught up
            </p>
            <p className="max-w-[220px] text-[12px] font-medium leading-tight text-[#666666]">
              We&apos;ll let you know here when a check or document needs
              attention.
            </p>
          </div>
        ) : null}

        {overdue.length > 0 ? (
          <div className="mb-6">
            <h2 className="mb-3 px-2 text-[15px] font-bold leading-none text-[#E73838]">
              Overdue
            </h2>
            <div className="overflow-hidden rounded-[16px] bg-surface shadow-[0_5px_16px_rgba(0,0,0,0.12)]">
              {overdue.map((check) => (
                <NotificationRow
                  key={check.id}
                  check={check}
                  vehicleName={vehicleName(check.vehicleId)}
                />
              ))}
            </div>
          </div>
        ) : null}

        {dueSoon.length > 0 ? (
          <div>
            <h2 className="mb-3 px-2 text-[15px] font-bold leading-none text-[#B47B00]">
              Due soon
            </h2>
            <div className="overflow-hidden rounded-[16px] bg-surface shadow-[0_5px_16px_rgba(0,0,0,0.12)]">
              {dueSoon.map((check) => (
                <NotificationRow
                  key={check.id}
                  check={check}
                  vehicleName={vehicleName(check.vehicleId)}
                />
              ))}
            </div>
          </div>
        ) : null}

        {!isLoading && !isEmpty ? (
          <p className="mt-8 flex items-center justify-center gap-2 text-center text-[12px] font-medium leading-tight text-[#8D8D8D]">
            <Check aria-hidden size={14} />
            Everything else is on track
          </p>
        ) : null}
      </section>
    </main>
  );
}
