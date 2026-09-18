import type { Status } from '../../types/domain';

type StatusPillProps = {
  status: Status;
  label?: string;
};

const statusMap: Record<
  Status,
  { label: string; className: string; dot: string }
> = {
  danger: {
    label: 'Attention required',
    className: 'border-danger-border bg-danger-light text-danger-text',
    dot: 'bg-danger',
  },
  good: {
    label: 'All good',
    className: 'border-success-border bg-success-light text-success-text',
    dot: 'bg-success',
  },
  neutral: {
    label: 'Review',
    className: 'border-border bg-surface-muted text-textSecondary',
    dot: 'bg-textTertiary',
  },
  warning: {
    label: 'Needs attention',
    className: 'border-warning-border bg-warning-light text-warning-text',
    dot: 'bg-warning',
  },
};

export function StatusPill({ label, status }: StatusPillProps) {
  const config = statusMap[status];

  return (
    <span
      className={`inline-flex h-6 items-center gap-[5px] rounded-full border px-2.5 text-[11px] font-medium ${config.className}`}
    >
      <span className={`size-1.5 rounded-full ${config.dot}`} />
      {label ?? config.label}
    </span>
  );
}
