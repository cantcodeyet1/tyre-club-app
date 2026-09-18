import { MapPin, Phone } from 'lucide-react';

import { Button } from '../primitives/Button';
import { Card } from '../primitives/Card';

import type { Branch } from '../../types/domain';

export function BranchCard({ branch }: { branch: Branch }) {
  return (
    <Card>
      <p className="text-[15px] font-semibold text-textPrimary">
        {branch.name}
      </p>
      <p className="mt-2 flex items-start gap-2 text-[12px] leading-5 text-textSecondary">
        <MapPin aria-hidden className="mt-0.5 shrink-0" size={16} />
        {branch.address}
      </p>
      <p className="mt-2 flex items-center gap-2 text-[12px] text-textSecondary">
        <Phone aria-hidden size={16} />
        {branch.phone}
      </p>
      <p className="mt-3 text-[12px] font-semibold text-textPrimary">
        {branch.hours}
      </p>
      <Button className="mt-4" fullWidth variant="secondary">
        Open in maps
      </Button>
    </Card>
  );
}
