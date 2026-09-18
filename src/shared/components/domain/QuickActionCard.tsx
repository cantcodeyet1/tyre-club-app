import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { ReactNode } from 'react';

type QuickActionCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  to: string;
};

export function QuickActionCard({
  description,
  icon,
  title,
  to,
}: QuickActionCardProps) {
  return (
    <Link
      className="rounded-[20px] border border-border-subtle bg-surface p-4 shadow-sm transition hover:bg-primary-light"
      to={to}
    >
      <div className="mb-3 inline-grid size-9 place-items-center rounded-full bg-yellow-cta text-textPrimary">
        {icon}
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-textPrimary">{title}</p>
          <p className="mt-1 text-[11px] leading-4 text-textSecondary">
            {description}
          </p>
        </div>
        <ArrowRight
          aria-hidden
          className="shrink-0 text-textTertiary"
          size={16}
        />
      </div>
    </Link>
  );
}
