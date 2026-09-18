import { Bell, Home } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../../features/auth/authStore';
import { useVehicles } from '../../hooks/useAppData';
import { Avatar } from '../primitives/Avatar';

const titles: Record<string, string> = {
  '/home': 'Tyre Club',
  '/vehicles': 'Vehicles',
  '/health': 'Health',
  '/trips': 'Trips',
  '/deals': 'Deals',
  '/tyre-club': 'Tyre Club',
  '/profile': 'Profile',
};

export function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/home';
  const vehiclesQuery = useVehicles();
  const isVehicleFlow = location.pathname.startsWith('/vehicles');
  const isHealth = location.pathname === '/health';
  const isTripsFlow = location.pathname.startsWith('/trips');
  const isDealsFlow =
    location.pathname.startsWith('/deals') ||
    location.pathname.startsWith('/tyre-club');
  const isProfileFlow = location.pathname.startsWith('/profile');
  const isSetupFlow =
    location.pathname.startsWith('/notifications') ||
    location.pathname.startsWith('/onboarding');
  const title =
    Object.entries(titles).find(
      ([path]) =>
        location.pathname === path || location.pathname.startsWith(`${path}/`),
    )?.[1] ?? 'Tyre Club';
  const hasHomeVehicles = isHome && (vehiclesQuery.data?.length ?? 0) > 0;

  if (
    isVehicleFlow ||
    isHealth ||
    isTripsFlow ||
    isDealsFlow ||
    isProfileFlow ||
    isSetupFlow
  ) {
    return null;
  }

  if (isHome) {
    return (
      <header className="sticky top-0 z-20 h-[86px] bg-surface">
        <button
          className="absolute left-[24px] top-[42px] flex h-[24px] items-center gap-[15px] text-left text-black"
          type="button"
          onClick={() => navigate('/home')}
        >
          <Home size={24} strokeWidth={2.4} />
          <span className="text-[20px] font-medium leading-none tracking-[0.02em]">
            Home
          </span>
        </button>
        <div className="absolute right-[28px] top-[33px] flex items-center gap-4">
          {hasHomeVehicles ? (
            <button
              aria-label="Notifications"
              className="relative grid size-[36px] place-items-center text-textPrimary"
              type="button"
            >
              <Bell size={29} strokeWidth={2.3} />
              <span className="absolute right-0 top-0 grid size-[18px] place-items-center rounded-full bg-[#FF1564] text-[11px] font-bold leading-none text-surface">
                3
              </span>
            </button>
          ) : null}
          <Link aria-label="Open profile" to="/profile">
            <Avatar name={user?.name} />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-background/95 px-6 pb-3 pt-5 backdrop-blur">
      <button
        className="min-w-0 text-left"
        type="button"
        onClick={() => navigate('/home')}
      >
        <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-textTertiary">
          Tyre Club
        </span>
        <span className="block truncate text-[18px] font-bold leading-tight text-textPrimary">
          {title}
        </span>
      </button>
      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="relative grid size-8 place-items-center rounded-full text-textPrimary"
          type="button"
        >
          <Bell size={18} strokeWidth={2.2} />
          <span className="absolute right-1 top-1 size-2 rounded-full bg-[#FF1564]" />
        </button>
        <Link aria-label="Open profile" to="/profile">
          <Avatar name={user?.name} />
        </Link>
      </div>
    </header>
  );
}
