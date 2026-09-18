import { Card } from '../primitives/Card';

import type { HealthCheck } from '../../types/domain';

export function HealthSummaryCard({ checks }: { checks: HealthCheck[] }) {
  const urgent = checks.filter((check) => check.status === 'danger').length;
  const warning = checks.filter((check) => check.status === 'warning').length;
  const good = checks.filter((check) => check.status === 'good').length;

  return (
    <Card className="bg-[#2F2F2F] text-surface">
      <p className="text-[11px] font-medium text-surface/70">Fleet health</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <span className="block text-[28px] font-bold leading-none">
            {urgent}
          </span>
          <span className="text-xs text-surface/70">Urgent</span>
        </div>
        <div>
          <span className="block text-[28px] font-bold leading-none">
            {warning}
          </span>
          <span className="text-xs text-surface/70">Watch</span>
        </div>
        <div>
          <span className="block text-[28px] font-bold leading-none">
            {good}
          </span>
          <span className="text-xs text-surface/70">Good</span>
        </div>
      </div>
    </Card>
  );
}
