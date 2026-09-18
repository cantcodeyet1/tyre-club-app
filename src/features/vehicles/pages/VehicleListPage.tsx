import { Funnel, LayoutGrid, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { VehicleCard } from '../../../shared/components/domain/VehicleCard';
import { Screen } from '../../../shared/components/layout/Screen';
import { EmptyState } from '../../../shared/components/primitives/EmptyState';
import { ErrorState } from '../../../shared/components/primitives/ErrorState';
import { LoadingState } from '../../../shared/components/primitives/LoadingState';
import { useVehicles } from '../../../shared/hooks/useAppData';

type VehicleFilter = 'all' | 'attention' | 'licence';

const filterOrder: VehicleFilter[] = ['all', 'attention', 'licence'];

export default function VehicleListPage() {
  const [filter, setFilter] = useState<VehicleFilter>('all');
  const [search, setSearch] = useState('');
  const query = useVehicles();
  const vehicles = query.data ?? [];
  const filtered = vehicles.filter((vehicle) => {
    const queryText = search.trim().toLowerCase();
    const matchesSearch =
      queryText.length === 0 ||
      [
        vehicle.name,
        vehicle.make,
        vehicle.model,
        vehicle.registration,
        String(vehicle.year),
      ]
        .join(' ')
        .toLowerCase()
        .includes(queryText);

    if (!matchesSearch) {
      return false;
    }

    if (filter === 'attention') {
      return vehicle.status !== 'good';
    }

    if (filter === 'licence') {
      return vehicle.complianceDue.toLowerCase().includes('licence');
    }

    return true;
  });
  const nextFilter = () => {
    const currentIndex = filterOrder.indexOf(filter);
    setFilter(filterOrder[(currentIndex + 1) % filterOrder.length]);
  };

  return (
    <Screen className="bg-[#FFFFFF] px-[24px] pb-[126px] pt-0">
      <div className="mb-[34px] mt-[42px] flex items-center gap-4 text-textPrimary">
        <LayoutGrid
          aria-hidden="true"
          className="size-[25px]"
          strokeWidth={2.6}
        />
        <h1 className="text-[22px] font-medium leading-none tracking-normal">
          Vehicles
        </h1>
      </div>

      <div className="mb-5 flex items-center gap-3">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search vehicles</span>
          <Search
            aria-hidden
            className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#777777]"
            size={20}
            strokeWidth={2.2}
          />
          <input
            className="h-[36px] w-full rounded-[14px] border border-[#D6D6D6] bg-surface pl-11 pr-4 text-[13px] font-medium text-textPrimary shadow-none outline-none placeholder:text-[#A4A4A4] focus:border-primary"
            placeholder="Search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <button
          aria-label={`Filter vehicles: ${filter}`}
          className="grid size-9 shrink-0 place-items-center rounded-full text-textPrimary"
          type="button"
          onClick={nextFilter}
        >
          <Funnel size={29} strokeWidth={2.1} />
        </button>

        <Link
          aria-label="Add vehicle"
          className="grid size-[34px] shrink-0 place-items-center rounded-full bg-yellow-cta text-textPrimary shadow-yellow"
          to="/vehicles/add"
        >
          <Plus size={23} strokeWidth={2.6} />
        </Link>
      </div>

      {query.isLoading ? <LoadingState label="Loading vehicles" /> : null}
      {query.error ? (
        <ErrorState message="Vehicles could not be loaded." />
      ) : null}
      {!query.isLoading && filtered.length === 0 ? (
        <EmptyState
          title="No vehicles match this filter"
          description="Try another search or filter."
        />
      ) : null}
      <div className="grid gap-5">
        {filtered.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </Screen>
  );
}
