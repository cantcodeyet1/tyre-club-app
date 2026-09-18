import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { queryKeys } from '../../../shared/api/queryKeys';
import { ErrorState } from '../../../shared/components/primitives/ErrorState';
import { LoadingState } from '../../../shared/components/primitives/LoadingState';
import { useTrip, useVehicle } from '../../../shared/hooks/useAppData';
import { tripService } from '../../../shared/services/dataServices';
import {
  TripMiniStat,
  TripPanel,
  TripPrimaryButton,
  TripScreen,
} from '../components/TripScreenChrome';

function RouteTitle({ title }: { title: string }) {
  const [from, to] = title.split(' to ');

  return (
    <>
      {from}
      {to ? ' → ' : ''}
      {to}
    </>
  );
}

export default function PastTripDetailsPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: trip, isLoading } = useTrip(tripId);
  const { data: vehicle } = useVehicle(trip?.vehicleId);
  const deleteTrip = useMutation({
    mutationFn: () => tripService.delete(tripId ?? ''),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.trips });
      navigate('/trips');
    },
  });

  if (isLoading) {
    return (
      <TripScreen>
        <LoadingState label="Loading trip" />
      </TripScreen>
    );
  }

  if (!trip) {
    return (
      <TripScreen>
        <ErrorState message="Trip could not be found." />
      </TripScreen>
    );
  }

  const endMileageKm =
    trip.startMileageKm !== undefined
      ? trip.startMileageKm + trip.distanceKm
      : undefined;
  const total = trip.actualCost ?? trip.estimatedCost;

  return (
    <TripScreen className="pb-8">
      <div className="pt-[20px]">
        <TripPanel className="p-4">
          <div className="mb-5 flex items-start gap-2">
            <button
              aria-label="Back to trips"
              className="mt-1 grid size-[34px] shrink-0 place-items-center rounded-full bg-yellow-cta"
              type="button"
              onClick={() => navigate('/trips')}
            >
              <ChevronLeft size={22} strokeWidth={2.8} />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[22px] font-bold leading-none">
                <RouteTitle title={trip.title} />
              </h1>
              <p className="mt-2 text-[14px] font-medium uppercase leading-none text-[#777777]">
                {vehicle ? `${vehicle.name} • ${vehicle.registration}` : '—'}
              </p>
            </div>
            <span className="inline-flex h-[28px] items-center gap-2 rounded-full border border-[#65D845] bg-[#B9F7A2] px-3 text-[14px] font-medium leading-none">
              <span className="size-[10px] rounded-full bg-[#57D534]" />
              {trip.status === 'past' ? 'Completed' : trip.status}
            </span>
          </div>
          <p className="mb-5 text-right text-[14px] font-medium leading-none text-[#777777]">
            {trip.date}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <TripMiniStat label="Distance" value={`${trip.distanceKm} km`} />
            <TripMiniStat
              label="Start mileage"
              value={
                trip.startMileageKm !== undefined
                  ? `${trip.startMileageKm.toLocaleString('en-US')} km`
                  : 'Not set'
              }
            />
            <TripMiniStat
              label="End mileage"
              value={
                endMileageKm !== undefined
                  ? `${endMileageKm.toLocaleString('en-US')} km`
                  : 'Not set'
              }
            />
            <TripMiniStat label="Est. cost" value={`$${trip.estimatedCost}`} />
          </div>
        </TripPanel>

        <h2 className="mb-4 mt-8 text-[18px] font-bold leading-none">
          Cost breakdown
        </h2>
        <TripPanel className="px-4 py-3">
          {[
            ['Estimated', `$${trip.estimatedCost.toFixed(2)}`],
            ['Actual', trip.actualCost !== undefined ? `$${trip.actualCost.toFixed(2)}` : 'Not logged'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-[#E5E5E5] py-3 text-[15px] font-bold"
            >
              <span>{label}</span>
              <span className="text-[#555555]">{value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-4 text-[20px] font-bold">
            <span>Total</span>
            <span className="text-[#555555]">${total.toFixed(2)}</span>
          </div>
        </TripPanel>

        <h2 className="mb-4 mt-8 text-[18px] font-bold leading-none">Notes</h2>
        <TripPanel className="text-[18px] font-medium leading-tight text-[#555555]">
          {trip.notes || 'No notes added for this trip.'}
        </TripPanel>

        <div className="mt-14 grid grid-cols-2 gap-5">
          <button
            className="h-12 rounded-[10px] border border-[#D7D7D7] bg-surface text-[15px] font-bold text-textPrimary"
            type="button"
            onClick={() => navigate(`/trips/${trip.id}/edit`)}
          >
            Edit
          </button>
          <button
            className="h-12 rounded-[10px] bg-[#DF5656] text-[15px] font-bold text-textPrimary disabled:opacity-60"
            disabled={deleteTrip.isPending}
            type="button"
            onClick={() => deleteTrip.mutate()}
          >
            {deleteTrip.isPending ? 'Removing...' : 'Delete'}
          </button>
        </div>

        {trip.status === 'active' ? (
          <TripPrimaryButton
            className="mt-4 w-full"
            onClick={() => navigate(`/trips/${trip.id}/active`)}
          >
            <span className="inline-flex items-center gap-2">
              <Check size={18} /> Open tracker
            </span>
          </TripPrimaryButton>
        ) : null}
      </div>
    </TripScreen>
  );
}
