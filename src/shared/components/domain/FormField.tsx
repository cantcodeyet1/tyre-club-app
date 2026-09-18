import type { ReactNode } from 'react';

type FormFieldProps = {
  children: ReactNode;
  error?: string;
  hint?: string;
  label: string;
};

export function FormField({ children, error, hint, label }: FormFieldProps) {
  return (
    <label className="grid gap-1.5 text-[11px] font-medium text-textSecondary">
      <span>{label}</span>
      {children}
      {error ? (
        <span className="text-xs font-medium text-danger-text">{error}</span>
      ) : null}
      {!error && hint ? (
        <span className="text-xs font-medium text-textTertiary">{hint}</span>
      ) : null}
    </label>
  );
}
