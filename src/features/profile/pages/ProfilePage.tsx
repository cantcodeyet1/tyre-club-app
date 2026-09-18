import {
  Bell,
  CalendarDays,
  Check,
  LogOut,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/authStore';
import {
  ProfileBackButton,
  ProfilePanel,
  ProfileScreen,
  ProfileToggle,
} from '../components/ProfileScreenChrome';

import type { ReactNode } from 'react';

function InfoIcon({
  children,
  tone = 'green',
}: {
  children: ReactNode;
  tone?: 'blue' | 'green' | 'red';
}) {
  const toneClass = {
    blue: 'border-[#4567D5] bg-[#BFCBFF] text-[#3456BC]',
    green: 'border-[#65D845] bg-[#B9F7A2] text-textPrimary',
    red: 'border-[#F04E4E] bg-[#FFDADA] text-[#E73838]',
  }[tone];

  return (
    <span
      className={`grid size-[30px] shrink-0 place-items-center rounded-[9px] border ${toneClass}`}
    >
      {children}
    </span>
  );
}

function PersonalRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#E5E5E5] py-3 last:border-b-0">
      <InfoIcon>
        <Check size={18} strokeWidth={2.5} />
      </InfoIcon>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold leading-tight">{label}</p>
        <p className="mt-1 truncate text-[12px] font-medium leading-tight text-[#666666]">
          {value}
        </p>
      </div>
      <button className="text-[12px] font-bold leading-none" type="button">
        Edit
      </button>
    </div>
  );
}

function NotificationRow({
  detail,
  enabled,
  icon,
  title,
}: {
  detail: string;
  enabled?: boolean;
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#E5E5E5] py-3 last:border-b-0">
      <InfoIcon tone="blue">{icon}</InfoIcon>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold leading-tight">{title}</p>
        <p className="mt-1 truncate text-[12px] font-medium leading-tight text-[#666666]">
          {detail}
        </p>
      </div>
      <ProfileToggle enabled={enabled} />
    </div>
  );
}

export default function ProfilePage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] ?? 'Tendai';
  const initials =
    user?.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'TM';

  async function handleLogout() {
    await logout();
    navigate('/sign-in', { replace: true });
  }

  return (
    <ProfileScreen>
      <section className="relative mt-[34px]">
        <ProfilePanel className="min-h-[166px] px-5 py-6 text-center">
          <ProfileBackButton className="absolute left-4 top-8" />
          <div className="mx-auto grid size-[64px] place-items-center rounded-[8px] bg-yellow-cta text-[30px] font-bold text-surface shadow-yellow">
            {initials}
          </div>
          <h1 className="mt-5 text-[18px] font-bold leading-none">
            {user?.name ?? 'Tendai Moyo'}
          </h1>
          <p className="mt-2 text-[14px] font-medium leading-none text-[#555555]">
            {user?.email ?? `${firstName.toLowerCase()}@gmail.com`}
          </p>
        </ProfilePanel>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 px-2 text-[15px] font-bold leading-none">
          Personal info
        </h2>
        <ProfilePanel className="px-4 py-1">
          <PersonalRow label="Full name" value={user?.name ?? 'Tendai Moyo'} />
          <PersonalRow
            label="Email"
            value={user?.email ?? 'tendai@gmail.com'}
          />
          <PersonalRow
            label="WhatsApp number"
            value={user?.phone ?? '+263 77 123 4567'}
          />
        </ProfilePanel>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 px-2 text-[15px] font-bold leading-none">
          Notifications
        </h2>
        <ProfilePanel className="px-4 py-1">
          <NotificationRow
            detail="In-app alerts"
            enabled
            icon={<Bell size={18} strokeWidth={2.2} />}
            title="Push notifications"
          />
          <NotificationRow
            detail={user?.phone ?? '+263 77 123 4567'}
            enabled
            icon={<Phone size={18} strokeWidth={2.2} />}
            title="WhatsApp reminders"
          />
          <NotificationRow
            detail={user?.email ?? 'tendai@gmail.com'}
            icon={<Mail size={18} strokeWidth={2.2} />}
            title="Email reminders"
          />
          <Link
            className="flex items-center gap-3 py-3"
            to="/profile/notifications"
          >
            <InfoIcon tone="blue">
              <CalendarDays size={18} strokeWidth={2.2} />
            </InfoIcon>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold leading-tight">
                Default reminder day
              </p>
              <p className="mt-1 truncate text-[12px] font-medium leading-tight text-[#666666]">
                12th of each month
              </p>
            </div>
            <span className="text-[18px] leading-none text-[#555555]">›</span>
          </Link>
        </ProfilePanel>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 px-2 text-[15px] font-bold leading-none">
          Account
        </h2>
        <ProfilePanel className="px-4 py-1">
          <Link
            className="flex items-center gap-3 border-b border-[#E5E5E5] py-3"
            to="/profile/settings"
          >
            <InfoIcon tone="blue">
              <User size={18} strokeWidth={2.2} />
            </InfoIcon>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold leading-tight">
                App settings
              </p>
              <p className="mt-1 text-[12px] font-medium leading-tight text-[#666666]">
                Units and landing screen
              </p>
            </div>
            <span className="text-[18px] leading-none text-[#555555]">›</span>
          </Link>
          <button
            className="flex w-full items-center gap-3 py-3 text-left"
            type="button"
            onClick={handleLogout}
          >
            <InfoIcon tone="red">
              <LogOut size={18} strokeWidth={2.2} />
            </InfoIcon>
            <div>
              <p className="text-[14px] font-bold leading-tight text-[#E73838]">
                Logout
              </p>
              <p className="mt-1 text-[12px] font-medium leading-tight text-[#666666]">
                Sign out of this device
              </p>
            </div>
          </button>
        </ProfilePanel>
      </section>
    </ProfileScreen>
  );
}
