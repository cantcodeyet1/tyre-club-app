import { cn } from '../../utils/cn';

import type { HTMLAttributes } from 'react';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
};

const tones = {
  danger: 'border-danger-border bg-danger-light text-danger-text',
  neutral: 'border-border bg-surface-muted text-textSecondary',
  primary: 'border-primary-border bg-primary-light text-primary-text',
  success: 'border-success-border bg-success-light text-success-text',
  warning: 'border-warning-border bg-warning-light text-warning-text',
};

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
