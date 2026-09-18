import { Target } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  DealsBackHeader,
  DealsPanel,
  DealsPrimaryButton,
  DealsScreen,
  DealsWhatsAppButton,
  DetailRow,
} from '../components/DealsScreenChrome';

export default function BuyTyresPage() {
  return (
    <DealsScreen>
      <DealsBackHeader title="Buy tyres" />

      <section className="mb-5 rounded-[14px] bg-[#1D1D1D] p-4 text-surface">
        <div className="flex items-center gap-4">
          <span className="grid size-[48px] place-items-center rounded-[10px] bg-[#E8EEFF] text-[#4567D5]">
            <Target size={30} strokeWidth={2.2} />
          </span>
          <div>
            <h1 className="text-[18px] font-bold leading-none">
              Find the right tyre
            </h1>
            <p className="mt-2 text-[12px] font-medium leading-none text-[#BDBDBD]">
              Browse by size, brand or vehicle
            </p>
            <span className="mt-3 inline-flex h-[22px] items-center rounded-full bg-[#E8EEFF] px-3 text-[12px] font-bold text-[#4567D5]">
              All major brands stocked
            </span>
          </div>
        </div>
      </section>

      <DealsPanel className="mb-5 bg-[#F7F7F4] shadow-none">
        <p className="text-[13px] font-medium leading-6 text-[#666666]">
          Browse our full tyre range online or visit your nearest branch. Our
          team will help you find the right fit for your vehicle and budget.
        </p>
      </DealsPanel>

      <DealsPanel className="mb-6">
        <h2 className="mb-3 text-[14px] font-bold leading-none">
          Brands we stock
        </h2>
        <DetailRow label="Bridgestone" value="Premium range" />
        <DetailRow label="Michelin" value="Performance & longevity" />
        <DetailRow label="Goodyear" value="All weather" />
        <DetailRow label="Dunlop" value="Sport & touring" />
      </DealsPanel>

      <div className="grid gap-4">
        <DealsPrimaryButton>Visit website</DealsPrimaryButton>
        <div className="grid grid-cols-2 gap-4">
          <DealsWhatsAppButton />
          <Link
            className="grid h-12 place-items-center rounded-[10px] border border-textPrimary bg-surface text-[15px] font-bold text-textPrimary"
            to="/tyre-club"
          >
            Find a branch
          </Link>
        </div>
      </div>
    </DealsScreen>
  );
}
