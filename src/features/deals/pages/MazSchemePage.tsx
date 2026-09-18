import { Star } from 'lucide-react';

import {
  DealsBackHeader,
  DealsPanel,
  DealsPrimaryButton,
  DealsScreen,
  DealsWhatsAppButton,
  DetailRow,
} from '../components/DealsScreenChrome';

export default function MazSchemePage() {
  return (
    <DealsScreen className="pb-8">
      <DealsBackHeader title="MAZ scheme" />

      <section className="mb-5 rounded-[14px] bg-[#1D1D1D] p-4 text-surface">
        <div className="flex items-center gap-4">
          <span className="grid size-[48px] place-items-center rounded-[10px] bg-[#EAF5DC] text-[#5E9B32]">
            <Star size={31} strokeWidth={2.2} />
          </span>
          <div>
            <h1 className="text-[18px] font-bold leading-none">
              Member benefits
            </h1>
            <p className="mt-2 text-[12px] font-medium leading-none text-[#BDBDBD]">
              Exclusive discounts for MAZ members
            </p>
            <span className="mt-3 inline-flex h-[22px] items-center rounded-full bg-[#EAF5DC] px-3 text-[12px] font-bold text-[#5E9B32]">
              Up to 15% off
            </span>
          </div>
        </div>
      </section>

      <DealsPanel className="mb-5 bg-[#F7F7F4] shadow-none">
        <p className="text-[13px] font-medium leading-6 text-[#666666]">
          The MAZ scheme offers exclusive discounts and benefits to registered
          members. Present your MAZ card at any Tyre Club branch to redeem your
          benefits.
        </p>
      </DealsPanel>

      <DealsPanel className="mb-6">
        <h2 className="mb-3 text-[14px] font-bold leading-none">
          Scheme details
        </h2>
        <DetailRow label="Discount" value="Up to 15% off" />
        <DetailRow label="Valid at" value="All Tyre Club branches" />
        <DetailRow label="Membership" value="Via MAZ directly" />
        <DetailRow label="How to redeem" value="Present MAZ card at branch" />
      </DealsPanel>

      <div className="grid gap-4">
        <DealsPrimaryButton>Find out more</DealsPrimaryButton>
        <DealsWhatsAppButton message="Hi, I would like to know more about the MAZ member scheme." />
      </div>
    </DealsScreen>
  );
}
