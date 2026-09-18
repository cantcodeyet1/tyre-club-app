import { CreditCard } from 'lucide-react';

import {
  DealsBackHeader,
  DealsPanel,
  DealsPrimaryButton,
  DealsScreen,
  DealsWhatsAppButton,
  DetailRow,
} from '../components/DealsScreenChrome';

export default function BuyOnCreditPage() {
  return (
    <DealsScreen>
      <DealsBackHeader title="Buy on credit" />

      <section className="mb-5 rounded-[14px] bg-[#1D1D1D] p-4 text-surface">
        <div className="flex items-center gap-4">
          <span className="grid size-[48px] place-items-center rounded-[10px] bg-[#FFF5C3] text-[#D4AE00]">
            <CreditCard size={30} strokeWidth={2.2} />
          </span>
          <div>
            <h1 className="text-[18px] font-bold leading-none">
              Flexible tyre credit
            </h1>
            <p className="mt-2 text-[12px] font-medium leading-none text-[#BDBDBD]">
              No deposit. Pay over time.
            </p>
            <span className="mt-3 inline-flex h-[22px] items-center rounded-full bg-yellow-cta px-3 text-[12px] font-bold text-textPrimary">
              0% interest • 3 months
            </span>
          </div>
        </div>
      </section>

      <DealsPanel className="mb-5 bg-[#F7F7F4] shadow-none">
        <p className="text-[13px] font-medium leading-6 text-[#666666]">
          Get new tyres today and pay over time with Tyre Club's flexible credit
          facility. No deposit required. Subject to approval.
        </p>
      </DealsPanel>

      <DealsPanel className="mb-6">
        <h2 className="mb-3 text-[14px] font-bold leading-none">
          How it works
        </h2>
        <DetailRow label="Minimum purchase" value="$50" />
        <DetailRow label="Payment terms" value="3 - 12 months" />
        <DetailRow label="Interest rate" value="0% for 3 months" />
        <DetailRow label="Available at" value="All branches" />
      </DealsPanel>

      <div className="grid gap-4">
        <DealsPrimaryButton>Enquire now</DealsPrimaryButton>
        <DealsWhatsAppButton />
      </div>
    </DealsScreen>
  );
}
