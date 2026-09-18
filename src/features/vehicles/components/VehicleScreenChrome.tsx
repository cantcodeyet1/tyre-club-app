import { ArrowLeft, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { cn } from '../../../shared/utils/cn';

import type { Status, Vehicle } from '../../../shared/types/domain';
import type { ReactNode } from 'react';

type VehicleChromeProps = {
  children: ReactNode;
  className?: string;
};

export function VehicleChrome({ children, className }: VehicleChromeProps) {
  return (
    <main
      className={cn(
        'min-h-screen bg-surface px-[14px] pb-[126px] pt-0 text-textPrimary',
        className,
      )}
    >
      {children}
    </main>
  );
}

type VehicleHeaderProps = {
  onRemove?: () => void;
  vehicle: Vehicle;
  status?: Status;
};

export function VehicleHeader({
  onRemove,
  status,
  vehicle,
}: VehicleHeaderProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="mb-7 pt-[13px]">
      <div className="flex items-start justify-between gap-3">
        <button
          aria-label="Go back"
          className="mt-1 grid size-5 place-items-center"
          type="button"
          onClick={() => navigate('/vehicles')}
        >
          <ArrowLeft size={20} strokeWidth={2.2} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[18px] font-bold leading-tight">
            {vehicle.name}
          </h1>
          <p className="mt-1 text-[14px] font-medium uppercase leading-none text-[#7A7A7A]">
            {vehicle.registration || 'No plate'}
          </p>
        </div>
        <div className="relative">
          <button
            aria-expanded={isMenuOpen}
            aria-label="Vehicle actions"
            className="mt-1 grid size-6 place-items-center"
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <MoreHorizontal size={22} strokeWidth={3} />
          </button>
          {isMenuOpen ? (
            <div className="absolute right-0 top-8 z-10 w-[156px] rounded-[12px] bg-surface py-1 shadow-[0_8px_22px_rgba(0,0,0,0.16)]">
              <Link
                className="block px-4 py-2 text-[13px] font-semibold text-textPrimary"
                to={`/vehicles/${vehicle.id}/edit`}
              >
                Edit vehicle
              </Link>
              {onRemove ? (
                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-[13px] font-semibold text-danger-text"
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRemove();
                  }}
                >
                  <Trash2 size={13} strokeWidth={2.3} />
                  Remove vehicle
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        <StatusBadge status={status ?? vehicle.status} />
      </div>
    </header>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const config = {
    danger: {
      className: 'border-[#F04E4E] bg-[#FFDADA]',
      dot: 'bg-[#F04E4E]',
      label: 'Attention Required',
    },
    good: {
      className: 'border-[#65D845] bg-[#B9F7A2]',
      dot: 'bg-[#6FE83E]',
      label: 'All Good',
    },
    neutral: {
      className: 'border-[#9B9B9B] bg-[#E2E2E2]',
      dot: 'bg-[#686868]',
      label: 'Not Started',
    },
    warning: {
      className: 'border-[#EFA33A] bg-[#FFD99B]',
      dot: 'bg-[#F2A43A]',
      label: 'Due Soon',
    },
  }[status];

  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center gap-2 rounded-full border px-2.5 text-[12px] font-bold leading-none text-textPrimary',
        config.className,
      )}
    >
      <span className={cn('size-[10px] rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}

type VehicleTabsProps<T extends string> = {
  active: T;
  items: { label: string; value: T }[];
  onChange: (value: T) => void;
};

export function VehicleTabs<T extends string>({
  active,
  items,
  onChange,
}: VehicleTabsProps<T>) {
  return (
    <div className="-mx-[14px] mb-4 flex border-b border-[#D8D8D8] bg-surface px-[20px]">
      {items.map((item) => {
        const isActive = item.value === active;

        return (
          <button
            key={item.value}
            className={cn(
              'relative h-[36px] flex-1 text-[12px] font-medium leading-none text-[#333333]',
              isActive && 'font-bold text-textPrimary',
            )}
            type="button"
            onClick={() => onChange(item.value)}
          >
            {item.label}
            {isActive ? (
              <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-full bg-yellow-cta" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function VehiclePanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'rounded-[12px] bg-surface p-4 shadow-[0_5px_16px_rgba(0,0,0,0.13)]',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function MiniStat({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-[8px] bg-[#DEDEDE] px-3 py-2">
      <p className="text-[12px] font-medium leading-none text-[#555555]">
        {label}
      </p>
      <p className="mt-1 text-[14px] font-bold leading-none text-textPrimary">
        {value}
      </p>
    </div>
  );
}

export function CircleDot({ tone }: { tone: 'danger' | 'good' | 'warning' }) {
  return (
    <span
      className={cn(
        'mt-[3px] grid size-[10px] shrink-0 place-items-center rounded-full text-[8px] font-bold text-surface',
        tone === 'danger' && 'bg-[#F04E4E]',
        tone === 'good' && 'bg-[#6FE83E]',
        tone === 'warning' && 'bg-[#F2A43A]',
      )}
    />
  );
}
