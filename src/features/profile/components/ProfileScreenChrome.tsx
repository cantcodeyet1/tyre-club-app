import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { cn } from '../../../shared/utils/cn';

import type { ReactNode } from 'react';

export function ProfileScreen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        'min-h-screen bg-surface px-[18px] pb-8 pt-0 text-textPrimary',
        className,
      )}
    >
      {children}
    </main>
  );
}

export function ProfilePanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'rounded-[16px] bg-surface p-4 shadow-[0_5px_16px_rgba(0,0,0,0.12)]',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function ProfileBackButton({ className }: { className?: string }) {
  const navigate = useNavigate();

  return (
    <button
      aria-label="Go back"
      className={cn(
        'grid size-[30px] place-items-center rounded-full bg-yellow-cta text-textPrimary shadow-yellow',
        className,
      )}
      type="button"
      onClick={() => navigate(-1)}
    >
      <ChevronLeft size={20} strokeWidth={2.8} />
    </button>
  );
}

export function ProfileToggle({
  enabled,
  disabled,
  onClick,
}: {
  enabled?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const className = cn(
    'relative block h-[24px] w-[46px] rounded-full disabled:opacity-60',
    enabled ? 'bg-yellow-cta shadow-yellow' : 'bg-[#9A9A9A]',
  );
  const thumb = (
    <span
      className={cn(
        'absolute top-[3px] size-[18px] rounded-full bg-textPrimary transition',
        enabled ? 'right-[3px]' : 'left-[3px] bg-surface',
      )}
    />
  );

  if (!onClick) {
    return <span className={className}>{thumb}</span>;
  }

  return (
    <button
      aria-pressed={Boolean(enabled)}
      className={className}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {thumb}
    </button>
  );
}
