import { MobileFrame } from '../../../shared/components/layout/MobileFrame';

import type { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  eyebrow?: string;
  description?: string;
};

export function AuthLayout({
  children,
  description,
  eyebrow = 'Tyre Club',
  title,
}: AuthLayoutProps) {
  return (
    <MobileFrame>
      <main className="flex min-h-screen flex-col bg-background px-6 py-8">
        <div className="mb-7">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-textTertiary">
            {eyebrow}
          </span>
          <h1 className="mt-3 text-[30px] font-bold leading-tight text-textPrimary">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-[13px] leading-5 text-textSecondary">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </main>
    </MobileFrame>
  );
}
