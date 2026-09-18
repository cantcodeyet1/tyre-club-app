import { forwardRef, type SelectHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, invalid, ...props }, ref) => (
    <select
      ref={ref}
      aria-invalid={invalid}
      className={cn(
        'h-10 w-full rounded-[14.5px] border bg-surface px-4 text-[13px] font-medium text-textPrimary shadow-none transition',
        invalid ? 'border-danger' : 'border-border-field focus:border-primary',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);

Select.displayName = 'Select';
