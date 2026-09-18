import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'min-h-24 w-full resize-none rounded-[14.5px] border border-border-field bg-surface px-4 py-3 text-[13px] font-medium text-textPrimary shadow-none transition placeholder:text-textTertiary focus:border-primary',
      className,
    )}
    {...props}
  />
));

Textarea.displayName = 'Textarea';
