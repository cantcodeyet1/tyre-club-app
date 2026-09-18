import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card } from '../primitives/Card';

import type { Vehicle } from '../../types/domain';

const statusStyles = {
  attention: {
    accent: 'bg-[#FF3D3D]',
    pill: 'border-[#F04E4E] bg-[#FFDADA] text-[#1A1A1A]',
    dot: 'bg-[#F04E4E]',
    label: 'Attention Required',
    nextText: 'Insurance expired ',
    nextDue: '3 days ago',
    chips: [
      {
        label: 'Insurance',
        className: 'border-[#F04E4E] bg-[#FFDADA] text-[#1A1A1A]',
        dot: 'bg-[#F04E4E]',
      },
      {
        label: 'Service due',
        className: 'border-[#EFA33A] bg-[#FFD99B] text-[#1A1A1A]',
        dot: 'bg-[#F2A43A]',
      },
    ],
  },
  good: {
    accent: 'bg-[#6FE83E]',
    pill: 'border-[#65D845] bg-[#B9F7A2] text-[#1A1A1A]',
    dot: 'bg-[#6FE83E]',
    label: 'All Good',
    nextText: 'Wheel rotation ',
    nextDue: '3 days ago',
    chips: [
      {
        label: 'Insurance',
        className: 'border-[#65D845] bg-[#B9F7A2] text-[#1A1A1A]',
        dot: 'bg-[#6FE83E]',
      },
      {
        label: 'Tyres',
        className: 'border-[#65D845] bg-[#B9F7A2] text-[#1A1A1A]',
        dot: 'bg-[#6FE83E]',
      },
    ],
  },
};

function formatKm(value: number) {
  return value.toLocaleString('en-US').replaceAll(',', ' ');
}

function serviceAge(status: Vehicle['status']) {
  if (status === 'good') {
    return '1 month ago';
  }

  if (status === 'danger') {
    return '6 months ago';
  }

  return '3 months ago';
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const isGood = vehicle.status === 'good';
  const config = isGood ? statusStyles.good : statusStyles.attention;
  const tripCount = isGood
    ? Math.max(vehicle.checksDue, 5)
    : Math.max(vehicle.checksDue, 2);

  return (
    <Link className="block" to={`/vehicles/${vehicle.id}`}>
      <Card className="relative overflow-hidden rounded-[17px] border border-[#EEEEEE] bg-surface px-4 pb-2.5 pt-3.5 shadow-[0_8px_22px_rgba(0,0,0,0.10)] transition hover:-translate-y-0.5">
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 w-[3px] ${config.accent}`}
        />

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[18px] font-medium leading-[1.05] text-textPrimary">
              {vehicle.name}
            </p>
            <p className="mt-1 text-[14px] font-medium leading-none text-[#6F6F6F]">
              {vehicle.registration || 'No plate'} &bull; {vehicle.year}
            </p>
          </div>
          <span
            className={`inline-flex h-[22px] shrink-0 items-center gap-2 rounded-full border px-2.5 text-[12px] font-bold leading-none ${config.pill}`}
          >
            <span className={`size-[10px] rounded-full ${config.dot}`} />
            {config.label}
          </span>
        </div>

        <div className="mt-4 border-t border-[#E9E9E9] pt-2">
          <div className="flex gap-6">
            <div>
              <p className="text-[12px] font-medium leading-none text-[#6F6F6F]">
                Mileage
              </p>
              <p className="mt-1 text-[14px] font-bold leading-none text-textPrimary">
                {formatKm(vehicle.odometerKm)}km
              </p>
            </div>
            <div>
              <p className="text-[12px] font-medium leading-none text-[#6F6F6F]">
                Last service
              </p>
              <p className="mt-1 text-[14px] font-bold leading-none text-textPrimary">
                {serviceAge(vehicle.status)}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[15px] font-medium leading-tight text-textPrimary">
          <span className="font-bold">Next:</span> {config.nextText}
          <span className="font-bold text-[#F28A17]">{config.nextDue}</span>
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {config.chips.map((chip) => (
            <span
              key={chip.label}
              className={`inline-flex h-[22px] items-center gap-2 rounded-full border px-2.5 text-[12px] font-bold leading-none ${chip.className}`}
            >
              <span className={`size-[10px] rounded-full ${chip.dot}`} />
              {chip.label}
            </span>
          ))}
          <span className="inline-flex h-[22px] items-center gap-2 rounded-full border border-[#9B9B9B] bg-[#E2E2E2] px-2.5 text-[12px] font-bold leading-none text-[#1A1A1A]">
            <span className="size-[10px] rounded-full bg-[#686868]" />
            {tripCount} Trips
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-[12px] font-medium leading-none text-[#8D8D8D]">
          <span>{isGood ? 'Updated 1 day ago' : 'Updated yesterday'}</span>
          <span className="inline-flex items-center gap-1">
            View details
            <ChevronRight aria-hidden size={18} strokeWidth={2.4} />
          </span>
        </div>
      </Card>
    </Link>
  );
}
