import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, ChevronRight, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { queryKeys } from '../../../shared/api/queryKeys';
import { ErrorState } from '../../../shared/components/primitives/ErrorState';
import { LoadingState } from '../../../shared/components/primitives/LoadingState';
import { Modal } from '../../../shared/components/primitives/Modal';
import {
  useTrips,
  useVehicle,
  useVehicleChecks,
} from '../../../shared/hooks/useAppData';
import { vehicleService } from '../../../shared/services/dataServices';
import {
  CircleDot,
  MiniStat,
  VehicleChrome,
  VehicleHeader,
  VehiclePanel,
  VehicleTabs,
} from '../components/VehicleScreenChrome';

import type {
  HealthCheck,
  Status,
  Trip,
  Vehicle,
} from '../../../shared/types/domain';

type VehicleSection = 'checks' | 'compliance' | 'trips' | 'reports';

const tabs: { label: string; value: VehicleSection }[] = [
  { label: 'Checks', value: 'checks' },
  { label: 'Compliance', value: 'compliance' },
  { label: 'Trips', value: 'trips' },
  { label: 'Reports', value: 'reports' },
];

function asSection(value: string | null): VehicleSection {
  if (
    value === 'checks' ||
    value === 'compliance' ||
    value === 'trips' ||
    value === 'reports'
  ) {
    return value;
  }

  return 'checks';
}

function formatDistance(value: number) {
  return value.toLocaleString('en-US').replaceAll(',', ' ');
}

function toneFromStatus(status: Status): 'danger' | 'good' | 'warning' {
  if (status === 'good') {
    return 'good';
  }

  if (status === 'danger') {
    return 'danger';
  }

  return 'warning';
}

function CheckItem({
  check,
  tab,
  vehicleId,
}: {
  check: HealthCheck;
  tab: VehicleSection;
  vehicleId: string;
}) {
  return (
    <Link
      className="flex items-start gap-2 border-b border-[#E5E5E5] py-3 last:border-b-0"
      state={{ tab }}
      to={`/vehicles/${vehicleId}/checks/${check.id}`}
    >
      <CircleDot tone={toneFromStatus(check.status)} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-bold leading-tight text-textPrimary">
          {check.title}
        </p>
        <p className="mt-1 text-[12px] font-medium leading-tight text-[#666666]">
          Last Check: {check.lastLogged}
        </p>
        <p className="text-[12px] font-medium leading-tight text-[#666666]">
          Next Check:{' '}
          <span className="font-bold text-textPrimary">
            {check.nextDue ?? check.dueLabel}
          </span>
        </p>
      </div>
      <ChevronRight
        aria-hidden
        className="mt-2 text-[#555555]"
        size={16}
        strokeWidth={2.2}
      />
    </Link>
  );
}

function ChecksView({
  checks,
  vehicleId,
}: {
  checks: HealthCheck[];
  vehicleId: string;
}) {
  const tyreChecks = checks.filter((check) =>
    /tyre|wheel|suspension/i.test(check.title),
  );
  const maintenanceChecks = checks.filter(
    (check) => !/tyre|wheel|suspension/i.test(check.title),
  );
  const groups = [
    { title: 'Tyres & Wheels', items: tyreChecks },
    { title: 'Vehicle Maintenance', items: maintenanceChecks },
  ].filter((group) => group.items.length > 0);

  return (
    <div className="grid gap-3">
      {groups.map((group) => (
        <VehiclePanel key={group.title} className="px-4 py-3">
          <h2 className="mb-1 text-[18px] font-bold leading-tight">
            {group.title}
          </h2>
          {group.items.map((check) => (
            <CheckItem
              key={check.id}
              check={check}
              tab="checks"
              vehicleId={vehicleId}
            />
          ))}
        </VehiclePanel>
      ))}
    </div>
  );
}

function ComplianceView({
  checks,
  vehicleId,
}: {
  checks: HealthCheck[];
  vehicleId: string;
}) {
  return (
    <VehiclePanel className="px-4 py-3">
      <h2 className="mb-2 text-[18px] font-bold leading-tight">Compliance</h2>
      {checks.map((check) => (
        <CheckItem
          key={check.id}
          check={check}
          tab="compliance"
          vehicleId={vehicleId}
        />
      ))}
    </VehiclePanel>
  );
}

function TripsView({ trips }: { trips: Trip[] }) {
  const totalDistance = trips.reduce((sum, trip) => sum + trip.distanceKm, 0);
  const totalFuel = trips.reduce((sum, trip) => sum + trip.estimatedCost, 0);
  const avgTrip = trips.length ? Math.round(totalDistance / trips.length) : 0;

  return (
    <div className="grid gap-4">
      <VehiclePanel className="p-3.5">
        <h2 className="mb-3 text-[18px] font-bold leading-tight">
          All trips summary
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <MiniStat label="Total trips" value={trips.length} />
          <MiniStat
            label="Total distance"
            value={`${formatDistance(totalDistance)} km`}
          />
          <MiniStat label="Total fuel" value={`$${totalFuel}`} />
          <MiniStat label="Avg trip" value={`${avgTrip} km`} />
        </div>
      </VehiclePanel>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[15px] font-bold leading-none">Recent trips</h2>
          <Link
            aria-label="Plan trip"
            className="grid size-[34px] place-items-center rounded-full bg-yellow-cta text-textPrimary shadow-yellow"
            to="/trips/plan"
          >
            <Plus size={22} strokeWidth={2.8} />
          </Link>
        </div>
        <VehiclePanel className="px-2.5 py-2">
          {trips.length > 0 ? (
            trips.slice(0, 5).map((trip) => (
              <Link
                key={trip.id}
                className="flex items-center gap-2 border-b border-[#E5E5E5] py-3 last:border-b-0"
                to={`/trips/${trip.id}`}
              >
                <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-[#6C6C6C] text-surface">
                  <ArrowRight size={18} strokeWidth={2.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold leading-tight">
                    {trip.title.replace(' to ', ' -> ')}
                  </p>
                  <p className="text-[12px] font-medium leading-tight text-[#666666]">
                    {trip.date} - ${trip.estimatedCost} fuel
                  </p>
                </div>
                <p className="text-right text-[12px] font-bold leading-tight">
                  {trip.distanceKm} km
                  <br />
                  <span className="font-medium text-[#666666]">
                    ${trip.actualCost ?? trip.estimatedCost} total
                  </span>
                </p>
              </Link>
            ))
          ) : (
            <p className="py-4 text-center text-[13px] font-medium text-[#666666]">
              No trips logged yet
            </p>
          )}
          <Link
            className="mt-2 flex items-center justify-center gap-1 text-[12px] font-medium text-[#263BFF]"
            to="/trips"
          >
            View all trips <ChevronRight size={10} />
          </Link>
        </VehiclePanel>
      </div>
    </div>
  );
}

function ReportsView({
  checks,
  trips,
}: {
  checks: HealthCheck[];
  trips: Trip[];
}) {
  const activeAlerts = checks.filter((check) => check.status !== 'good');
  const dangerCount = checks.filter(
    (check) => check.status === 'danger',
  ).length;
  const warningCount = checks.filter(
    (check) => check.status === 'warning',
  ).length;
  const score = Math.max(0, 100 - dangerCount * 25 - warningCount * 10);
  const distance = trips.reduce((sum, trip) => sum + trip.distanceKm, 0);

  return (
    <div className="grid gap-4">
      <VehiclePanel className="p-3">
        <p className="mb-2 text-[13px] font-bold leading-none">Health score</p>
        <div className="flex items-center gap-4">
          <div className="grid size-[46px] place-items-center rounded-full border-[3px] border-[#F04E4E] text-[15px] font-bold">
            {score}
          </div>
          <div>
            <p className="text-[15px] font-bold leading-none">
              {score >= 80 ? 'All good' : 'Needs attention'}
            </p>
            <p className="mt-1 text-[12px] font-medium leading-none">
              {dangerCount} items overdue - {warningCount} due soon
            </p>
          </div>
        </div>
      </VehiclePanel>

      <VehiclePanel className="px-3 py-3">
        <h2 className="mb-3 text-[18px] font-bold leading-none">
          Active alerts
        </h2>
        {activeAlerts.length > 0 ? (
          activeAlerts.map((check) => (
            <div
              key={check.id}
              className="flex gap-2 border-b border-[#E5E5E5] py-3 last:border-b-0"
            >
              <CircleDot tone={toneFromStatus(check.status)} />
              <div>
                <p className="text-[14px] font-bold leading-tight">
                  {check.title} &bull;{' '}
                  <span
                    className={
                      check.status === 'danger'
                        ? 'text-[#E22E2E]'
                        : 'text-[#EFA33A]'
                    }
                  >
                    {check.dueLabel}
                  </span>
                </p>
                <p className="mt-1 text-[12px] font-medium leading-tight text-[#666666]">
                  {check.nextDue ?? check.lastLogged}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="py-4 text-center text-[13px] font-medium text-[#666666]">
            No active alerts
          </p>
        )}
      </VehiclePanel>

      <VehiclePanel className="p-3">
        <h2 className="mb-2 text-[18px] font-bold leading-none">This month</h2>
        <div className="grid grid-cols-2 gap-2">
          <MiniStat label="Trips logged" value={trips.length} />
          <MiniStat label="Distance" value={`${formatDistance(distance)}km`} />
        </div>
      </VehiclePanel>
    </div>
  );
}

function DeleteVehicleDialog({
  isDeleting,
  isOpen,
  onClose,
  onConfirm,
  vehicle,
}: {
  isDeleting: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vehicle: Vehicle;
}) {
  return (
    <Modal isOpen={isOpen} title="Remove vehicle?" onClose={onClose}>
      <p className="text-[13px] font-medium leading-5 text-[#666666]">
        This removes {vehicle.name} and its mock check history from this device.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          className="h-11 rounded-[10px] border border-[#D7D7D7] bg-surface text-[14px] font-bold"
          type="button"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="h-11 rounded-[10px] bg-[#DF5656] text-[14px] font-bold text-textPrimary disabled:opacity-60"
          disabled={isDeleting}
          type="button"
          onClick={onConfirm}
        >
          Remove
        </button>
      </div>
    </Modal>
  );
}

export default function VehicleDetailPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const section = asSection(searchParams.get('tab'));
  const vehicleQuery = useVehicle(vehicleId);
  const checksQuery = useVehicleChecks(vehicleId);
  const tripsQuery = useTrips();
  const vehicleTrips = useMemo(
    () =>
      (tripsQuery.data ?? []).filter((trip) => trip.vehicleId === vehicleId),
    [tripsQuery.data, vehicleId],
  );
  const vehicle = vehicleQuery.data;
  const checks = checksQuery.data ?? [];
  const serviceChecks = checks.filter((check) => check.category === 'service');
  const complianceChecks = checks.filter(
    (check) => check.category === 'compliance',
  );
  const deleteVehicle = useMutation({
    mutationFn: () => vehicleService.delete(vehicleId ?? ''),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });
      navigate('/vehicles');
    },
  });

  if (vehicleQuery.isLoading) {
    return (
      <VehicleChrome>
        <LoadingState label="Loading vehicle" />
      </VehicleChrome>
    );
  }

  if (vehicleQuery.error || !vehicle || !vehicleId) {
    return (
      <VehicleChrome>
        <ErrorState message="Vehicle could not be found." />
      </VehicleChrome>
    );
  }

  return (
    <VehicleChrome>
      <VehicleHeader vehicle={vehicle} onRemove={() => setIsDeleteOpen(true)} />
      <VehicleTabs
        active={section}
        items={tabs}
        onChange={(value) => setSearchParams({ tab: value })}
      />

      {section === 'checks' ? (
        <ChecksView checks={serviceChecks} vehicleId={vehicle.id} />
      ) : null}
      {section === 'compliance' ? (
        <ComplianceView checks={complianceChecks} vehicleId={vehicle.id} />
      ) : null}
      {section === 'trips' ? <TripsView trips={vehicleTrips} /> : null}
      {section === 'reports' ? (
        <ReportsView checks={checks} trips={vehicleTrips} />
      ) : null}

      <DeleteVehicleDialog
        isDeleting={deleteVehicle.isPending}
        isOpen={isDeleteOpen}
        vehicle={vehicle}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteVehicle.mutate()}
      />
    </VehicleChrome>
  );
}
