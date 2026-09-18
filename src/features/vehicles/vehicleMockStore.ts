import { mockChecks, mockVehicles } from '../../shared/mockData';

import type {
  AddVehicleValues,
  ComplianceLogValues,
  TyreLogValues,
} from './schemas';
import type {
  CheckLogEntry,
  HealthCheck,
  TyrePressureReadings,
  Vehicle,
} from '../../shared/types/domain';

type VehicleState = {
  checkLogs: CheckLogEntry[];
  checks: HealthCheck[];
  userAddedVehicleIds: string[];
  vehicles: Vehicle[];
};

const vehicleStateKey = 'tyre-club-vehicle-state-v2';

const extraChecks: HealthCheck[] = [
  {
    id: 'chk-wheel-alignment',
    vehicleId: 'veh-001',
    category: 'service',
    title: 'Wheel Alignment & Balancing',
    dueLabel: 'Overdue',
    status: 'danger',
    lastLogged: '14 Feb 2026',
    nextDue: '9 May 2026',
    frequency: 'Monthly',
    detail: 'Alignment and balancing are overdue.',
    reminderEnabled: true,
  },
  {
    id: 'chk-suspension',
    vehicleId: 'veh-001',
    category: 'service',
    title: 'Suspension',
    dueLabel: 'Due soon',
    status: 'warning',
    lastLogged: '14 Feb 2026',
    nextDue: '12 May 2026',
    frequency: 'Monthly',
    detail: 'Suspension check is due soon.',
    reminderEnabled: true,
  },
  {
    id: 'chk-tyre-pressure',
    vehicleId: 'veh-001',
    category: 'service',
    title: 'Tyre Pressure',
    dueLabel: 'All good',
    status: 'good',
    lastLogged: '12 May 2025',
    nextDue: '12 Jun 2025',
    frequency: 'Monthly',
    detail:
      'To extend the life of your tyres and ensure your ride is safe, check tyre pressure monthly at a reputable fitment centre.',
    reminderEnabled: true,
  },
  {
    id: 'chk-engine-service',
    vehicleId: 'veh-001',
    category: 'service',
    title: 'Engine service',
    dueLabel: 'Overdue',
    status: 'danger',
    lastLogged: '14 Feb 2026',
    nextDue: '9 May 2026',
    frequency: 'Quarterly',
    detail: 'Engine service is overdue.',
    reminderEnabled: true,
  },
  {
    id: 'chk-wipers',
    vehicleId: 'veh-001',
    category: 'service',
    title: 'Wipers',
    dueLabel: 'Due soon',
    status: 'warning',
    lastLogged: '14 Feb 2026',
    nextDue: '12 May 2026',
    frequency: 'Quarterly',
    detail: 'Replace or inspect wipers before the next rainy period.',
    reminderEnabled: false,
  },
  {
    id: 'chk-battery',
    vehicleId: 'veh-001',
    category: 'service',
    title: 'Battery',
    dueLabel: 'All good',
    status: 'good',
    lastLogged: '14 Feb 2026',
    nextDue: '12 May 2026',
    frequency: 'Quarterly',
    detail: 'Battery health is within range.',
    reminderEnabled: false,
  },
  {
    id: 'chk-radio-licence',
    vehicleId: 'veh-001',
    category: 'compliance',
    title: 'Radio Licence',
    dueLabel: 'Expired',
    status: 'danger',
    lastLogged: '1 Jan 2026',
    nextDue: '1 Jan 2026',
    frequency: 'Yearly',
    detail: 'Radio licence has expired.',
    reminderEnabled: true,
  },
  {
    id: 'chk-car-insurance',
    vehicleId: 'veh-001',
    category: 'compliance',
    title: 'Car Insurance',
    dueLabel: 'Valid',
    status: 'good',
    lastLogged: '26 Jul 2025',
    nextDue: '26 Jul 2026',
    frequency: 'Yearly',
    detail: 'Insurance is valid.',
    reminderEnabled: true,
  },
  {
    id: 'chk-licence-disk',
    vehicleId: 'veh-001',
    category: 'compliance',
    title: 'Government License Disk',
    dueLabel: 'Valid',
    status: 'good',
    lastLogged: '17 Aug 2025',
    nextDue: '17 Aug 2026',
    frequency: 'Yearly',
    detail: 'Licence disk is valid.',
    reminderEnabled: true,
  },
];

const seedLogs: CheckLogEntry[] = [
  {
    id: 'log-tyre-001',
    vehicleId: 'veh-001',
    checkId: 'chk-tyre-pressure',
    kind: 'tyre',
    title: 'Check at Samora Machel',
    date: '12 May 2025',
    location: 'Tyre Club Samora Machel',
    pressureReadings: {
      frontLeft: 32,
      frontRight: 32,
      rearLeft: 32,
      rearRight: 32,
    },
    createdAt: '2025-05-12T08:00:00.000Z',
  },
  {
    id: 'log-tyre-002',
    vehicleId: 'veh-001',
    checkId: 'chk-tyre-pressure',
    kind: 'tyre',
    title: 'Check at Borrowdale',
    date: '10 Apr 2025',
    location: 'Tyre Club Borrowdale',
    pressureReadings: {
      frontLeft: 31,
      frontRight: 31,
      rearLeft: 31,
      rearRight: 31,
    },
    createdAt: '2025-04-10T08:00:00.000Z',
  },
  {
    id: 'log-compliance-001',
    vehicleId: 'veh-001',
    checkId: 'chk-car-insurance',
    kind: 'compliance',
    title: 'Insurance updated',
    date: '26 Jul 2025',
    complianceType: 'insurance',
    insurerName: 'NicozDiamond',
    coverType: 'Comprehensive',
    effectiveDate: '2025-07-26',
    expiryDate: '2026-07-26',
    createdAt: '2025-07-26T08:00:00.000Z',
  },
];

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function parseStoredState(value: string | null): VehicleState | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as VehicleState;
  } catch {
    return null;
  }
}

function seedState(): VehicleState {
  const vehicleChecks = [...extraChecks, ...mockChecks].filter(
    (check, index, checks) =>
      checks.findIndex((candidate) => candidate.id === check.id) === index,
  );

  return {
    checkLogs: seedLogs,
    checks: vehicleChecks,
    userAddedVehicleIds: [],
    vehicles: mockVehicles.map((vehicle) => ({
      ...vehicle,
      colour: vehicle.id === 'veh-001' ? 'White' : undefined,
      fuelType: vehicle.id === 'veh-002' ? 'Petrol' : 'Diesel',
      transmission: 'Automatic',
    })),
  };
}

function readState(): VehicleState {
  if (!canUseStorage()) {
    return seedState();
  }

  const stored = parseStoredState(window.localStorage.getItem(vehicleStateKey));

  if (stored) {
    return stored;
  }

  const seeded = seedState();
  writeState(seeded);

  return seeded;
}

function writeState(state: VehicleState) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(vehicleStateKey, JSON.stringify(state));
}

function normalizeNumber(value: string) {
  return Number(value.replace(/\s/g, ''));
}

function makeId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

function updateCheckAfterLog(check: HealthCheck, date: string): HealthCheck {
  return {
    ...check,
    dueLabel: check.category === 'compliance' ? 'Valid' : 'All good',
    lastLogged: date,
    status: 'good',
  };
}

export const vehicleMockStore = {
  addComplianceLog(
    vehicleId: string,
    checkId: string,
    values: ComplianceLogValues,
  ) {
    const state = readState();
    const check = state.checks.find((item) => item.id === checkId);
    const entry: CheckLogEntry = {
      id: makeId('log-compliance'),
      vehicleId,
      checkId,
      kind: 'compliance',
      title:
        values.type === 'insurance'
          ? 'Insurance updated'
          : `${values.coverType} updated`,
      date: values.effectiveDate,
      complianceType: values.type,
      insurerName: values.insurerName,
      coverType: values.coverType,
      effectiveDate: values.effectiveDate,
      expiryDate: values.expiryDate,
      notes: values.notes,
      createdAt: new Date().toISOString(),
    };

    writeState({
      ...state,
      checkLogs: [entry, ...state.checkLogs],
      checks: state.checks.map((item) =>
        item.id === checkId
          ? updateCheckAfterLog(item, values.effectiveDate)
          : item,
      ),
      vehicles: state.vehicles.map((vehicle) =>
        vehicle.id === vehicleId && check?.category === 'compliance'
          ? { ...vehicle, complianceDue: 'Valid' }
          : vehicle,
      ),
    });

    return entry;
  },
  addTyreLog(vehicleId: string, checkId: string, values: TyreLogValues) {
    const state = readState();
    const samePressure = normalizeNumber(values.samePressure ?? '');
    const pressureReadings: TyrePressureReadings = values.sameForAll
      ? {
          frontLeft: samePressure,
          frontRight: samePressure,
          rearLeft: samePressure,
          rearRight: samePressure,
        }
      : {
          frontLeft: normalizeNumber(values.frontLeft ?? ''),
          frontRight: normalizeNumber(values.frontRight ?? ''),
          rearLeft: normalizeNumber(values.rearLeft ?? ''),
          rearRight: normalizeNumber(values.rearRight ?? ''),
        };
    const entry: CheckLogEntry = {
      id: makeId('log-tyre'),
      vehicleId,
      checkId,
      kind: 'tyre',
      title: `Check at ${values.location}`,
      date: values.dateChecked,
      location: values.location,
      notes: values.notes,
      pressureReadings,
      createdAt: new Date().toISOString(),
    };

    writeState({
      ...state,
      checkLogs: [entry, ...state.checkLogs],
      checks: state.checks.map((item) =>
        item.id === checkId
          ? updateCheckAfterLog(item, values.dateChecked)
          : item,
      ),
    });

    return entry;
  },
  createVehicle(
    values: AddVehicleValues,
    extra?: { transmission?: 'Manual' | 'Automatic'; tyreSize?: string },
  ) {
    const state = readState();
    const vehicle: Vehicle = {
      id: makeId('veh'),
      name: `${values.make.trim()} ${values.model.trim()}`,
      make: values.make.trim(),
      model: values.model.trim(),
      year: normalizeNumber(values.year),
      registration: values.registration.trim().toUpperCase(),
      odometerKm: normalizeNumber(values.mileage),
      tyreSize: extra?.tyreSize?.trim() || '265/65 R17',
      colour: values.colour?.trim(),
      fuelType: values.fuelType,
      transmission: extra?.transmission ?? 'Automatic',
      status: 'good',
      nextService: 'Tyre pressure check in 4 weeks',
      complianceDue: 'Valid',
      checksDue: 0,
    };
    const checks = [
      ...state.checks,
      {
        id: makeId('chk-tyre-pressure'),
        vehicleId: vehicle.id,
        category: 'service',
        title: 'Tyre Pressure',
        dueLabel: 'Set reminder',
        status: 'neutral',
        lastLogged: 'Not logged yet',
        nextDue: 'Not set',
        frequency: 'Monthly',
        detail:
          'Log tyre pressure checks to keep reminders and history up to date.',
        reminderEnabled: false,
      } satisfies HealthCheck,
      {
        id: makeId('chk-car-insurance'),
        vehicleId: vehicle.id,
        category: 'compliance',
        title: 'Car Insurance',
        dueLabel: 'Add policy',
        status: 'neutral',
        lastLogged: 'Not logged yet',
        nextDue: 'Not set',
        frequency: 'Yearly',
        detail: 'Add insurance details and expiry date.',
        reminderEnabled: false,
      } satisfies HealthCheck,
    ];

    writeState({
      ...state,
      checks,
      userAddedVehicleIds: [vehicle.id, ...state.userAddedVehicleIds],
      vehicles: [vehicle, ...state.vehicles],
    });

    return vehicle;
  },
  deleteVehicle(vehicleId: string) {
    const state = readState();

    writeState({
      ...state,
      checkLogs: state.checkLogs.filter(
        (entry) => entry.vehicleId !== vehicleId,
      ),
      checks: state.checks.filter((check) => check.vehicleId !== vehicleId),
      userAddedVehicleIds: state.userAddedVehicleIds.filter(
        (id) => id !== vehicleId,
      ),
      vehicles: state.vehicles.filter((vehicle) => vehicle.id !== vehicleId),
    });
  },
  getCheck(checkId: string) {
    return readState().checks.find((check) => check.id === checkId) ?? null;
  },
  getVehicle(vehicleId: string) {
    return (
      readState().vehicles.find((vehicle) => vehicle.id === vehicleId) ?? null
    );
  },
  hasHomeVehicles() {
    return readState().userAddedVehicleIds.length > 0;
  },
  listAddedVehicles() {
    const state = readState();

    return state.vehicles.filter((vehicle) =>
      state.userAddedVehicleIds.includes(vehicle.id),
    );
  },
  listCheckLogs(checkId: string) {
    return readState().checkLogs.filter((entry) => entry.checkId === checkId);
  },
  listChecks(vehicleId: string) {
    return readState().checks.filter((check) => check.vehicleId === vehicleId);
  },
  listVehicles() {
    return readState().vehicles;
  },
  reset() {
    writeState(seedState());
  },
  updateVehicle(
    vehicleId: string,
    values: {
      make: string;
      model: string;
      year: number;
      registration: string;
      odometerKm: number;
      colour?: string;
    },
  ) {
    const state = readState();
    let updated: Vehicle | null = null;

    writeState({
      ...state,
      vehicles: state.vehicles.map((vehicle) => {
        if (vehicle.id !== vehicleId) {
          return vehicle;
        }

        updated = {
          ...vehicle,
          ...values,
          name: `${values.make} ${values.model}`,
        };

        return updated;
      }),
    });

    return updated;
  },
  setReminder(checkId: string, enabled: boolean) {
    const state = readState();

    writeState({
      ...state,
      checks: state.checks.map((check) =>
        check.id === checkId ? { ...check, reminderEnabled: enabled } : check,
      ),
    });
  },
};
