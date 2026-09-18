import { forwardRef } from 'react';

import { cn } from '../../../shared/utils/cn';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export function TripScreen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        'min-h-screen bg-surface px-[18px] pb-[126px] pt-0 text-textPrimary',
        className,
      )}
    >
      {children}
    </main>
  );
}

export function TripPanel({
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

export function TripMiniStat({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-[12px] bg-[#DEDEDE] px-3 py-3">
      <p className="text-[12px] font-medium leading-none text-[#555555]">
        {label}
      </p>
      <p className="mt-1 text-[18px] font-bold leading-none text-textPrimary">
        {value}
      </p>
    </div>
  );
}

export const TripInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<'input'>
>(function TripInput({ className, type = 'text', ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-[14px] border border-[#D9D9D9] bg-surface px-4 text-[13px] font-medium text-textPrimary outline-none placeholder:text-[#909090] focus:border-primary',
        className,
      )}
      type={type}
      {...props}
    />
  );
});

export function TripField({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-2 text-[14px] font-bold leading-none text-[#8B8B8B]">
      {label}
      {children}
    </label>
  );
}

export function TripPrimaryButton({
  children,
  className,
  type = 'button',
  disabled,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={cn(
        'h-12 rounded-[10px] bg-yellow-cta text-[15px] font-bold text-textPrimary shadow-yellow disabled:opacity-60',
        className,
      )}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
