import { ChevronDown, Gauge, Home, Smartphone } from 'lucide-react';

import {
  useSettingsStore,
  type DistanceUnit,
  type LandingScreen,
} from '../../../shared/stores/settingsStore';
import {
  ProfileBackButton,
  ProfilePanel,
  ProfileScreen,
} from '../components/ProfileScreenChrome';

import type { ReactNode } from 'react';

function SettingSelect({
  icon,
  label,
  value,
  onChange,
  children,
}: {
  children: ReactNode;
  icon: ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#E5E5E5] py-3 last:border-b-0">
      <span className="grid size-[30px] shrink-0 place-items-center rounded-[9px] border border-[#4567D5] bg-[#BFCBFF] text-[#3456BC]">
        {icon}
      </span>
      <label className="min-w-0 flex-1">
        <span className="block text-[14px] font-bold leading-tight">
          {label}
        </span>
        <span className="relative mt-2 block">
          <select
            className="h-10 w-full appearance-none rounded-[14px] border border-[#D9D9D9] bg-surface px-4 pr-10 text-[13px] font-medium text-textPrimary outline-none focus:border-primary"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          >
            {children}
          </select>
          <ChevronDown
            aria-hidden
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555555]"
            size={16}
            strokeWidth={2.3}
          />
        </span>
      </label>
    </div>
  );
}

export default function AppSettingsPage() {
  const { distanceUnit, landingScreen, setDistanceUnit, setLandingScreen } =
    useSettingsStore();

  return (
    <ProfileScreen>
      <header className="mt-[42px] flex items-center gap-4">
        <ProfileBackButton />
        <div>
          <h1 className="text-[22px] font-bold leading-none">App settings</h1>
          <p className="mt-2 text-[14px] font-medium leading-none text-[#666666]">
            General mobile preferences
          </p>
        </div>
      </header>

      <section className="mt-8">
        <ProfilePanel className="px-4 py-1">
          <SettingSelect
            icon={<Gauge size={18} strokeWidth={2.2} />}
            label="Distance units"
            value={distanceUnit}
            onChange={(value) => setDistanceUnit(value as DistanceUnit)}
          >
            <option value="km">Kilometres</option>
            <option value="mi">Miles</option>
          </SettingSelect>
          <SettingSelect
            icon={<Home size={18} strokeWidth={2.2} />}
            label="Default landing screen"
            value={landingScreen}
            onChange={(value) => setLandingScreen(value as LandingScreen)}
          >
            <option value="home">Home</option>
            <option value="vehicles">Vehicles</option>
            <option value="health">Health</option>
          </SettingSelect>
          <div className="flex items-center gap-3 py-3">
            <span className="grid size-[30px] shrink-0 place-items-center rounded-[9px] border border-[#4567D5] bg-[#BFCBFF] text-[#3456BC]">
              <Smartphone size={18} strokeWidth={2.2} />
            </span>
            <div>
              <p className="text-[14px] font-bold leading-tight">App version</p>
              <p className="mt-1 text-[12px] font-medium leading-tight text-[#666666]">
                Tyre Club 0.1.0
              </p>
            </div>
          </div>
        </ProfilePanel>
      </section>
    </ProfileScreen>
  );
}
