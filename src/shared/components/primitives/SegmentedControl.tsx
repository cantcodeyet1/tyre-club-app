import { cn } from '../../utils/cn';

import type { ReactNode } from 'react';

export type SegmentOption<TValue extends string> = {
  label: ReactNode;
  value: TValue;
};

type SegmentedControlProps<TValue extends string> = {
  label: string;
  options: SegmentOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
};

export function SegmentedControl<TValue extends string>({
  label,
  onChange,
  options,
  value,
}: SegmentedControlProps<TValue>) {
  return (
    <div
      aria-label={label}
      className="scrollbar-none flex gap-0.5 overflow-x-auto rounded-sm bg-black/[0.05] p-[3px]"
      role="tablist"
    >
      {options.map((option) => (
        <button
          key={option.value}
          aria-selected={option.value === value}
          className={cn(
            'min-h-7 flex-1 shrink-0 rounded-xs border border-transparent px-2 py-1.5 text-center text-[11px] font-normal transition',
            option.value === value
              ? 'bg-surface font-medium text-primary-text shadow-sm'
              : 'text-textTertiary hover:bg-black/[0.03] hover:text-textSecondary',
          )}
          role="tab"
          type="button"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
