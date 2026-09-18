import { Check, ChevronRight, FileText, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ErrorState } from '../../../shared/components/primitives/ErrorState';
import { LoadingState } from '../../../shared/components/primitives/LoadingState';
import { useChecks, useVehicles } from '../../../shared/hooks/useAppData';
import { useUiStore } from '../../../shared/stores/uiStore';
import { cn } from '../../../shared/utils/cn';

import type { HealthCheck, Vehicle } from '../../../shared/types/domain';

type HealthFilter = 'all' | 'compliance' | 'service' | 'reports';
type Tone = 'danger' | 'warning' | 'good';

const filters: { label: string; value: HealthFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Compliance', value: 'compliance' },
  { label: 'Service', value: 'service' },
  { label: 'Reports', value: 'reports' },
];

function statusTone(status: HealthCheck['status']): Tone {
  if (status === 'danger') {
    return 'danger';
  }

  if (status === 'good') {
    return 'good';
  }

  return 'warning';
}

function ToneDot({ tone }: { tone: Tone }) {
  return (
    <span
      className={cn(
        'mt-[4px] grid size-[12px] shrink-0 place-items-center rounded-full text-[8px] font-bold text-surface',
        tone === 'danger' && 'bg-[#E73838]',
        tone === 'warning' && 'bg-[#EFA12C]',
        tone === 'good' && 'bg-[#57D534]',
      )}
    >
      {tone === 'good' ? <Check size={9} strokeWidth={3} /> : null}
    </span>
  );
}

function StatCard({
  label,
  tone,
  value,
}: {
  label: string;
  tone: Tone;
  value: number;
}) {
  return (
    <div className="rounded-[12px] bg-surface px-3 py-3 text-center shadow-[0_5px_16px_rgba(0,0,0,0.10)]">
      <p
        className={cn(
          'text-[22px] font-bold leading-none',
          tone === 'danger' && 'text-[#E73838]',
          tone === 'warning' && 'text-[#EFA12C]',
          tone === 'good' && 'text-[#57D534]',
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-[12px] font-medium leading-none text-textPrimary">
        {label}
      </p>
    </div>
  );
}

function SectionCard({
  checks,
  title,
  tone,
  vehicleName,
}: {
  checks: HealthCheck[];
  title: string;
  tone: Tone;
  vehicleName: (vehicleId: string) => string;
}) {
  if (checks.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[16px] bg-surface px-4 py-4 shadow-[0_5px_16px_rgba(0,0,0,0.12)]">
      <h2
        className={cn(
          'mb-2 text-[18px] font-bold leading-none',
          tone === 'danger' && 'text-[#E73838]',
          tone === 'warning' && 'text-[#EFA12C]',
          tone === 'good' && 'text-[#57D534]',
        )}
      >
        {title}
      </h2>
      {checks.map((check) => (
        <Link
          key={check.id}
          className="flex items-start gap-2 border-b border-[#E5E5E5] py-3 last:border-b-0"
          to={`/vehicles/${check.vehicleId}/checks/${check.id}`}
        >
          <ToneDot tone={statusTone(check.status)} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold leading-tight text-textPrimary">
              {check.title} — {vehicleName(check.vehicleId)}
            </p>
            <p className="mt-1 text-[12px] font-medium leading-tight text-[#666666]">
              {check.dueLabel}
            </p>
          </div>
          <ChevronRight
            aria-hidden
            className="mt-2 text-[#555555]"
            size={16}
            strokeWidth={2.2}
          />
        </Link>
      ))}
    </section>
  );
}

function FilterButton({
  active,
  label,
  value,
  onClick,
}: {
  active: boolean;
  label: string;
  value: HealthFilter;
  onClick: (value: HealthFilter) => void;
}) {
  const isReport = value === 'reports';

  return (
    <button
      aria-label={label}
      className={cn(
        'grid h-[34px] place-items-center rounded-[14px] border border-[#D7D7D7] bg-surface text-[14px] font-medium leading-none text-[#777777]',
        isReport ? 'w-[34px]' : 'px-4',
        active && 'border-textPrimary text-textPrimary',
      )}
      type="button"
      onClick={() => onClick(value)}
    >
      {isReport ? <FileText size={18} strokeWidth={2.2} /> : label}
    </button>
  );
}

function ReportsView({
  vehicles,
  checks,
}: {
  vehicles: Vehicle[];
  checks: HealthCheck[];
}) {
  const overdue = checks.filter((check) => check.status === 'danger').length;
  const dueSoon = checks.filter(
    (check) => check.status === 'warning' || check.status === 'neutral',
  ).length;
  const good = checks.filter((check) => check.status === 'good').length;
  const monthLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="grid gap-5">
      <section className="rounded-[16px] bg-surface p-4 shadow-[0_5px_16px_rgba(0,0,0,0.12)]">
        <p className="text-[13px] font-bold uppercase leading-none text-textPrimary">
          Fleet summary • {monthLabel}
        </p>
        <h2 className="mt-2 text-[24px] font-bold leading-none text-textPrimary">
          {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'}{' '}
          tracked
        </h2>
        <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-[12px] border border-[#D7D7D7]">
          <div className="px-2 py-3 text-center">
            <p className="text-[22px] font-bold leading-none text-[#E73838]">
              {overdue}
            </p>
            <p className="mt-1 text-[12px] font-medium leading-none">Overdue</p>
          </div>
          <div className="border-x border-[#D7D7D7] px-2 py-3 text-center">
            <p className="text-[22px] font-bold leading-none text-[#EFA12C]">
              {dueSoon}
            </p>
            <p className="mt-1 text-[12px] font-medium leading-none">
              Due soon
            </p>
          </div>
          <div className="px-2 py-3 text-center">
            <p className="text-[22px] font-bold leading-none text-[#57D534]">
              {good}
            </p>
            <p className="mt-1 text-[12px] font-medium leading-none">
              All good
            </p>
          </div>
        </div>
      </section>

      <div className="rounded-[16px] bg-surface px-4 py-5 text-center shadow-[0_5px_16px_rgba(0,0,0,0.12)]">
        <p className="text-[13px] font-medium leading-tight text-[#666666]">
          Monthly PDF reports and sharing are coming soon.
        </p>
      </div>
    </div>
  );
}

export default function HealthPage() {
  const { healthFilter, setHealthFilter } = useUiStore();
  const checksQuery = useChecks();
  const vehiclesQuery = useVehicles();
  const checks = checksQuery.data ?? [];
  const vehicles = vehiclesQuery.data ?? [];
  const vehicleName = (vehicleId: string) =>
    vehicles.find((vehicle) => vehicle.id === vehicleId)?.name ?? 'Vehicle';

  const filteredChecks =
    healthFilter === 'all' || healthFilter === 'reports'
      ? checks
      : checks.filter((check) => check.category === healthFilter);
  const overdueChecks = filteredChecks.filter(
    (check) => check.status === 'danger',
  );
  const dueSoonChecks = filteredChecks.filter(
    (check) => check.status === 'warning' || check.status === 'neutral',
  );
  const goodChecks = filteredChecks.filter((check) => check.status === 'good');

  return (
    <main className="min-h-screen bg-surface px-[18px] pb-[126px] pt-0 text-textPrimary">
      <header className="mb-8 mt-[43px] flex items-center gap-3">
        <Heart aria-hidden size={25} strokeWidth={2.2} />
        <h1 className="text-[22px] font-medium leading-none">Health</h1>
      </header>

      <div className="mb-4 grid grid-cols-[auto_auto_auto_34px] gap-3">
        {filters.map((filter) => (
          <FilterButton
            key={filter.value}
            active={healthFilter === filter.value}
            label={filter.label}
            value={filter.value}
            onClick={setHealthFilter}
          />
        ))}
      </div>

      {checksQuery.isLoading || vehiclesQuery.isLoading ? (
        <LoadingState label="Loading health" />
      ) : null}
      {checksQuery.error ? (
        <ErrorState message="Health checks could not be loaded." />
      ) : null}

      {healthFilter === 'reports' ? (
        <ReportsView checks={checks} vehicles={vehicles} />
      ) : (
        <>
          <div className="mb-7 grid grid-cols-3 gap-3">
            <StatCard
              label="Overdue"
              tone="danger"
              value={overdueChecks.length}
            />
            <StatCard
              label="Due soon"
              tone="warning"
              value={dueSoonChecks.length}
            />
            <StatCard label="All good" tone="good" value={goodChecks.length} />
          </div>

          {!checksQuery.isLoading && filteredChecks.length === 0 ? (
            <p className="py-8 text-center text-[13px] font-medium text-[#666666]">
              No checks yet for this filter.
            </p>
          ) : null}

          <div className="grid gap-6">
            <SectionCard
              checks={overdueChecks}
              title="Overdue"
              tone="danger"
              vehicleName={vehicleName}
            />
            <SectionCard
              checks={dueSoonChecks}
              title="Due soon"
              tone="warning"
              vehicleName={vehicleName}
            />
            <SectionCard
              checks={goodChecks}
              title="All good"
              tone="good"
              vehicleName={vehicleName}
            />
          </div>
        </>
      )}
    </main>
  );
}
