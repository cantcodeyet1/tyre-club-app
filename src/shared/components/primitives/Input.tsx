import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid}
      className={cn(
        'h-10 w-full rounded-[14.5px] border bg-surface px-4 text-[13px] font-medium text-textPrimary shadow-none transition placeholder:text-textTertiary',
        invalid ? 'border-danger' : 'border-border-field focus:border-primary',
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
