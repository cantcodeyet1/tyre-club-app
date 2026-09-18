import { ChevronLeft } from 'lucide-react';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { MobileFrame } from '../../../shared/components/layout/MobileFrame';
import { cn } from '../../../shared/utils/cn';

export function AuthScreen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <MobileFrame>
      <main
        className={cn('min-h-full bg-surface text-textPrimary', className)}
      >
        {children}
      </main>
    </MobileFrame>
  );
}

export function SetupScreen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={cn('min-h-full bg-surface text-textPrimary', className)}>
      {children}
    </main>
  );
}

export function DunlopExpressLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 text-[17px] font-black italic leading-none text-textPrimary',
        className,
      )}
    >
      <span className="grid size-3 place-items-center rounded-full bg-[#F04E4E] text-[7px] text-primary">
        &gt;
      </span>
      <span>DUNLOP</span>
      <span className="rounded-sm bg-[#F04E4E] px-1 text-surface">EXPRESS</span>
    </div>
  );
}

export function TyreClubLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'grid size-[76px] place-items-center rounded-full border-[2px] border-primary bg-[#050505] shadow-[0_8px_18px_rgba(0,0,0,0.22)]',
        className,
      )}
    >
      <div className="text-center">
        <p className="text-[13px] font-bold uppercase italic leading-none text-surface">
          Tyre Club
        </p>
        <p className="mt-1 text-[6px] font-bold uppercase tracking-[0.14em] text-primary">
          Always rolling
        </p>
      </div>
    </div>
  );
}

export function AuthBackButton({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const navigate = useNavigate();

  return (
    <button
      className={cn(
        'inline-flex h-[28px] items-center gap-1.5 rounded-r-[8px] bg-textPrimary px-2.5 pr-4 text-[13px] font-semibold text-surface',
        className,
      )}
      type="button"
      onClick={onClick ?? (() => navigate(-1))}
    >
      <ChevronLeft size={17} strokeWidth={2.4} />
      Back
    </button>
  );
}

export const AuthInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <input
    ref={ref}
    aria-invalid={invalid}
    className={cn(
      'h-[36px] w-full rounded-[11px] border px-3.5 text-[13px] font-medium text-textPrimary outline-none transition placeholder:text-[#BDBDBD]',
      invalid
        ? 'border-danger bg-danger-light/20'
        : 'border-[#E3E3E3] bg-[#FAFAFA] focus:border-textPrimary',
      className,
    )}
    {...props}
  />
));

AuthInput.displayName = 'AuthInput';

export function FieldLabel({
  children,
  required,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <span className="mb-2 block text-[14px] font-bold leading-none text-textSecondary">
      {children}
      {required ? <span className="text-danger-text"> *</span> : null}
    </span>
  );
}

export function AuthPrimaryButton({
  children,
  className,
  disabled,
  type = 'button',
  onClick,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
}) {
  return (
    <button
      className={cn(
        'inline-flex h-[38px] w-full items-center justify-center rounded-[8px] bg-yellow-cta px-4 text-[13px] font-black text-textPrimary shadow-yellow transition active:scale-[0.98] disabled:opacity-60',
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

export function AuthSecondaryButton({
  children,
  className,
  type = 'button',
  onClick,
}: {
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
}) {
  return (
    <button
      className={cn(
        'inline-flex h-[38px] w-full items-center justify-center rounded-[8px] border border-[#D8D8D8] bg-surface px-4 text-[13px] font-black text-textPrimary transition active:scale-[0.98]',
        className,
      )}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Google sign-in is fully wired server-side (see server/src/routes/auth.routes.ts
// and src/shared/hooks/useGoogleAuth.ts) but dimmed here for now — set this to
// false once VITE_GOOGLE_CLIENT_ID is configured to turn the button back on.
const isGoogleSignInEnabled = false;

export function SocialButtons({
  isGoogleLoading,
  onGoogleClick,
}: {
  isGoogleLoading?: boolean;
  onGoogleClick?: () => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <button
        aria-label="Continue with Google (coming soon)"
        className="grid h-[36px] place-items-center rounded-[6px] bg-[#F8F8F8] text-[24px] font-black text-[#4285F4] disabled:opacity-40"
        disabled={!isGoogleSignInEnabled || isGoogleLoading}
        title="Coming soon"
        type="button"
        onClick={isGoogleSignInEnabled ? onGoogleClick : undefined}
      >
        G
      </button>
      <button
        aria-label="Continue with Facebook (coming soon)"
        className="grid h-[36px] place-items-center rounded-[6px] bg-[#F8F8F8] text-[26px] font-black text-[#4A66F5] opacity-40"
        disabled
        title="Coming soon"
        type="button"
      >
        f
      </button>
      <button
        aria-label="Continue with Apple (coming soon)"
        className="grid h-[36px] place-items-center rounded-[6px] bg-[#F8F8F8] text-[24px] font-black text-textPrimary opacity-40"
        disabled
        title="Coming soon"
        type="button"
      >
        a
      </button>
    </div>
  );
}

export function StepProgress({
  currentStep,
  totalSteps = 4,
}: {
  currentStep: number;
  totalSteps?: number;
}) {
  return (
    <div className="flex flex-1 items-center gap-2">
      {Array.from({ length: totalSteps }, (_, index) => {
        const step = index + 1;
        return (
          <span
            key={step}
            className={cn(
              'h-[5px] flex-1 rounded-full',
              step < currentStep
                ? 'bg-yellow-cta'
                : step === currentStep
                  ? 'bg-textPrimary'
                  : 'bg-[#D9D9D9]',
            )}
          />
        );
      })}
    </div>
  );
}

export function ChoicePill({
  active,
  children,
  className,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        'h-[36px] rounded-[14px] border px-5 text-[13px] font-semibold transition-all duration-150 ease-out active:scale-[0.96]',
        active
          ? 'border-textPrimary bg-surface text-textPrimary'
          : 'border-[#D8D8D8] bg-surface text-textTertiary',
        className,
      )}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
