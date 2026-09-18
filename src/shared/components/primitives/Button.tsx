import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex h-12 items-center justify-center gap-1.5 rounded-sm px-5 text-[13px] font-semibold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-yellow-cta text-[#111] shadow-yellow hover:shadow-soft',
        secondary:
          'border-[3px] border-textPrimary bg-surface text-textPrimary hover:bg-surface-muted',
        ghost:
          'border border-transparent text-textSecondary hover:bg-black/[0.04] hover:text-textPrimary',
        danger:
          'border border-danger-border bg-[#FF5151] text-[#111] hover:bg-danger-light',
      },
      size: {
        sm: 'h-9 rounded-xs px-3.5 text-xs',
        md: 'h-12 px-5',
        lg: 'h-12 px-7 text-[15px]',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, fullWidth, size, type = 'button', variant, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ className, fullWidth, size, variant }))}
      type={type}
      {...props}
    />
  ),
);

Button.displayName = 'Button';
