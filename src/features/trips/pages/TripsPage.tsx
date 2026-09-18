import { ArrowRight, Map, Play, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ErrorState } from '../../../shared/components/primitives/ErrorState';
import { LoadingState } from '../../../shared/components/primitives/LoadingState';
import { useTrips } from '../../../shared/hooks/useAppData';
import {
  TripMiniStat,
  TripPanel,
  TripScreen,
} from '../components/TripScreenChrome';

import type { Trip } from '../../../shared/types/domain';

function TripRouteTitle({ title }: { title: string }) {
  const [from, to] = title.split(' to ');

  return (
    <>
      {from}
      {to ? ' → ' : ''}
      {to}
    </>
  );
}

function PastTripRow({ trip }: { trip: Trip }) {
  return (
    <Link
      className="flex items-center gap-3 border-b border-[#E5E5E5] py-3 last:border-b-0"
      to={`/trips/${trip.id}`}
    >
      <span className="grid size-[34px] shrink-0 place-items-center rounded-[10px] border border-[#333333] bg-[#6C6C6C] text-surface">
        <ArrowRight size={20} strokeWidth={2.5} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-bold leading-tight">
          <TripRouteTitle title={trip.title} />
        </p>
        <p className="mt-1 text-[12px] font-medium leading-tight text-[#666666]">
          {trip.date} • ${trip.estimatedCost} fuel
        </p>
      </div>
      <p className="text-right text-[12px] font-bold leading-tight">
        {trip.distanceKm} km
        <br />
        <span className="font-medium text-[#555555]">
          ${trip.actualCost ?? trip.estimatedCost} total
        </span>
      </p>
    </Link>
  );
}

export default function TripsPage() {
  const query = useTrips();
  const trips = query.data ?? [];
  const upcoming = trips.find((trip) => trip.status !== 'past') ?? trips[0];
  const pastTrips = trips.filter((trip) => trip.status === 'past');
  const listTrips = pastTrips.length ? pastTrips : trips;
  const totalDistance = trips.reduce((sum, trip) => sum + trip.distanceKm, 0);
  const totalFuel = trips.reduce((sum, trip) => sum + trip.estimatedCost, 0);
  const avgTrip = trips.length ? Math.round(totalDistance / trips.length) : 0;

  return (
    <TripScreen>
      <header className="mb-9 mt-[43px] flex items-center gap-4">
        <Map aria-hidden size={28} strokeWidth={2.2} />
        <h1 className="text-[22px] font-medium leading-none">Trips</h1>
      </header>

      {query.isLoading ? <LoadingState label="Loading trips" /> : null}
      {query.error ? <ErrorState message="Trips could not be loaded." /> : null}

      <TripPanel className="mb-7">
        <h2 className="mb-5 text-[22px] font-bold leading-none">
          All trips summary
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <TripMiniStat label="Total trips" value={trips.length} />
          <TripMiniStat
            label="Total distance"
            value={`${totalDistance.toLocaleString('en-US').replaceAll(',', ' ')} km`}
          />
          <TripMiniStat label="Total fuel" value={`$${totalFuel}`} />
          <TripMiniStat label="Avg trip" value={`${avgTrip} km`} />
        </div>
      </TripPanel>

      <section className="mb-7">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[18px] font-bold leading-none">Upcoming</h2>
          <Link
            aria-label="Plan trip"
            className="grid size-[34px] place-items-center rounded-full bg-yellow-cta text-textPrimary shadow-yellow"
            to="/trips/plan"
          >
            <Plus size={22} strokeWidth={2.8} />
          </Link>
        </div>

        {upcoming ? (
          <TripPanel className="flex items-center gap-3 px-3 py-3">
            <span className="grid size-[34px] shrink-0 place-items-center rounded-[10px] border border-[#65D845] bg-[#B9F7A2] text-[#57D534]">
              <ArrowRight size={20} strokeWidth={2.5} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-bold leading-tight">
                <TripRouteTitle title={upcoming.title} />
              </p>
              <p className="mt-1 text-[12px] font-medium leading-tight text-[#666666]">
                {upcoming.date} • ${upcoming.estimatedCost} fuel
              </p>
            </div>
            <Link
              aria-label="Open upcoming trip"
              className="text-[#70E052]"
              to={`/trips/${upcoming.id}/edit`}
            >
              <Play size={24} fill="currentColor" strokeWidth={1.5} />
            </Link>
          </TripPanel>
        ) : null}
      </section>

      <section>
        <h2 className="mb-4 text-[18px] font-bold leading-none">Past trips</h2>
        <TripPanel className="px-3 py-1">
          {listTrips.map((trip) => (
            <PastTripRow key={trip.id} trip={trip} />
          ))}
        </TripPanel>
      </section>
    </TripScreen>
  );
}
