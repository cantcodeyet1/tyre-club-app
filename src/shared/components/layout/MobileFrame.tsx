import type { ReactNode } from 'react';

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[393px] bg-background shadow-none sm:my-6 sm:min-h-[852px] sm:overflow-hidden sm:rounded-[28px] sm:shadow-phone">
      {children}
    </div>
  );
}
