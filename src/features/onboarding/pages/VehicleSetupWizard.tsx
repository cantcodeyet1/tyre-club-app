import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CalendarDays, ChevronRight, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { queryKeys } from '../../../shared/api/queryKeys';
import { profileService, vehicleService } from '../../../shared/services/dataServices';
import { useUiStore } from '../../../shared/stores/uiStore';
import { cn } from '../../../shared/utils/cn';
import { useAuth } from '../../auth/authStore';
import {
  AuthBackButton,
  AuthInput,
  AuthPrimaryButton,
  AuthSecondaryButton,
  ChoicePill,
  FieldLabel,
  SetupScreen,
  StepProgress,
} from '../../auth/components/AuthScreenChrome';
import { ProfileToggle } from '../../profile/components/ProfileScreenChrome';

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

const numericText = (label: string) =>
  requiredText(label).refine(
    (value) => Number.isFinite(Number(value.replace(/\s/g, ''))),
    `${label} must be a number`,
  );

const positiveNumericText = (label: string) =>
  numericText(label).refine(
    (value) => Number(value.replace(/\s/g, '')) > 0,
    `${label} must be greater than 0`,
  );

const vehicleSetupSchema = z.object({
  alias: requiredText('Vehicle alias'),
  year: numericText('Year').refine((value) => {
    const year = Number(value);
    const nextYear = new Date().getFullYear() + 1;

    return year >= 1900 && year <= nextYear;
  }, 'Enter a valid year'),
  registration: requiredText('Registration plate'),
  mileage: positiveNumericText('Current mileage'),
  fuelType: z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid'], {
    error: 'Fuel type is required',
  }),
  transmission: z.enum(['Manual', 'Automatic'], {
    error: 'Transmission is required',
  }),
  tyreSize: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
});

type VehicleSetupValues = z.infer<typeof vehicleSetupSchema>;

const step1Fields: (keyof VehicleSetupValues)[] = [
  'alias',
  'year',
  'registration',
  'mileage',
  'fuelType',
  'transmission',
];
const step2Fields: (keyof VehicleSetupValues)[] = ['tyreSize'];

function splitAlias(alias: string): { make: string; model: string } {
  const trimmed = alias.trim();
  const spaceIndex = trimmed.indexOf(' ');

  if (spaceIndex === -1) {
    return { make: trimmed, model: trimmed };
  }

  return {
    make: trimmed.slice(0, spaceIndex),
    model: trimmed.slice(spaceIndex + 1),
  };
}

function WizardHeader({
  currentStep,
  onBack,
}: {
  currentStep: number;
  onBack: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-4">
        <AuthBackButton className="-ml-[24px]" onClick={onBack} />
        <StepProgress currentStep={currentStep} />
      </div>
      <p className="ml-[64px] mt-1 text-[13px] font-medium text-textSecondary">
        Step {currentStep} of 4
      </p>
    </>
  );
}

function NotificationRow({
  caption,
  enabled,
  icon,
  title,
  trailing,
  onToggle,
}: {
  caption: string;
  enabled?: boolean;
  icon: 'bell' | 'calendar' | 'mail' | 'phone';
  title: string;
  trailing?: 'chevron' | 'toggle';
  onToggle?: () => void;
}) {
  const icons = {
    bell: Bell,
    calendar: CalendarDays,
    mail: Mail,
    phone: Phone,
  };
  const Icon = icons[icon];

  return (
    <div className="flex min-h-[54px] items-center gap-3 border-b border-[#E8E8E8] last:border-b-0">
      <span className="grid size-[30px] shrink-0 place-items-center rounded-[8px] border border-[#6A82D8] bg-[#BFD0FF] text-[#314B99]">
        <Icon size={18} strokeWidth={2.1} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-black leading-tight">
          {title}
        </span>
        <span className="block text-[11px] font-medium leading-tight text-textSecondary">
          {caption}
        </span>
      </span>
      {trailing === 'chevron' ? (
        <ChevronRight size={18} className="text-textSecondary" />
      ) : (
        <ProfileToggle enabled={enabled} onClick={onToggle} />
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#E8E8E8] py-4 last:border-b-0">
      <span className="text-[14px] font-black text-textPrimary">{label}</span>
      <span className="text-right text-[13px] font-semibold text-textPrimary">
        {value}
      </span>
    </div>
  );
}

export default function VehicleSetupWizard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuth();
  const { setWizardStep, wizardStep } = useUiStore();
  const currentStep = Math.min(4, Math.max(1, wizardStep));
  const [pushEnabled, setPushEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<VehicleSetupValues>({
    resolver: zodResolver(vehicleSetupSchema),
    defaultValues: {
      alias: '',
      year: '',
      registration: '',
      mileage: '',
      fuelType: 'Petrol',
      transmission: 'Manual',
      tyreSize: '',
      whatsapp: '',
    },
  });
  const values = watch();

  function goBack() {
    if (currentStep > 1) {
      setWizardStep(currentStep - 1);
      return;
    }

    navigate(-1);
  }

  function goNext() {
    setWizardStep(Math.min(4, currentStep + 1));
  }

  const finishMutation = useMutation({
    mutationFn: async (submitted: VehicleSetupValues) => {
      const { make, model } = splitAlias(submitted.alias);

      await vehicleService.create(
        {
          make,
          model,
          year: submitted.year,
          registration: submitted.registration,
          mileage: submitted.mileage,
          fuelType: submitted.fuelType,
        },
        { transmission: submitted.transmission, tyreSize: submitted.tyreSize },
      );

      await Promise.all([
        profileService.setNotificationPreference('push', pushEnabled),
        profileService.setNotificationPreference('whatsapp', whatsappEnabled),
        profileService.setNotificationPreference('email', emailEnabled),
        submitted.whatsapp
          ? updateUser({ phone: submitted.whatsapp })
          : Promise.resolve(),
      ]);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notificationPreferences,
      });
      setWizardStep(1);
      navigate('/home', { replace: true });
    },
    onError: (error) => {
      setSubmitError(
        error instanceof Error ? error.message : 'Could not save your vehicle',
      );
    },
  });

  function onInvalid(fieldErrors: typeof errors) {
    const erroredFields = Object.keys(fieldErrors) as (keyof VehicleSetupValues)[];

    if (erroredFields.some((field) => step1Fields.includes(field))) {
      setWizardStep(1);

      return;
    }

    if (erroredFields.some((field) => step2Fields.includes(field))) {
      setWizardStep(2);
    }
  }

  function finishSetup(submitted: VehicleSetupValues) {
    setSubmitError(null);
    finishMutation.mutate(submitted);
  }

  const initials =
    user?.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'TC';
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const enabledChannels = [
    whatsappEnabled ? 'WhatsApp' : null,
    pushEnabled ? 'In-app' : null,
    emailEnabled ? 'Email' : null,
  ].filter(Boolean);

  return (
    <SetupScreen>
      <form
        className="flex min-h-screen flex-col px-[24px] pb-6 pt-[5px]"
        onSubmit={handleSubmit(finishSetup, onInvalid)}
      >
        <WizardHeader currentStep={currentStep} onBack={goBack} />

        {currentStep === 1 ? (
          <section className="mt-4">
            <h1 className="text-[22px] font-black leading-tight">
              Tell us about your vehicle
            </h1>
            <p className="mt-3 max-w-[280px] text-[14px] font-semibold leading-[1.15] text-textSecondary">
              This helps us track maintenance and reminders accurately.
            </p>

            <div className="mt-6 grid gap-4">
              <label>
                <FieldLabel required>Vehicle Alias</FieldLabel>
                <AuthInput
                  invalid={Boolean(errors.alias)}
                  placeholder="eg. Toyota Hilux / Mike's Truck"
                  {...register('alias')}
                />
                {errors.alias ? (
                  <p className="mt-1 text-[11px] font-medium text-danger-text">
                    {errors.alias.message}
                  </p>
                ) : null}
              </label>
              <label>
                <FieldLabel required>Year</FieldLabel>
                <AuthInput
                  invalid={Boolean(errors.year)}
                  placeholder="e.g. 2010"
                  {...register('year')}
                />
                {errors.year ? (
                  <p className="mt-1 text-[11px] font-medium text-danger-text">
                    {errors.year.message}
                  </p>
                ) : null}
              </label>
              <label>
                <FieldLabel required>Registration plate</FieldLabel>
                <AuthInput
                  invalid={Boolean(errors.registration)}
                  placeholder="e.g. ABC 123"
                  {...register('registration')}
                />
                {errors.registration ? (
                  <p className="mt-1 text-[11px] font-medium text-danger-text">
                    {errors.registration.message}
                  </p>
                ) : null}
              </label>
              <label>
                <FieldLabel required>Current mileage (km)</FieldLabel>
                <AuthInput
                  invalid={Boolean(errors.mileage)}
                  placeholder="e.g. 84 320"
                  {...register('mileage')}
                />
                {errors.mileage ? (
                  <p className="mt-1 text-[11px] font-medium text-danger-text">
                    {errors.mileage.message}
                  </p>
                ) : null}
              </label>
            </div>

            <div className="mt-6">
              <FieldLabel required>Fuel type</FieldLabel>
              <div className="grid grid-cols-4 gap-2">
                {(['Petrol', 'Diesel', 'Electric', 'Hybrid'] as const).map(
                  (fuel) => (
                    <ChoicePill
                      key={fuel}
                      active={values.fuelType === fuel}
                      className="px-0"
                      onClick={() =>
                        setValue('fuelType', fuel, { shouldValidate: true })
                      }
                    >
                      {fuel}
                    </ChoicePill>
                  ),
                )}
              </div>
            </div>

            <div className="mt-6">
              <FieldLabel required>Transmission</FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                {(['Manual', 'Automatic'] as const).map((transmission) => (
                  <ChoicePill
                    key={transmission}
                    active={values.transmission === transmission}
                    onClick={() =>
                      setValue('transmission', transmission, {
                        shouldValidate: true,
                      })
                    }
                  >
                    {transmission}
                  </ChoicePill>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {currentStep === 2 ? (
          <section className="mt-4">
            <h1 className="text-[22px] font-black leading-tight">
              Tyre details
            </h1>
            <p className="mt-3 max-w-[280px] text-[14px] font-semibold leading-[1.15] text-textSecondary">
              Log your current tyre size. You can update these any time
            </p>

            <div className="mt-7">
              <label>
                <FieldLabel>Tyre size</FieldLabel>
                <AuthInput
                  placeholder="e.g. 265/65 R17"
                  {...register('tyreSize')}
                />
              </label>
            </div>
          </section>
        ) : null}

        {currentStep === 3 ? (
          <section className="mt-4">
            <h1 className="text-[22px] font-black leading-tight">
              Stay in the loop
            </h1>
            <p className="mt-3 max-w-[250px] text-[14px] font-semibold leading-[1.15] text-textSecondary">
              We&apos;ll remind you about checks, expiring documents and
              upcoming services
            </p>

            <label className="mt-7 block">
              <FieldLabel>WhatsApp number</FieldLabel>
              <AuthInput
                placeholder="e.g. +263 77 123 4567"
                {...register('whatsapp')}
              />
            </label>

            <section className="mt-8">
              <h2 className="text-[15px] font-black leading-none">
                Notifications
              </h2>
              <div className="mt-4 rounded-[16px] bg-surface px-4 py-2 shadow-[0_5px_16px_rgba(0,0,0,0.12)]">
                <NotificationRow
                  caption="In-app alerts"
                  enabled={pushEnabled}
                  icon="bell"
                  title="Push notifications"
                  onToggle={() => setPushEnabled((current) => !current)}
                />
                <NotificationRow
                  caption="Chat-based notifications"
                  enabled={whatsappEnabled}
                  icon="phone"
                  title="WhatsApp reminders"
                  onToggle={() => setWhatsappEnabled((current) => !current)}
                />
                <NotificationRow
                  caption="Notifications to your inbox"
                  enabled={emailEnabled}
                  icon="mail"
                  title="Email reminders"
                  onToggle={() => setEmailEnabled((current) => !current)}
                />
                <NotificationRow
                  caption="Pick your monthly alert date"
                  icon="calendar"
                  title="Select default reminder date"
                  trailing="chevron"
                />
              </div>
            </section>
          </section>
        ) : null}

        {currentStep === 4 ? (
          <section className="mt-8 text-center">
            <div className="mx-auto grid size-[68px] place-items-center rounded-[8px] bg-yellow-cta text-[32px] font-black text-surface shadow-yellow">
              {initials}
            </div>
            <h1 className="mt-8 text-[22px] font-black leading-tight">
              You&apos;re all set, {firstName}!
            </h1>
            <p className="mx-auto mt-5 max-w-[270px] text-[13px] font-semibold leading-[1.15] text-textSecondary">
              Here&apos;s a summary of what we&apos;ve set up for you. You can
              update any of this in your profile.
            </p>

            <section className="mt-10 rounded-[16px] bg-surface px-5 py-2 text-left shadow-[0_5px_16px_rgba(0,0,0,0.12)]">
              <SummaryRow label="Total vehicles" value="1" />
              <SummaryRow label="Vehicle" value={values.alias || '-'} />
              <SummaryRow label="Plate" value={values.registration || '-'} />
              <SummaryRow
                label="Mileage"
                value={values.mileage ? `${values.mileage} km` : '-'}
              />
              <SummaryRow
                label="Fuel / transmission"
                value={`${values.fuelType} / ${values.transmission}`}
              />
              <SummaryRow
                label="Reminders"
                value={enabledChannels.length ? enabledChannels.join(' + ') : 'None'}
              />
            </section>

            {submitError ? (
              <p className="mt-4 text-[12px] font-bold text-danger-text">
                {submitError}
              </p>
            ) : null}
          </section>
        ) : null}

        <div
          className={cn(
            'mt-auto grid grid-cols-[1fr_1fr] gap-3 pt-8',
            currentStep === 4 ? 'pt-10' : '',
          )}
        >
          {currentStep === 4 ? (
            <>
              <AuthSecondaryButton
                onClick={() => {
                  reset();
                  setWizardStep(1);
                }}
              >
                Add New Vehicle
              </AuthSecondaryButton>
              <AuthPrimaryButton
                disabled={finishMutation.isPending}
                type="submit"
              >
                {finishMutation.isPending ? 'Saving...' : 'Finish'}
              </AuthPrimaryButton>
            </>
          ) : (
            <>
              <AuthSecondaryButton onClick={goNext}>
                Skip for now
              </AuthSecondaryButton>
              <AuthPrimaryButton onClick={goNext}>Continue</AuthPrimaryButton>
            </>
          )}
        </div>
      </form>
    </SetupScreen>
  );
}
