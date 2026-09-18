import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { queryKeys } from '../../../shared/api/queryKeys';
import { Modal } from '../../../shared/components/primitives/Modal';
import { useVehicle } from '../../../shared/hooks/useAppData';
import { vehicleService } from '../../../shared/services/dataServices';
import { VehicleChrome } from '../components/VehicleScreenChrome';

import type { ReactNode } from 'react';

const editVehicleSchema = z.object({
  make: z.string().trim().min(1, 'Make is required'),
  model: z.string().trim().min(1, 'Model is required'),
  year: z
    .string()
    .trim()
    .refine((value) => Number.isFinite(Number(value)), 'Enter a valid year'),
  colour: z.string().trim().optional(),
  registration: z.string().trim().min(1, 'Registration is required'),
  mileage: z
    .string()
    .trim()
    .refine(
      (value) => Number.isFinite(Number(value.replace(/\s/g, ''))),
      'Mileage must be a number',
    ),
});

type EditVehicleValues = z.infer<typeof editVehicleSchema>;

function FormInput({
  invalid,
  placeholder,
  type = 'text',
  ...props
}: {
  invalid?: boolean;
  placeholder: string;
  type?: string;
} & Omit<React.ComponentPropsWithoutRef<'input'>, 'placeholder' | 'type'>) {
  return (
    <input
      className={`h-10 w-full rounded-[14px] border bg-surface px-4 text-[13px] font-medium text-textPrimary outline-none placeholder:text-[#A0A0A0] focus:border-primary ${
        invalid ? 'border-danger-text' : 'border-[#D9D9D9]'
      }`}
      placeholder={placeholder}
      type={type}
      {...props}
    />
  );
}

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

export default function EditVehiclePage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { data: vehicle } = useVehicle(vehicleId);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<EditVehicleValues>({
    defaultValues: {
      make: '',
      model: '',
      year: '',
      colour: '',
      registration: '',
      mileage: '',
    },
    resolver: zodResolver(editVehicleSchema),
  });

  useEffect(() => {
    if (vehicle) {
      reset({
        make: vehicle.make,
        model: vehicle.model,
        year: String(vehicle.year),
        colour: vehicle.colour ?? '',
        registration: vehicle.registration,
        mileage: String(vehicle.odometerKm),
      });
    }
  }, [vehicle, reset]);

  const updateVehicle = useMutation({
    mutationFn: (values: EditVehicleValues) =>
      vehicleService.update(vehicleId ?? '', {
        make: values.make.trim(),
        model: values.model.trim(),
        year: Number(values.year),
        registration: values.registration.trim().toUpperCase(),
        odometerKm: Number(values.mileage.replace(/\s/g, '')),
        colour: values.colour?.trim() || undefined,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });

      if (vehicleId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.vehicle(vehicleId),
        });
      }

      navigate(`/vehicles/${vehicleId}`);
    },
  });
  const deleteVehicle = useMutation({
    mutationFn: () => vehicleService.delete(vehicleId ?? ''),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });
      navigate('/vehicles');
    },
  });

  return (
    <VehicleChrome className="bg-surface px-[26px] pb-8">
      <form
        className="pt-[29px]"
        onSubmit={handleSubmit((values) => updateVehicle.mutate(values))}
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
                Update your vehicle photo
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
            <FormInput
              invalid={Boolean(errors.make)}
              placeholder="e.g. Toyota"
              {...register('make')}
            />
          </Field>
          <Field error={errors.model?.message} label="Model">
            <FormInput
              invalid={Boolean(errors.model)}
              placeholder="e.g. Hilux"
              {...register('model')}
            />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field error={errors.year?.message} label="Year">
              <FormInput
                invalid={Boolean(errors.year)}
                placeholder="e.g. 2010"
                type="number"
                {...register('year')}
              />
            </Field>
            <Field error={errors.colour?.message} label="Colour">
              <FormInput placeholder="e.g. White" {...register('colour')} />
            </Field>
          </div>
          <Field error={errors.registration?.message} label="Registration plate">
            <FormInput
              invalid={Boolean(errors.registration)}
              placeholder="e.g. ABC 123"
              {...register('registration')}
            />
          </Field>
          <Field error={errors.mileage?.message} label="Current mileage (km)">
            <FormInput
              invalid={Boolean(errors.mileage)}
              placeholder="e.g. 84 320"
              {...register('mileage')}
            />
          </Field>
        </section>

        <div className="mt-7 grid gap-2">
          <button
            className="h-12 w-full rounded-[10px] bg-yellow-cta text-[15px] font-bold text-textPrimary shadow-yellow disabled:opacity-60"
            disabled={updateVehicle.isPending}
            type="submit"
          >
            {updateVehicle.isPending ? 'Saving...' : 'Save changes'}
          </button>
          <button
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] border border-[#F04E4E] bg-surface text-[15px] font-bold text-[#E22E2E]"
            type="button"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 size={13} strokeWidth={2.3} />
            Remove vehicle
          </button>
        </div>
      </form>
      {vehicle ? (
        <Modal
          isOpen={isDeleteOpen}
          title="Remove vehicle?"
          onClose={() => setIsDeleteOpen(false)}
        >
          <p className="text-[13px] font-medium leading-5 text-[#666666]">
            This removes {vehicle.name} and its check history.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              className="h-11 rounded-[10px] border border-[#D7D7D7] bg-surface text-[14px] font-bold"
              type="button"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </button>
            <button
              className="h-11 rounded-[10px] bg-[#DF5656] text-[14px] font-bold text-textPrimary disabled:opacity-60"
              disabled={deleteVehicle.isPending}
              type="button"
              onClick={() => deleteVehicle.mutate()}
            >
              Remove
            </button>
          </div>
        </Modal>
      ) : null}
    </VehicleChrome>
  );
}
