import { Card } from '../primitives/Card';
import { StatusPill } from '../primitives/StatusPill';

import type { Vehicle } from '../../types/domain';

export function VehicleSummaryCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="bg-[#2F2F2F] text-surface">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-surface/70">
            Primary vehicle
          </p>
          <h2 className="mt-1 text-[24px] font-bold leading-tight">
            {vehicle.name}
          </h2>
          <p className="font-mono text-[12px] text-surface/70">
            {vehicle.registration || 'No plate'}
          </p>
        </div>
        <StatusPill status={vehicle.status} />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-[12px]">
        <div>
          <span className="block text-surface/60">Odometer</span>
          <strong>{vehicle.odometerKm.toLocaleString()}</strong>
        </div>
        <div>
          <span className="block text-surface/60">Checks</span>
          <strong>{vehicle.checksDue}</strong>
        </div>
        <div>
          <span className="block text-surface/60">Tyres</span>
          <strong>{vehicle.tyreSize}</strong>
        </div>
      </div>
    </Card>
  );
}
