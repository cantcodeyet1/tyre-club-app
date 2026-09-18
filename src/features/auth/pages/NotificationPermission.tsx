import { Bell, CalendarDays, ChevronRight, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ProfileToggle } from '../../profile/components/ProfileScreenChrome';
import {
  AuthBackButton,
  AuthInput,
  AuthPrimaryButton,
  AuthSecondaryButton,
  FieldLabel,
  SetupScreen,
  StepProgress,
} from '../components/AuthScreenChrome';

function NotificationRow({
  caption,
  enabled,
  icon,
  title,
  trailing,
}: {
  caption: string;
  enabled?: boolean;
  icon: 'bell' | 'calendar' | 'mail' | 'phone';
  title: string;
  trailing?: 'chevron' | 'toggle';
}) {
  const icons = {
    bell: Bell,
    calendar: CalendarDays,
    mail: Mail,
    phone: Phone,
  };
  const Icon = icons[icon];

  return (
    <div className="flex min-h-[54px] items-center gap-3 border-b border-[#E8E8E8] last:border-b-0">
      <span className="grid size-[30px] shrink-0 place-items-center rounded-[8px] border border-[#6A82D8] bg-[#BFD0FF] text-[#314B99]">
        <Icon size={18} strokeWidth={2.1} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-black leading-tight">
          {title}
        </span>
        <span className="block text-[11px] font-medium leading-tight text-textSecondary">
          {caption}
        </span>
      </span>
      {trailing === 'chevron' ? (
        <ChevronRight size={18} className="text-textSecondary" />
      ) : (
        <ProfileToggle enabled={enabled} />
      )}
    </div>
  );
}

export default function NotificationPermission() {
  const navigate = useNavigate();

  return (
    <SetupScreen>
      <section className="flex min-h-screen flex-col px-[24px] pb-6 pt-[5px]">
        <div className="flex items-center gap-4">
          <AuthBackButton className="-ml-[24px]" />
          <StepProgress currentStep={3} />
        </div>
        <p className="ml-[64px] mt-1 text-[13px] font-medium text-textSecondary">
          Step 3 of 4
        </p>

        <div className="mt-4">
          <h1 className="text-[22px] font-black leading-tight">
            Stay in the loop
          </h1>
          <p className="mt-3 max-w-[250px] text-[14px] font-semibold leading-[1.15] text-textSecondary">
            We&apos;ll remind you about checks, expiring documents and upcoming
            services
          </p>
        </div>

        <label className="mt-7 block">
          <FieldLabel>WhatsApp number</FieldLabel>
          <AuthInput placeholder="e.g. +263 77 123 4567" />
        </label>

        <section className="mt-8">
          <h2 className="text-[15px] font-black leading-none">Notifications</h2>
          <div className="mt-4 rounded-[16px] bg-surface px-4 py-2 shadow-[0_5px_16px_rgba(0,0,0,0.12)]">
            <NotificationRow
              caption="In-app alerts"
              enabled
              icon="bell"
              title="Push notifications"
            />
            <NotificationRow
              caption="Chat-based notifications"
              enabled
              icon="phone"
              title="WhatsApp reminders"
            />
            <NotificationRow
              caption="Notifications to your inbox"
              icon="mail"
              title="Email reminders"
            />
            <NotificationRow
              caption="Pick your monthly alert date"
              icon="calendar"
              title="Select default reminder date"
              trailing="chevron"
            />
          </div>
        </section>

        <div className="mt-auto grid grid-cols-[1fr_1fr] gap-3 pt-8">
          <AuthSecondaryButton onClick={() => navigate('/onboarding/vehicle')}>
            Skip for now
          </AuthSecondaryButton>
          <AuthPrimaryButton onClick={() => navigate('/onboarding/vehicle')}>
            Continue
          </AuthPrimaryButton>
        </div>
      </section>
    </SetupScreen>
  );
}
