import { cn } from '../../utils/cn';

import type { ReactNode } from 'react';

type ScreenProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
};

export function Screen({
  children,
  className,
  description,
  title,
}: ScreenProps) {
  return (
    <main className={cn('min-h-full px-6 pb-24 pt-3', className)}>
      {title ? (
        <div className="mb-5">
          <h1 className="text-[25px] font-bold leading-tight tracking-normal text-textPrimary">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 text-[13px] leading-5 text-textSecondary">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </main>
  );
}
