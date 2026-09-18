import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { queryKeys } from '../../../shared/api/queryKeys';
import { Modal } from '../../../shared/components/primitives/Modal';
import { useTrip } from '../../../shared/hooks/useAppData';
import { tripService } from '../../../shared/services/dataServices';
import {
  TripMiniStat,
  TripPanel,
  TripPrimaryButton,
  TripScreen,
} from '../components/TripScreenChrome';

function RouteTitle({ title }: { title?: string }) {
  const [from, to] = (title ?? 'Harare to Bulawayo').split(' to ');

  return (
    <>
      {from}
      {to ? ' → ' : ''}
      {to}
    </>
  );
}

function formatElapsed(createdAt?: string) {
  if (!createdAt) {
    return '—';
  }

  const elapsedMs = Date.now() - new Date(createdAt).getTime();
  const totalMinutes = Math.max(0, Math.floor(elapsedMs / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}

export default function ActiveTripPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const { data: trip } = useTrip(tripId);
  const [, forceTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => forceTick((n) => n + 1), 60000);

    return () => window.clearInterval(interval);
  }, []);

  const completeTrip = useMutation({
    mutationFn: () =>
      tripService.update(tripId ?? '', {
        status: 'past',
        actualCost: trip?.estimatedCost,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.trips });
      navigate('/trips');
    },
  });

  return (
    <TripScreen className="pb-8">
      <div className="pt-[33px]">
        <TripPanel>
          <div className="mb-6 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-[22px] font-bold leading-none">
                <RouteTitle title={trip?.title} />
              </h1>
              <p className="mt-3 text-[14px] font-medium leading-none text-[#777777]">
                Active journey
              </p>
            </div>
            <span className="inline-flex h-[28px] items-center gap-2 rounded-full border border-[#65D845] bg-[#B9F7A2] px-3 text-[14px] font-medium leading-none">
              <span className="size-[10px] rounded-full bg-[#57D534]" />
              Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TripMiniStat label="Distance" value={`${trip?.distanceKm ?? 0} km`} />
            <TripMiniStat label="Elapsed" value={formatElapsed(trip?.createdAt)} />
            <TripMiniStat
              label="Fuel estimate"
              value={`$${trip?.estimatedCost ?? 0}`}
            />
            <TripMiniStat
              label="Start mileage"
              value={
                trip?.startMileageKm !== undefined
                  ? `${trip.startMileageKm.toLocaleString('en-US')} km`
                  : 'Not set'
              }
            />
          </div>
        </TripPanel>

        <TripPrimaryButton
          className="mt-7 w-full"
          onClick={() => setIsCompleteOpen(true)}
        >
          Complete trip
        </TripPrimaryButton>
      </div>

      <Modal
        isOpen={isCompleteOpen}
        title="Trip complete"
        onClose={() => setIsCompleteOpen(false)}
      >
        <p className="text-[14px] font-medium leading-5 text-textSecondary">
          Add actual costs and generate a shareable trip summary.
        </p>
        <TripPrimaryButton
          className="mt-4 w-full"
          disabled={completeTrip.isPending}
          onClick={() => completeTrip.mutate()}
        >
          {completeTrip.isPending ? 'Saving...' : 'Generate summary'}
        </TripPrimaryButton>
      </Modal>
    </TripScreen>
  );
}
