export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="grid min-h-28 place-items-center rounded-[20px] border border-border-subtle bg-surface">
      <div className="flex items-center gap-3 text-[13px] font-medium text-textSecondary">
        <span className="size-4 animate-spin rounded-full border-2 border-border border-t-primary" />
        {label}
      </div>
    </div>
  );
}
