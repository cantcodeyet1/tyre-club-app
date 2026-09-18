import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { queryKeys } from '../../../shared/api/queryKeys';
import { Input } from '../../../shared/components/primitives/Input';
import { vehicleService } from '../../../shared/services/dataServices';
import { cn } from '../../../shared/utils/cn';
import { VehicleChrome } from '../components/VehicleScreenChrome';
import { addVehicleSchema, type AddVehicleValues } from '../schemas';

import type { ReactNode } from 'react';

function Field({
  children,
  error,
  label,
}: {
  children: ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <label className="grid gap-1.5 text-[13px] font-bold leading-none text-[#8B8B8B]">
      {label}
      {children}
      {error ? (
        <span className="text-[11px] font-medium leading-tight text-danger-text">
          {error}
        </span>
      ) : null}
    </label>
  );
}

const fuelTypes: AddVehicleValues['fuelType'][] = [
  'Petrol',
  'Diesel',
  'Electric',
  'Hybrid',
];

export default function AddVehiclePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<AddVehicleValues>({
    defaultValues: {
      colour: '',
      fuelType: undefined,
      make: '',
      mileage: '',
      model: '',
      registration: '',
      year: '',
    },
    mode: 'onChange',
    resolver: zodResolver(addVehicleSchema),
  });
  const selectedFuel = watch('fuelType');
  const createVehicle = useMutation({
    mutationFn: (values: AddVehicleValues) => vehicleService.create(values),
    onSuccess: (vehicle) => {
      queryClient.setQueryData(queryKeys.vehicles, (current) => {
        const vehicles = Array.isArray(current) ? current : [];

        return [vehicle, ...vehicles];
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });
      navigate(`/vehicles/${vehicle.id}`);
    },
  });

  return (
    <VehicleChrome className="bg-surface px-[26px] pb-8">
      <form
        className="pt-[29px]"
        onSubmit={handleSubmit((values) => createVehicle.mutate(values))}
      >
        <section>
          <h1 className="mb-3 text-[18px] font-bold leading-none">
            Vehicle photo
          </h1>
          <button
            className="grid h-[88px] w-full place-items-center rounded-[10px] bg-[#DEDEDE] text-center"
            type="button"
          >
            <span>
              <Camera
                aria-hidden
                className="mx-auto mb-1"
                size={24}
                strokeWidth={2.6}
              />
              <span className="block text-[14px] font-medium leading-none">
                Add a photo of your vehicle
              </span>
              <span className="mt-1 block text-[12px] font-medium leading-none">
                Optional - tap to upload
              </span>
            </span>
          </button>
        </section>

        <section className="mt-6 grid gap-3">
          <h2 className="text-[18px] font-bold leading-none">
            Vehicle details
          </h2>
          <Field error={errors.make?.message} label="Make">
            <Input
              invalid={Boolean(errors.make)}
              placeholder="e.g. Toyota"
              {...register('make')}
            />
          </Field>
          <Field error={errors.model?.message} label="Model">
            <Input
              invalid={Boolean(errors.model)}
              placeholder="e.g. Hilux"
              {...register('model')}
            />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field error={errors.year?.message} label="Year">
              <Input
                inputMode="numeric"
                invalid={Boolean(errors.year)}
                placeholder="e.g. 2010"
                {...register('year')}
              />
            </Field>
            <Field error={errors.colour?.message} label="Colour">
              <Input placeholder="e.g. White" {...register('colour')} />
            </Field>
          </div>
          <Field
            error={errors.registration?.message}
            label="Registration plate"
          >
            <Input
              invalid={Boolean(errors.registration)}
              placeholder="e.g. ABC 123"
              {...register('registration')}
            />
          </Field>
          <Field error={errors.mileage?.message} label="Current mileage (km)">
            <Input
              inputMode="numeric"
              invalid={Boolean(errors.mileage)}
              placeholder="e.g. 84 320"
              {...register('mileage')}
            />
          </Field>
        </section>

        <section className="mt-7 grid gap-3">
          <h2 className="text-[18px] font-bold leading-none">
            Engine & transmission
          </h2>
          <Field error={errors.fuelType?.message} label="Fuel type">
            <div className="grid grid-cols-4 gap-2">
              {fuelTypes.map((fuelType) => (
                <button
                  key={fuelType}
                  className={cn(
                    'h-10 rounded-[14px] border px-2 text-[12px] font-medium',
                    selectedFuel === fuelType
                      ? 'border-textPrimary bg-surface text-textPrimary'
                      : 'border-[#D9D9D9] bg-surface text-[#8B8B8B]',
                  )}
                  type="button"
                  onClick={() =>
                    setValue('fuelType', fuelType, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                >
                  {fuelType}
                </button>
              ))}
            </div>
          </Field>
        </section>

        <button
          className="mt-7 h-12 w-full rounded-[10px] bg-yellow-cta text-[15px] font-bold text-textPrimary shadow-yellow disabled:opacity-60"
          disabled={!isValid || createVehicle.isPending}
          type="submit"
        >
          {createVehicle.isPending ? 'Saving vehicle...' : 'Save vehicle'}
        </button>
      </form>
    </VehicleChrome>
  );
}
