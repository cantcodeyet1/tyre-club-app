import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, ChevronDown } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { queryKeys } from '../../../shared/api/queryKeys';
import { useVehicles } from '../../../shared/hooks/useAppData';
import { tripService } from '../../../shared/services/dataServices';
import {
  TripField,
  TripInput,
  TripPrimaryButton,
} from '../components/TripScreenChrome';

const planTripSchema = z.object({
  vehicleId: z.string().min(1, 'Select a vehicle'),
  from: z.string().trim().min(1, 'Enter a starting point'),
  to: z.string().trim().min(1, 'Enter a destination'),
  date: z.string().min(1, 'Select a date'),
  startMileage: z.string().trim().optional(),
});

type PlanTripValues = z.infer<typeof planTripSchema>;

export default function PlanTripPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const vehicles = useVehicles().data ?? [];
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<PlanTripValues>({
    defaultValues: {
      vehicleId: '',
      from: '',
      to: '',
      date: '',
      startMileage: '',
    },
    mode: 'onChange',
    resolver: zodResolver(planTripSchema),
  });
  const selectedVehicleId = watch('vehicleId');

  // Vehicles load asynchronously, so the first render has none — once they
  // arrive, default the select to the first one (only if the user hasn't
  // already picked something).
  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicleId) {
      setValue('vehicleId', vehicles[0].id, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles, setValue]);
  const createTrip = useMutation({
    mutationFn: (values: PlanTripValues) =>
      tripService.create({
        vehicleId: values.vehicleId,
        title: `${values.from} to ${values.to}`,
        route: `${values.from} -> ${values.to}`,
        date: values.date,
        startMileageKm: values.startMileage
          ? Number(values.startMileage.replace(/\s/g, ''))
          : undefined,
      }),
    onSuccess: (trip) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.trips });
      navigate(`/trips/${trip?.id}/active`);
    },
  });

  return (
    <main className="min-h-screen bg-surface text-textPrimary">
      <form
        className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[393px] rounded-t-[18px] bg-surface px-[24px] pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-7 shadow-phone"
        onSubmit={handleSubmit((values) => createTrip.mutate(values))}
      >
        <div className="mx-auto mb-12 h-[5px] w-[104px] rounded-full bg-[#E0E0E0]" />

        <h1 className="text-[22px] font-bold leading-none">Plan a trip</h1>
        <p className="mt-4 text-[14px] font-medium leading-none text-[#888888]">
          Log before your journey
        </p>

        <div className="mt-7 grid gap-5">
          <TripField label="Vehicle">
            <span className="relative">
              <select
                className="h-10 w-full appearance-none rounded-[14px] border border-[#D9D9D9] bg-surface px-4 pr-10 text-[13px] font-medium text-textPrimary outline-none focus:border-primary"
                {...register('vehicleId')}
              >
                {vehicles.length ? (
                  vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} • {vehicle.registration || 'No plate'}
                    </option>
                  ))
                ) : (
                  <option value="">Add a vehicle first</option>
                )}
              </select>
              <ChevronDown
                aria-hidden
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555555]"
                size={16}
                strokeWidth={2.3}
              />
            </span>
          </TripField>

          <div className="grid grid-cols-2 gap-3">
            <TripField label="From">
              <TripInput placeholder="e.g. Harare" {...register('from')} />
            </TripField>
            <TripField label="To">
              <TripInput placeholder="e.g. Bulawayo" {...register('to')} />
            </TripField>
          </div>

          <TripField label="Date">
            <span className="relative">
              <TripInput type="date" {...register('date')} />
              <Calendar
                aria-hidden
                className="absolute right-4 top-1/2 -translate-y-1/2"
                size={18}
                strokeWidth={2.4}
              />
            </span>
          </TripField>

          <TripField label="Start mileage (km)">
            <TripInput
              inputMode="numeric"
              placeholder="e.g. 84 320"
              {...register('startMileage')}
            />
          </TripField>

          {errors.vehicleId || errors.from || errors.to || errors.date ? (
            <p className="text-[12px] font-bold text-danger-text">
              {errors.vehicleId?.message ??
                errors.from?.message ??
                errors.to?.message ??
                errors.date?.message}
            </p>
          ) : null}
        </div>

        <TripPrimaryButton
          className="mt-9 w-full disabled:opacity-60"
          disabled={!isValid || vehicles.length === 0 || createTrip.isPending}
          type="submit"
        >
          {createTrip.isPending ? 'Saving...' : 'Save entry'}
        </TripPrimaryButton>
      </form>
    </main>
  );
}
