import { Card } from './Card';

import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <Card className="text-center">
      <p className="text-[15px] font-semibold text-textPrimary">{title}</p>
      <p className="mt-2 text-[13px] leading-5 text-textSecondary">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}
