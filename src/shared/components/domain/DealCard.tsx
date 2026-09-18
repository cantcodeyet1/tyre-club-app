import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '../primitives/Badge';
import { Card } from '../primitives/Card';

import type { Deal } from '../../types/domain';

export function DealCard({ deal }: { deal: Deal }) {
  return (
    <Link to={deal.route}>
      <Card>
        <Badge tone="primary">{deal.tag}</Badge>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[15px] font-semibold text-textPrimary">
              {deal.title}
            </p>
            <p className="mt-1 text-[12px] leading-5 text-textSecondary">
              {deal.description}
            </p>
          </div>
          <ArrowRight aria-hidden className="text-primary-text" size={18} />
        </div>
      </Card>
    </Link>
  );
}
