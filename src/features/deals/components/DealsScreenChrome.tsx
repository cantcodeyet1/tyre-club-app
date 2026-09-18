import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { cn } from '../../../shared/utils/cn';
import { whatsAppHref } from '../../../shared/utils/contact';

import type { ReactNode } from 'react';

export function DealsScreen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        'min-h-full bg-surface px-[18px] pb-[126px] pt-0 text-textPrimary',
        className,
      )}
    >
      {children}
    </main>
  );
}

export function DealsPanel({
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

export function DealsBackHeader({ title }: { title: string }) {
  const navigate = useNavigate();

  return (
    <header className="mb-5 mt-[43px] flex items-center gap-4">
      <button
        aria-label="Go back"
        className="grid size-[30px] shrink-0 place-items-center rounded-full bg-yellow-cta text-textPrimary shadow-yellow"
        type="button"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={20} strokeWidth={2.8} />
      </button>
      <h1 className="text-[14px] font-bold leading-none">{title}</h1>
    </header>
  );
}

export function DealsPrimaryButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={cn(
        'h-12 rounded-[10px] bg-yellow-cta text-[15px] font-bold text-textPrimary shadow-yellow transition-transform active:scale-[0.98]',
        className,
      )}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function DealsWhatsAppButton({
  children = 'WhatsApp us',
  className,
  message,
}: {
  children?: ReactNode;
  className?: string;
  message?: string;
}) {
  return (
    <a
      className={cn(
        'grid h-12 place-items-center rounded-[10px] bg-[#6DD15F] text-[15px] font-bold text-surface transition-transform active:scale-[0.98]',
        className,
      )}
      href={whatsAppHref(message)}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

export function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#E5E5E5] py-3 text-[13px] font-medium last:border-b-0">
      <span className="text-[#777777]">{label}</span>
      <span className="font-medium text-textPrimary">{value}</span>
    </div>
  );
}
