import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Check, ChevronLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { queryKeys } from '../../../shared/api/queryKeys';
import { ErrorState } from '../../../shared/components/primitives/ErrorState';
import { Input } from '../../../shared/components/primitives/Input';
import { LoadingState } from '../../../shared/components/primitives/LoadingState';
import { Select } from '../../../shared/components/primitives/Select';
import { Textarea } from '../../../shared/components/primitives/Textarea';
import {
  useCheckLogs,
  useVehicle,
  useVehicleChecks,
} from '../../../shared/hooks/useAppData';
import { checkService } from '../../../shared/services/dataServices';
import { cn } from '../../../shared/utils/cn';
import {
  MiniStat,
  VehicleChrome,
  VehiclePanel,
} from '../components/VehicleScreenChrome';
import {
  complianceLogSchema,
  tyreLogSchema,
  type ComplianceLogValues,
  type TyreLogValues,
} from '../schemas';

import type {
  CheckLogEntry,
  HealthCheck,
  Vehicle,
} from '../../../shared/types/domain';
import type { QueryClient } from '@tanstack/react-query';
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
    <label className="grid gap-1.5 text-[13px] font-bold text-[#888888]">
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

function SheetFrame({
  children,
  isOpen,
  onClose,
}: {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex animate-[fade-in_150ms_ease-out] items-end justify-center bg-black/25"
      onClick={onClose}
    >
      <section
        aria-modal="true"
        className="max-h-[619px] w-full max-w-[393px] animate-[sheet-up_200ms_ease-out] overflow-y-auto rounded-t-[18px] bg-surface px-[24px] pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-8 shadow-phone"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-6 h-[7px] w-[103px] rounded-full bg-[#D9D9D9]" />
        {children}
      </section>
    </div>
  );
}

function invalidateCheckQueries(
  queryClient: QueryClient,
  vehicleId: string,
  checkId?: string,
) {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.vehicleChecks(vehicleId),
  });
  void queryClient.invalidateQueries({ queryKey: queryKeys.checks });

  if (checkId) {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.checkLogs(checkId),
    });
  }
}

function TyreLogSheet({
  check,
  isOpen,
  onClose,
  onSaved,
  vehicle,
}: {
  check: HealthCheck;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  vehicle: Vehicle;
}) {
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    watch,
  } = useForm<TyreLogValues>({
    defaultValues: {
      dateChecked: '2026-06-12',
      frontLeft: '',
      frontRight: '',
      location: '',
      notes: '',
      rearLeft: '',
      rearRight: '',
      sameForAll: true,
      samePressure: '',
    },
    mode: 'onChange',
    resolver: zodResolver(tyreLogSchema),
  });
  const sameForAll = watch('sameForAll');
  const addLog = useMutation({
    mutationFn: (values: TyreLogValues) =>
      checkService.addTyreLog(vehicle.id, check.id, values),
    onSuccess: () => {
      onSaved();
      onClose();
    },
  });

  const onSubmit = (values: TyreLogValues) => {
    addLog.mutate(values);
  };

  return (
    <SheetFrame isOpen={isOpen} onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h2 className="text-[18px] font-bold leading-none">Log new entry</h2>
          <p className="mt-3 text-[12px] font-medium leading-none text-[#888888]">
            {check.title} &bull; {vehicle.name}
          </p>
        </div>

        <Field error={errors.dateChecked?.message} label="Date checked">
          <span className="relative block">
            <Input
              invalid={Boolean(errors.dateChecked)}
              type="date"
              {...register('dateChecked')}
            />
            <Calendar
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-textPrimary"
              size={18}
              strokeWidth={2.4}
            />
          </span>
        </Field>

        <Field
          error={errors.location?.message}
          label="Location / Fitment centre"
        >
          <Input
            invalid={Boolean(errors.location)}
            placeholder="e.g. Tyre Club Samora Machel"
            {...register('location')}
          />
        </Field>

        <fieldset className="grid gap-2">
          <legend className="mb-1 text-[13px] font-bold text-[#888888]">
            Pressure readings (PSI)
          </legend>
          <label className="flex min-h-[44px] items-center justify-between rounded-[10px] border border-[#E5E5E5] px-3">
            <span>
              <span className="block text-[13px] font-bold leading-none">
                Same for all 4 tyres
              </span>
              <span className="mt-1 block text-[12px] font-medium leading-none text-[#777777]">
                Enter one value for all positions
              </span>
            </span>
            <input
              className="size-4 accent-primary"
              type="checkbox"
              {...register('sameForAll')}
            />
          </label>

          {sameForAll ? (
            <Field error={errors.samePressure?.message} label="PSI reading">
              <Input
                inputMode="numeric"
                invalid={Boolean(errors.samePressure)}
                placeholder="PSI reading"
                {...register('samePressure')}
              />
            </Field>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Field error={errors.frontLeft?.message} label="Front left">
                <Input
                  inputMode="numeric"
                  invalid={Boolean(errors.frontLeft)}
                  placeholder="Front left"
                  {...register('frontLeft')}
                />
              </Field>
              <Field error={errors.frontRight?.message} label="Front right">
                <Input
                  inputMode="numeric"
                  invalid={Boolean(errors.frontRight)}
                  placeholder="Front right"
                  {...register('frontRight')}
                />
              </Field>
              <Field error={errors.rearLeft?.message} label="Rear left">
                <Input
                  inputMode="numeric"
                  invalid={Boolean(errors.rearLeft)}
                  placeholder="Rear left"
                  {...register('rearLeft')}
                />
              </Field>
              <Field error={errors.rearRight?.message} label="Rear right">
                <Input
                  inputMode="numeric"
                  invalid={Boolean(errors.rearRight)}
                  placeholder="Rear right"
                  {...register('rearRight')}
                />
              </Field>
            </div>
          )}
        </fieldset>

        <Field error={errors.notes?.message} label="Notes (optional)">
          <Textarea
            className="min-h-[58px]"
            placeholder="Any observations..."
            {...register('notes')}
          />
        </Field>

        <button
          className="h-[42px] rounded-[10px] bg-yellow-cta text-[15px] font-semibold text-textPrimary disabled:opacity-60"
          disabled={!isValid || addLog.isPending}
          type="submit"
        >
          {addLog.isPending ? 'Saving...' : 'Save entry'}
        </button>
      </form>
    </SheetFrame>
  );
}

function ComplianceLogSheet({
  check,
  isOpen,
  onClose,
  onSaved,
  vehicle,
}: {
  check: HealthCheck;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  vehicle: Vehicle;
}) {
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    watch,
  } = useForm<ComplianceLogValues>({
    defaultValues: {
      coverType: '',
      effectiveDate: '',
      expiryDate: '',
      insurerName: '',
      notes: '',
      type: check.title.toLowerCase().includes('insurance')
        ? 'insurance'
        : 'licence',
    },
    mode: 'onChange',
    resolver: zodResolver(complianceLogSchema),
  });
  const type = watch('type');
  const addLog = useMutation({
    mutationFn: (values: ComplianceLogValues) =>
      checkService.addComplianceLog(vehicle.id, check.id, values),
    onSuccess: () => {
      onSaved();
      onClose();
    },
  });

  const onSubmit = (values: ComplianceLogValues) => {
    addLog.mutate(values);
  };

  return (
    <SheetFrame isOpen={isOpen} onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h2 className="text-[18px] font-bold leading-none">Log new entry</h2>
          <p className="mt-3 text-[12px] font-medium leading-none text-[#888888]">
            {check.title} &bull; {vehicle.name}
          </p>
        </div>

        <Field error={errors.type?.message} label="Type">
          <Select invalid={Boolean(errors.type)} {...register('type')}>
            <option value="insurance">Insurance</option>
            <option value="licence">Licence</option>
            <option value="radio">Radio licence</option>
            <option value="other">Other</option>
          </Select>
        </Field>

        {type === 'insurance' ? (
          <Field error={errors.insurerName?.message} label="Insurer name">
            <Input
              invalid={Boolean(errors.insurerName)}
              placeholder="e.g. NicozDiamond"
              {...register('insurerName')}
            />
          </Field>
        ) : null}

        <Field error={errors.coverType?.message} label="Cover type">
          <Input
            invalid={Boolean(errors.coverType)}
            placeholder="e.g. Comprehensive"
            {...register('coverType')}
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field error={errors.effectiveDate?.message} label="Effective date">
            <Input
              invalid={Boolean(errors.effectiveDate)}
              type="date"
              {...register('effectiveDate')}
            />
          </Field>
          <Field error={errors.expiryDate?.message} label="Expiry date">
            <Input
              invalid={Boolean(errors.expiryDate)}
              type="date"
              {...register('expiryDate')}
            />
          </Field>
        </div>

        <Field error={errors.notes?.message} label="Notes (optional)">
          <Textarea
            className="min-h-[58px]"
            placeholder="Any observations..."
            {...register('notes')}
          />
        </Field>

        <button
          className="h-[42px] rounded-[10px] bg-yellow-cta text-[15px] font-semibold text-textPrimary disabled:opacity-60"
          disabled={!isValid || addLog.isPending}
          type="submit"
        >
          {addLog.isPending ? 'Saving...' : 'Save entry'}
        </button>
      </form>
    </SheetFrame>
  );
}

function logDetail(entry: CheckLogEntry) {
  if (entry.kind === 'tyre' && entry.pressureReadings) {
    const values = Object.values(entry.pressureReadings);
    const same = values.every((value) => value === values[0]);

    return same ? `${entry.date} - All 4 tyres` : `${entry.date} - Split PSI`;
  }

  if (entry.kind === 'compliance') {
    const policyDetails = [entry.insurerName, entry.coverType]
      .filter(Boolean)
      .join(' - ');

    return policyDetails
      ? `${policyDetails} - expires ${entry.expiryDate}`
      : entry.expiryDate
        ? `Expires ${entry.expiryDate}`
        : entry.date;
  }

  return entry.expiryDate ? `Expires ${entry.expiryDate}` : entry.date;
}

export default function CheckDetailPage() {
  const { checkId, vehicleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [version, setVersion] = useState(0);
  const vehicleQuery = useVehicle(vehicleId);
  const checksQuery = useVehicleChecks(vehicleId);
  const check = (checksQuery.data ?? []).find((item) => item.id === checkId);
  const vehicle = vehicleQuery.data;
  const logsQuery = useCheckLogs(check?.id);
  const logs = logsQuery.data ?? [];
  const isCompliance = check?.category === 'compliance';
  const toggleReminderMutation = useMutation({
    mutationFn: () => checkService.setReminder(check!.id, !check!.reminderEnabled),
    onSuccess: () => {
      invalidateCheckQueries(queryClient, vehicle!.id, check!.id);
      setVersion((current) => current + 1);
    },
  });

  if (checksQuery.isLoading || vehicleQuery.isLoading) {
    return (
      <VehicleChrome>
        <LoadingState label="Loading check" />
      </VehicleChrome>
    );
  }

  if (!check || !vehicle || !vehicleId) {
    return (
      <VehicleChrome>
        <ErrorState message="Check could not be found." />
      </VehicleChrome>
    );
  }

  const fromTab =
    typeof location.state === 'object' &&
    location.state &&
    'tab' in location.state
      ? String(location.state.tab)
      : isCompliance
        ? 'compliance'
        : 'checks';
  const toggleReminder = () => {
    toggleReminderMutation.mutate();
  };
  const onSaved = () => {
    invalidateCheckQueries(queryClient, vehicle.id, check.id);
    setVersion((current) => current + 1);
  };

  return (
    <VehicleChrome>
      <div className="pt-[25px]" data-version={version}>
        <VehiclePanel className="p-3">
          <div className="mb-4 flex items-center gap-2">
            <button
              aria-label="Back to vehicle"
              className="grid size-[22px] place-items-center rounded-full bg-yellow-cta"
              type="button"
              onClick={() => navigate(`/vehicles/${vehicle.id}?tab=${fromTab}`)}
            >
              <ChevronLeft size={16} strokeWidth={2.8} />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-[18px] font-bold leading-none">
                {check.title}
              </h1>
              <p className="mt-1 text-[13px] font-medium uppercase leading-none text-[#7A7A7A]">
                {vehicle.name} &bull; {vehicle.registration || 'No plate'}
              </p>
            </div>
            <span
              className={cn(
                'ml-auto rounded-full px-3 py-1 text-[12px] font-bold',
                check.status === 'danger' && 'bg-[#FFDADA]',
                check.status === 'warning' && 'bg-[#FFD99B]',
                check.status !== 'danger' &&
                  check.status !== 'warning' &&
                  'bg-[#B9F7A2]',
              )}
            >
              {check.dueLabel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <MiniStat label="Last checked" value={check.lastLogged} />
            <MiniStat label="Next due" value={check.nextDue ?? 'Not set'} />
            <MiniStat label="Frequency" value={check.frequency ?? 'Monthly'} />
            <MiniStat label="Total checks" value={`${logs.length} logged`} />
          </div>

          <p className="mt-4 border-t border-[#E6E6E6] pt-3 text-[13px] font-medium leading-tight text-[#555555]">
            {check.detail}
          </p>
        </VehiclePanel>

        <VehiclePanel className="mt-4 flex items-center justify-between px-3 py-3">
          <div>
            <h2 className="text-[18px] font-bold leading-none">Reminder</h2>
            <p className="mt-3 text-[14px] font-bold leading-none">
              {check.frequency ?? 'Monthly'} reminder
            </p>
            <p className="mt-1 text-[12px] font-medium leading-none">
              WhatsApp + push notification
            </p>
          </div>
          <button
            aria-pressed={Boolean(check.reminderEnabled)}
            className={cn(
              'relative h-[22px] w-[42px] rounded-full transition-colors duration-200 ease-out',
              check.reminderEnabled
                ? 'bg-yellow-cta shadow-yellow'
                : 'bg-[#B8B8B8]',
            )}
            type="button"
            onClick={toggleReminder}
          >
            <span
              className={cn(
                'absolute left-[2px] top-[2px] size-[18px] rounded-full bg-textPrimary transition-transform duration-200 ease-out',
                check.reminderEnabled ? 'translate-x-[20px]' : 'translate-x-0',
              )}
            />
          </button>
        </VehiclePanel>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-[18px] font-bold leading-none">Log history</h2>
            <button
              aria-label="Log entry"
              className="grid size-[34px] place-items-center rounded-full bg-yellow-cta shadow-yellow"
              type="button"
              onClick={() => setIsSheetOpen(true)}
            >
              <Plus size={22} strokeWidth={2.8} />
            </button>
          </div>

          <VehiclePanel className="px-2.5 py-1.5">
            {logs.length > 0 ? (
              logs.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-2 border-b border-[#E5E5E5] py-3 last:border-b-0"
                >
                  <span className="grid size-[30px] shrink-0 place-items-center rounded-[9px] border border-[#65D845] bg-[#B9F7A2]">
                    <Check size={18} strokeWidth={2.4} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold leading-tight">
                      {entry.title}
                    </p>
                    <p className="text-[12px] font-medium leading-tight text-[#666666]">
                      {logDetail(entry)}
                    </p>
                  </div>
                  <span className="text-[12px] font-medium text-[#666666]">
                    Logged
                  </span>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-[13px] font-medium text-[#666666]">
                No entries yet
              </p>
            )}
          </VehiclePanel>
        </div>
      </div>

      {isCompliance ? (
        <ComplianceLogSheet
          check={check}
          isOpen={isSheetOpen}
          vehicle={vehicle}
          onClose={() => setIsSheetOpen(false)}
          onSaved={onSaved}
        />
      ) : (
        <TyreLogSheet
          check={check}
          isOpen={isSheetOpen}
          vehicle={vehicle}
          onClose={() => setIsSheetOpen(false)}
          onSaved={onSaved}
        />
      )}
    </VehicleChrome>
  );
}
