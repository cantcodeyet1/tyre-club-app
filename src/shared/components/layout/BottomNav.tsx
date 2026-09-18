import { Heart, Home, Map, Tag, type LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { cn } from '../../utils/cn';

type NavItem = {
  center: number;
  icon?: LucideIcon;
  label: string;
  path: string;
  wheel?: boolean;
};

const navItems: NavItem[] = [
  { label: 'Home', path: '/home', icon: Home, center: 36.5 },
  {
    label: 'Vehicles',
    path: '/vehicles',
    wheel: true,
    center: 115,
  },
  { label: 'Health', path: '/health', icon: Heart, center: 194 },
  { label: 'Trips', path: '/trips', icon: Map, center: 271 },
  { label: 'Deals', path: '/deals', icon: Tag, center: 348 },
];

function SteeringWheelNavIcon({
  active,
  className,
}: {
  active?: boolean;
  className?: string;
}) {
  const stroke = active ? 'url(#bottom-nav-yellow-gradient)' : 'currentColor';

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 30 30"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 25.8C20.9647 25.8 25.8 20.9647 25.8 15C25.8 9.03532 20.9647 4.2 15 4.2C9.03532 4.2 4.2 9.03532 4.2 15C4.2 20.9647 9.03532 25.8 15 25.8Z"
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M15 17.4C16.3255 17.4 17.4 16.3255 17.4 15C17.4 13.6745 16.3255 12.6 15 12.6C13.6745 12.6 12.6 13.6745 12.6 15C12.6 16.3255 13.6745 17.4 15 17.4Z"
        stroke={stroke}
        strokeWidth="2"
      />
      <path
        d="M15 12.6V5.4"
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M13.05 16.8L6.6 20.4"
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M16.95 16.8L23.4 20.4"
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto min-h-[103px] w-full max-w-[393px] rounded-t-[20px] bg-surface pb-safe shadow-nav">
      <svg aria-hidden="true" className="absolute size-0">
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="bottom-nav-yellow-gradient"
            x1="0"
            x2="30"
            y1="15"
            y2="15"
          >
            <stop stopColor="#FFF200" />
            <stop offset="1" stopColor="#FFCB14" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative h-full">
        {navItems.map(({ center, icon: Icon, label, path, wheel }) => (
          <NavLink
            key={path}
            style={{ left: center }}
            className={({ isActive }) =>
              cn(
                'absolute top-[28px] flex w-[64px] -translate-x-1/2 flex-col items-center text-center font-inter text-[11px] font-normal leading-none transition',
                isActive
                  ? 'text-primary'
                  : 'text-[#111] hover:text-textSecondary',
              )
            }
            to={path}
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <span className="absolute left-1/2 top-[-14px] size-[9px] -translate-x-1/2 rounded-full bg-yellow-cta" />
                ) : null}
                {wheel ? (
                  <SteeringWheelNavIcon
                    active={isActive}
                    className="size-[30px]"
                  />
                ) : Icon ? (
                  <Icon
                    aria-hidden
                    size={30}
                    strokeWidth={2}
                    {...(isActive
                      ? { stroke: 'url(#bottom-nav-yellow-gradient)' }
                      : {})}
                  />
                ) : null}
                <span
                  className={cn(
                    'mt-0 font-inter text-[11px] leading-[13px]',
                    isActive ? 'font-bold' : 'font-normal',
                  )}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
