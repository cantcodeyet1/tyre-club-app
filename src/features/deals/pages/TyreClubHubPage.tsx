import { Search } from 'lucide-react';
import { useState } from 'react';

import { LoadingState } from '../../../shared/components/primitives/LoadingState';
import { useBranches } from '../../../shared/hooks/useAppData';
import {
  DealsBackHeader,
  DealsPanel,
  DealsScreen,
} from '../components/DealsScreenChrome';

import type { Branch } from '../../../shared/types/domain';

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

function whatsAppHref(phone: string) {
  return `https://wa.me/${phone.replace(/[^\d]/g, '')}`;
}

function directionsHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function BranchMap() {
  return (
    <section className="relative mb-7 h-[128px] overflow-hidden rounded-[14px] bg-[#E9ECE9] shadow-[0_5px_16px_rgba(0,0,0,0.10)]">
      <div className="absolute inset-0 opacity-70">
        <div className="h-full bg-[linear-gradient(25deg,transparent_0,transparent_31px,#CED5D5_32px,#CED5D5_33px,transparent_34px),linear-gradient(115deg,transparent_0,transparent_28px,#D9DEDE_29px,#D9DEDE_30px,transparent_31px)] bg-[length:52px_52px]" />
      </div>
      <div className="absolute left-8 top-11 size-4 rounded-full border-2 border-[#2D2D2D] bg-yellow-cta" />
      <div className="absolute right-20 top-14 size-4 rounded-full border-2 border-[#2D2D2D] bg-yellow-cta" />
      <div className="absolute bottom-7 left-28 size-4 rounded-full border-2 border-[#2D2D2D] bg-yellow-cta" />
      <p className="absolute left-5 top-4 text-[10px] font-bold text-[#6D7C9B]">
        Tyre Club Samora
      </p>
      <p className="absolute bottom-4 right-5 text-[10px] font-bold text-[#6D7C9B]">
        Tyre Club Msasa
      </p>
    </section>
  );
}

function BranchItem({ branch, open }: { branch: Branch; open: boolean }) {
  return (
    <DealsPanel className="p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-[14px] font-bold leading-tight">
            {branch.name}
          </h2>
          <p className="mt-1 text-[12px] font-medium leading-tight text-[#666666]">
            {branch.address}
          </p>
          <p className="mt-1 text-[12px] font-medium leading-tight text-[#666666]">
            {branch.hours}
          </p>
        </div>
        <span
          className={`inline-flex h-[22px] shrink-0 items-center rounded-full border px-3 text-[12px] font-bold ${
            open
              ? 'border-[#65D845] bg-[#B9F7A2] text-[#57A53C]'
              : 'border-[#F04E4E] bg-[#FFDADA] text-[#E73838]'
          }`}
        >
          {open ? 'Open now' : 'Closed'}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <a
          className="grid h-[34px] place-items-center rounded-full bg-[#F2F2F2] text-[12px] font-bold"
          href={telHref(branch.phone)}
        >
          Call
        </a>
        <a
          className="grid h-[34px] place-items-center rounded-full bg-[#6DD15F] text-[12px] font-bold text-surface"
          href={whatsAppHref(branch.phone)}
          rel="noreferrer"
          target="_blank"
        >
          WhatsApp
        </a>
        <a
          className="grid h-[34px] place-items-center rounded-full bg-yellow-cta text-[12px] font-bold"
          href={directionsHref(branch.address)}
          rel="noreferrer"
          target="_blank"
        >
          Directions
        </a>
      </div>
    </DealsPanel>
  );
}

export default function TyreClubHubPage() {
  const query = useBranches();
  const branches = query.data ?? [];
  const [search, setSearch] = useState('');
  const filtered = branches.filter((branch) => {
    const term = search.trim().toLowerCase();

    return (
      term.length === 0 ||
      `${branch.name} ${branch.address}`.toLowerCase().includes(term)
    );
  });

  return (
    <DealsScreen>
      <DealsBackHeader title="Branches & hours" />
      <BranchMap />

      <label className="relative mb-7 block">
        <span className="sr-only">Search branches</span>
        <Search
          aria-hidden
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888]"
          size={18}
        />
        <input
          className="h-10 w-full rounded-[14px] border border-[#E5E5E5] bg-surface pl-11 pr-4 text-[13px] font-medium outline-none placeholder:text-[#AAAAAA] focus:border-primary"
          placeholder="Search branches..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>

      {query.isLoading ? <LoadingState label="Loading branches" /> : null}
      <div className="grid gap-5">
        {filtered.map((branch, index) => (
          <BranchItem key={branch.id} branch={branch} open={index === 0} />
        ))}
      </div>
    </DealsScreen>
  );
}
