import { cn } from '../../utils/cn';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
};

export function IconButton({
  children,
  className,
  label,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        'inline-grid size-10 place-items-center rounded-[10px] border border-border-subtle bg-surface text-textPrimary shadow-sm transition hover:bg-primary-light active:scale-95',
        className,
      )}
      title={label}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
