import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CalendarDays, Mail, Phone } from 'lucide-react';

import { useAuth } from '../../../features/auth/authStore';
import { queryKeys } from '../../../shared/api/queryKeys';
import { LoadingState } from '../../../shared/components/primitives/LoadingState';
import { useNotificationPreferences } from '../../../shared/hooks/useAppData';
import { profileService } from '../../../shared/services/dataServices';
import {
  ProfileBackButton,
  ProfilePanel,
  ProfileScreen,
  ProfileToggle,
} from '../components/ProfileScreenChrome';

import type { NotificationPreference } from '../../../shared/types/domain';
import type { ReactNode } from 'react';

function PreferenceRow({
  detail,
  disabled,
  enabled,
  icon,
  title,
  onToggle,
}: {
  detail: string;
  disabled?: boolean;
  enabled?: boolean;
  icon: ReactNode;
  title: string;
  onToggle?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#E5E5E5] py-3 last:border-b-0">
      <span className="grid size-[30px] shrink-0 place-items-center rounded-[9px] border border-[#4567D5] bg-[#BFCBFF] text-[#3456BC]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold leading-tight">{title}</p>
        <p className="mt-1 truncate text-[12px] font-medium leading-tight text-[#666666]">
          {detail}
        </p>
      </div>
      <ProfileToggle disabled={disabled} enabled={enabled} onClick={onToggle} />
    </div>
  );
}

export default function NotificationPreferencesPage() {
  const { user } = useAuth();
  const query = useNotificationPreferences();
  const queryClient = useQueryClient();
  const preferences = query.data ?? [];
  const findPref = (id: string) =>
    preferences.find((pref) => pref.id === id);
  const setPreference = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      profileService.setNotificationPreference(id, enabled),
    onMutate: async ({ id, enabled }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.notificationPreferences,
      });
      const previous = queryClient.getQueryData<NotificationPreference[]>(
        queryKeys.notificationPreferences,
      );

      queryClient.setQueryData<NotificationPreference[]>(
        queryKeys.notificationPreferences,
        (current) =>
          current?.map((pref) =>
            pref.id === id ? { ...pref, enabled } : pref,
          ),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.notificationPreferences,
          context.previous,
        );
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notificationPreferences,
      });
    },
  });

  function toggle(id: string, current?: boolean) {
    setPreference.mutate({ id, enabled: !current });
  }

  return (
    <ProfileScreen>
      <header className="mt-[42px] flex items-center gap-4">
        <ProfileBackButton />
        <div>
          <h1 className="text-[22px] font-bold leading-none">Notifications</h1>
          <p className="mt-2 text-[14px] font-medium leading-none text-[#666666]">
            Manage reminder channels
          </p>
        </div>
      </header>

      <section className="mt-8">
        {query.isLoading ? <LoadingState label="Loading preferences" /> : null}
        <ProfilePanel className="px-4 py-1">
          <PreferenceRow
            detail="In-app alerts"
            disabled={setPreference.isPending}
            enabled={findPref('push')?.enabled ?? true}
            icon={<Bell size={18} strokeWidth={2.2} />}
            title="Push notifications"
            onToggle={() => toggle('push', findPref('push')?.enabled)}
          />
          <PreferenceRow
            detail={user?.phone || '+263 77 123 4567'}
            disabled={setPreference.isPending}
            enabled={findPref('whatsapp')?.enabled ?? true}
            icon={<Phone size={18} strokeWidth={2.2} />}
            title="WhatsApp reminders"
            onToggle={() => toggle('whatsapp', findPref('whatsapp')?.enabled)}
          />
          <PreferenceRow
            detail={user?.email || 'tendai@gmail.com'}
            disabled={setPreference.isPending}
            enabled={findPref('email')?.enabled}
            icon={<Mail size={18} strokeWidth={2.2} />}
            title="Email reminders"
            onToggle={() => toggle('email', findPref('email')?.enabled)}
          />
          <div className="flex items-center gap-3 py-3">
            <span className="grid size-[30px] shrink-0 place-items-center rounded-[9px] border border-[#4567D5] bg-[#BFCBFF] text-[#3456BC]">
              <CalendarDays size={18} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold leading-tight">
                Default reminder day
              </p>
              <p className="mt-1 truncate text-[12px] font-medium leading-tight text-[#666666]">
                12th of each month
              </p>
            </div>
          </div>
        </ProfilePanel>
      </section>
    </ProfileScreen>
  );
}
