import { cn } from '../../utils/cn';

type AvatarProps = {
  name?: string;
  className?: string;
};

export function Avatar({ className, name }: AvatarProps) {
  const initials =
    name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'TM';

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-grid size-[42px] place-items-center rounded-[10px] border border-border-subtle bg-gradient-to-b from-primary-start from-50% to-primary-end text-[24px] font-bold leading-[20px] tracking-[0.02em] text-surface shadow-avatar',
        className,
      )}
    >
      {initials || 'TM'}
    </span>
  );
}
