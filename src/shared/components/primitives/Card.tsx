import { cn } from '../../utils/cn';

import type { HTMLAttributes } from 'react';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[20px] border border-border-subtle bg-surface p-4 shadow-sm',
        className,
      )}
      {...props}
    />
  );
}
