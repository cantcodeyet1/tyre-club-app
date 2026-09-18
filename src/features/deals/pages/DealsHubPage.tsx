import {
  ChevronRight,
  CreditCard,
  Mail,
  MapPin,
  Star,
  Tag,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { LoadingState } from '../../../shared/components/primitives/LoadingState';
import { useDeals } from '../../../shared/hooks/useAppData';
import { DealsPanel, DealsScreen } from '../components/DealsScreenChrome';

type Offer = {
  description: string;
  icon: typeof CreditCard;
  label: string;
  route: string;
  subtitle: string;
  tone: 'blue' | 'green' | 'yellow';
};

const offers: Offer[] = [
  {
    description: 'Flexible payment options available',
    icon: CreditCard,
    label: 'Buy tyres on credit',
    route: '/deals/credit',
    subtitle: '0% interest for 3 months',
    tone: 'yellow',
  },
  {
    description: 'Member benefits and discounts',
    icon: Star,
    label: 'MAZ scheme',
    route: '/deals/maz',
    subtitle: 'Up to 15% off for members',
    tone: 'green',
  },
  {
    description: 'Browse catalogue, order online',
    icon: Target,
    label: 'Buy tyres',
    route: '/deals/buy-tyres',
    subtitle: 'Visit website or contact a branch',
    tone: 'blue',
  },
];

function OfferRow({ offer }: { offer: Offer }) {
  const Icon = offer.icon;
  const toneClass = {
    blue: 'bg-[#E8EEFF] text-[#4567D5]',
    green: 'bg-[#EAF5DC] text-[#5E9B32]',
    yellow: 'bg-[#FFF5C3] text-[#D4AE00]',
  }[offer.tone];

  return (
    <Link
      className="flex items-center gap-4 border-b border-[#E5E5E5] py-4 last:border-b-0"
      to={offer.route}
    >
      <span
        className={`grid size-[42px] shrink-0 place-items-center rounded-[10px] ${toneClass}`}
      >
        <Icon size={24} strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-bold leading-tight">
          {offer.label}
        </p>
        <p className="mt-1 text-[12px] font-medium leading-tight text-[#666666]">
          {offer.description}
        </p>
        <p className="mt-1 text-[12px] font-medium leading-tight text-[#B49300]">
          {offer.subtitle}
        </p>
      </div>
      <ChevronRight
        aria-hidden
        className="text-[#777777]"
        size={16}
        strokeWidth={2.2}
      />
    </Link>
  );
}

export default function DealsHubPage() {
  const query = useDeals();

  return (
    <DealsScreen>
      <header className="mb-5 mt-[43px] flex items-center gap-3">
        <Tag aria-hidden size={23} strokeWidth={2.2} />
        <h1 className="text-[18px] font-medium leading-none">Deals</h1>
      </header>

      {query.isLoading ? <LoadingState label="Loading deals" /> : null}

      <section className="relative mb-7 overflow-hidden rounded-[16px] bg-[#222] px-4 py-3 text-center text-surface shadow-[0_5px_16px_rgba(0,0,0,0.16)]">
        <div className="absolute inset-0 opacity-45">
          <div className="h-full bg-[repeating-linear-gradient(105deg,#111_0,#111_18px,#363636_18px,#363636_34px)]" />
        </div>
        <div className="relative">
          <p className="text-[18px] font-bold leading-none">
            Rolling <span className="text-primary">Deals</span>
          </p>
          <p className="mt-2 text-[14px] font-medium leading-none text-surface">
            Get{' '}
            <span className="rounded-full bg-yellow-cta px-1 font-bold text-textPrimary">
              20%
            </span>{' '}
            off your first tyre fitment!
          </p>
          <div className="mx-auto mt-9 flex w-fit gap-1.5">
            <span className="h-[3px] w-6 rounded-full bg-surface" />
            <span className="h-[3px] w-6 rounded-full bg-surface" />
            <span className="h-[3px] w-6 rounded-full bg-surface" />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-[14px] font-bold leading-none">
          Offers & financing
        </h2>
        <DealsPanel className="px-4 py-0">
          {offers.map((offer) => (
            <OfferRow key={offer.route} offer={offer} />
          ))}
        </DealsPanel>
      </section>

      <section>
        <h2 className="mb-3 text-[14px] font-bold leading-none">Tyre Club</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            className="rounded-[12px] border border-[#E5E5E5] bg-surface p-4 shadow-[0_4px_12px_rgba(0,0,0,0.07)]"
            to="/tyre-club"
          >
            <span className="grid size-[34px] place-items-center rounded-[9px] bg-[#FFF5C3] text-[#B49300]">
              <MapPin size={20} />
            </span>
            <p className="mt-3 text-[14px] font-bold leading-none">Branches</p>
            <p className="mt-1 text-[12px] font-medium leading-tight text-[#666666]">
              Hours & directions
            </p>
          </Link>
          <Link
            className="rounded-[12px] border border-[#E5E5E5] bg-surface p-4 shadow-[0_4px_12px_rgba(0,0,0,0.07)]"
            to="/tyre-club/help"
          >
            <span className="grid size-[34px] place-items-center rounded-[9px] bg-[#EAF5DC] text-[#5E9B32]">
              <Mail size={20} />
            </span>
            <p className="mt-3 text-[14px] font-bold leading-none">
              Contact us
            </p>
            <p className="mt-1 text-[12px] font-medium leading-tight text-[#666666]">
              Call, WhatsApp, email
            </p>
          </Link>
        </div>
      </section>
    </DealsScreen>
  );
}
