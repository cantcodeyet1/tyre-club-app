import type { ReactNode } from 'react';

type PageSectionProps = {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
};

export function PageSection({ action, children, title }: PageSectionProps) {
  return (
    <section className="mt-5">
      {title || action ? (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title ? (
            <h2 className="text-[15px] font-semibold text-textPrimary">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
