import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { queryKeys } from '../../../shared/api/queryKeys';
import { useTrip, useVehicle } from '../../../shared/hooks/useAppData';
import { tripService } from '../../../shared/services/dataServices';
import {
  TripInput,
  TripMiniStat,
  TripPrimaryButton,
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

const statusBadge = {
  upcoming: {
    label: 'Upcoming',
    border: 'border-[#EFA12C]',
    bg: 'bg-[#FFD99B]',
    dot: 'bg-[#EFA12C]',
  },
  active: {
    label: 'Active',
    border: 'border-[#65D845]',
    bg: 'bg-[#B9F7A2]',
    dot: 'bg-[#57D534]',
  },
  past: {
    label: 'Completed',
    border: 'border-[#65D845]',
    bg: 'bg-[#B9F7A2]',
    dot: 'bg-[#57D534]',
  },
} as const;

export default function EditTripPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: trip } = useTrip(tripId);
  const { data: vehicle } = useVehicle(trip?.vehicleId);
  const [isEditing, setIsEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [dateDraft, setDateDraft] = useState('');
  const [notesDraft, setNotesDraft] = useState('');

  useEffect(() => {
    if (trip) {
      setTitleDraft(trip.title);
      setDateDraft(trip.date);
      setNotesDraft(trip.notes ?? '');
    }
  }, [trip]);

  const invalidateTrips = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.trips });

  const completeTrip = useMutation({
    mutationFn: () =>
      tripService.update(tripId ?? '', {
        status: 'past',
        actualCost: trip?.estimatedCost,
      }),
    onSuccess: async () => {
      await invalidateTrips();
      navigate('/trips');
    },
  });
  const saveEdits = useMutation({
    mutationFn: () =>
      tripService.update(tripId ?? '', {
        title: titleDraft,
        date: dateDraft,
        notes: notesDraft,
      }),
    onSuccess: async () => {
      await invalidateTrips();
      setIsEditing(false);
    },
  });
  const deleteTrip = useMutation({
    mutationFn: () => tripService.delete(tripId ?? ''),
    onSuccess: async () => {
      await invalidateTrips();
      navigate('/trips');
    },
  });

  function cancelEdits() {
    if (trip) {
      setTitleDraft(trip.title);
      setDateDraft(trip.date);
      setNotesDraft(trip.notes ?? '');
    }

    setIsEditing(false);
  }

  const badge = statusBadge[trip?.status ?? 'upcoming'];

  return (
    <main className="min-h-screen bg-surface text-textPrimary">
      <form
        className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[393px] rounded-t-[18px] bg-surface px-[24px] pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 shadow-phone"
        onSubmit={(event) => {
          event.preventDefault();

          if (isEditing) {
            saveEdits.mutate();
          } else {
            completeTrip.mutate();
          }
        }}
      >
        <div className="mx-auto mb-12 h-[5px] w-[104px] rounded-full bg-[#E0E0E0]" />

        <div className="mb-6 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <TripInput
                className="h-[34px] text-[16px] font-bold"
                value={titleDraft}
                onChange={(event) => setTitleDraft(event.target.value)}
              />
            ) : (
              <h1 className="truncate text-[22px] font-bold leading-none">
                <RouteTitle title={trip?.title} />
              </h1>
            )}
            <p className="mt-6 text-[18px] font-bold leading-none text-[#8B8B8B]">
              {vehicle ? `${vehicle.name} • ${vehicle.registration ?? 'No plate'}` : '—'}
            </p>
            {isEditing ? (
              <TripInput
                className="mt-3 h-[34px] max-w-[160px]"
                type="date"
                value={dateDraft}
                onChange={(event) => setDateDraft(event.target.value)}
              />
            ) : (
              <p className="mt-3 text-[14px] font-medium leading-none text-[#777777]">
                {badge.label} • {trip?.date}
              </p>
            )}
          </div>
          <span
            className={`inline-flex h-[28px] shrink-0 items-center gap-2 rounded-full border px-3 text-[14px] font-medium leading-none ${badge.border} ${badge.bg}`}
          >
            <span className={`size-[10px] rounded-full ${badge.dot}`} />
            {badge.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <TripMiniStat
            label="Est. distance"
            value={`${trip?.distanceKm ?? 0} km`}
          />
          <TripMiniStat label="Date" value={trip?.date ?? '—'} />
          <TripMiniStat
            label="Start mileage"
            value={
              trip?.startMileageKm !== undefined
                ? `${trip.startMileageKm.toLocaleString('en-US')} km`
                : 'Not set'
            }
          />
          <TripMiniStat
            label="Est. fuel cost"
            value={`~$${trip?.estimatedCost ?? 0}`}
          />
        </div>

        <div className="mt-5 border-t border-[#E5E5E5] pt-5">
          <label className="grid gap-3 text-[18px] font-bold leading-none text-[#8B8B8B]">
            Notes
            <textarea
              className="min-h-[74px] resize-none rounded-[14px] border border-[#D9D9D9] bg-surface px-4 py-3 text-[13px] font-medium text-textPrimary outline-none placeholder:text-[#909090] focus:border-primary"
              placeholder="Add any notes about this trip..."
              readOnly={!isEditing}
              value={notesDraft}
              onChange={(event) => setNotesDraft(event.target.value)}
            />
          </label>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-5">
          <button
            className="h-12 rounded-[10px] border border-[#D7D7D7] bg-surface text-[15px] font-bold text-textPrimary"
            type="button"
            onClick={() => (isEditing ? cancelEdits() : setIsEditing(true))}
          >
            {isEditing ? 'Cancel' : 'Edit'}
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

        <TripPrimaryButton
          className="mt-7 w-full"
          disabled={
            isEditing ? saveEdits.isPending : completeTrip.isPending
          }
          type="submit"
        >
          {isEditing
            ? saveEdits.isPending
              ? 'Saving...'
              : 'Save changes'
            : completeTrip.isPending
              ? 'Saving...'
              : 'Mark as complete'}
        </TripPrimaryButton>
      </form>
    </main>
  );
}
