import { vehicleMockStore } from '../../features/vehicles/vehicleMockStore';
import { apiRequest, isMockApi, mockDelay } from '../api/apiClient';
import { endpoints } from '../api/endpoints';
import {
  mockBranches,
  mockDeals,
  mockNotificationPreferences,
  mockProducts,
  mockTrips,
} from '../mockData';

import type { AddVehicleValues } from '../../features/vehicles/schemas';
import type {
  ComplianceLogValues,
  TyreLogValues,
} from '../../features/vehicles/schemas';
import type {
  Branch,
  CheckLogEntry,
  Deal,
  HealthCheck,
  NotificationPreference,
  Product,
  Trip,
  Vehicle,
} from '../types/domain';

function normalizeNumber(value: string) {
  return Number(value.replace(/\s/g, ''));
}

export type CreateVehicleExtras = {
  transmission?: 'Manual' | 'Automatic';
  tyreSize?: string;
};

function toCreateVehiclePayload(
  input: AddVehicleValues,
  extra?: CreateVehicleExtras,
) {
  return {
    make: input.make.trim(),
    model: input.model.trim(),
    year: normalizeNumber(input.year),
    registration: input.registration.trim().toUpperCase(),
    odometerKm: normalizeNumber(input.mileage),
    colour: input.colour?.trim() || undefined,
    fuelType: input.fuelType,
    transmission: extra?.transmission,
    tyreSize: extra?.tyreSize?.trim() || undefined,
  };
}

export type UpdateVehicleInput = {
  make: string;
  model: string;
  year: number;
  registration: string;
  odometerKm: number;
  colour?: string;
};

export const vehicleService = {
  checks: (vehicleId: string) => {
    if (isMockApi) {
      return mockDelay(vehicleMockStore.listChecks(vehicleId));
    }

    return apiRequest<HealthCheck[]>({
      method: 'GET',
      url: endpoints.vehicleChecks(vehicleId),
    });
  },
  create: (input: AddVehicleValues, extra?: CreateVehicleExtras) => {
    if (isMockApi) {
      return mockDelay(vehicleMockStore.createVehicle(input, extra));
    }

    return apiRequest<Vehicle>({
      method: 'POST',
      url: endpoints.vehicles,
      data: toCreateVehiclePayload(input, extra),
    });
  },
  update: (id: string, input: UpdateVehicleInput) => {
    if (isMockApi) {
      return mockDelay(vehicleMockStore.updateVehicle(id, input));
    }

    return apiRequest<Vehicle>({
      method: 'PATCH',
      url: `${endpoints.vehicles}/${id}`,
      data: input,
    });
  },
  delete: (id: string) => {
    if (isMockApi) {
      vehicleMockStore.deleteVehicle(id);

      return mockDelay({ ok: true } as const);
    }

    return apiRequest<{ ok: true }>({
      method: 'DELETE',
      url: `${endpoints.vehicles}/${id}`,
    });
  },
  get: (id: string) => {
    if (isMockApi) {
      return mockDelay(vehicleMockStore.getVehicle(id));
    }

    return apiRequest<Vehicle>({
      method: 'GET',
      url: `${endpoints.vehicles}/${id}`,
    });
  },
  list: () => {
    if (isMockApi) {
      return mockDelay(vehicleMockStore.listVehicles());
    }

    return apiRequest<Vehicle[]>({ method: 'GET', url: endpoints.vehicles });
  },
};

export const checkService = {
  logs: (checkId: string) => {
    if (isMockApi) {
      return mockDelay(vehicleMockStore.listCheckLogs(checkId));
    }

    return apiRequest<CheckLogEntry[]>({
      method: 'GET',
      url: endpoints.checkLogs(checkId),
    });
  },
  addTyreLog: (vehicleId: string, checkId: string, values: TyreLogValues) => {
    if (isMockApi) {
      return mockDelay(
        vehicleMockStore.addTyreLog(vehicleId, checkId, values),
      );
    }

    const samePressure = normalizeNumber(values.samePressure ?? '');
    const pressureReadings = values.sameForAll
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

    return apiRequest<CheckLogEntry>({
      method: 'POST',
      url: endpoints.checkLogs(checkId),
      data: {
        kind: 'tyre',
        dateChecked: values.dateChecked,
        location: values.location,
        notes: values.notes || undefined,
        pressureReadings,
      },
    });
  },
  addComplianceLog: (
    vehicleId: string,
    checkId: string,
    values: ComplianceLogValues,
  ) => {
    if (isMockApi) {
      return mockDelay(
        vehicleMockStore.addComplianceLog(vehicleId, checkId, values),
      );
    }

    return apiRequest<CheckLogEntry>({
      method: 'POST',
      url: endpoints.checkLogs(checkId),
      data: {
        kind: 'compliance',
        type: values.type,
        insurerName: values.insurerName || undefined,
        coverType: values.coverType,
        effectiveDate: values.effectiveDate,
        expiryDate: values.expiryDate,
        notes: values.notes || undefined,
      },
    });
  },
  setReminder: (checkId: string, enabled: boolean) => {
    if (isMockApi) {
      vehicleMockStore.setReminder(checkId, enabled);

      return mockDelay(
        vehicleMockStore.getCheck(checkId) as HealthCheck,
      );
    }

    return apiRequest<HealthCheck>({
      method: 'PATCH',
      url: endpoints.checkReminder(checkId),
      data: { enabled },
    });
  },
};

export const healthService = {
  list: () => {
    if (isMockApi) {
      return mockDelay(
        vehicleMockStore
          .listVehicles()
          .flatMap((vehicle) => vehicleMockStore.listChecks(vehicle.id)),
      );
    }

    return apiRequest<HealthCheck[]>({ method: 'GET', url: endpoints.checks });
  },
};

export const tripService = {
  list: () => {
    if (isMockApi) {
      return mockDelay(mockTrips);
    }

    return apiRequest<Trip[]>({ method: 'GET', url: endpoints.trips });
  },
  get: (id: string) => {
    if (isMockApi) {
      return mockDelay(mockTrips.find((trip) => trip.id === id) ?? null);
    }

    return apiRequest<Trip>({ method: 'GET', url: endpoints.trip(id) });
  },
  create: (input: {
    vehicleId: string;
    title: string;
    route: string;
    date: string;
    distanceKm?: number;
    estimatedCost?: number;
    startMileageKm?: number;
  }) => {
    if (isMockApi) {
      return mockDelay({
        id: `trip-${Date.now()}`,
        vehicleId: input.vehicleId,
        title: input.title,
        route: input.route,
        date: input.date,
        status: 'upcoming' as const,
        estimatedCost: input.estimatedCost ?? 0,
        distanceKm: input.distanceKm ?? 0,
        startMileageKm: input.startMileageKm,
      });
    }

    return apiRequest<Trip>({
      method: 'POST',
      url: endpoints.trips,
      data: input,
    });
  },
  update: (
    id: string,
    input: {
      status?: Trip['status'];
      actualCost?: number;
      title?: string;
      route?: string;
      date?: string;
      notes?: string;
    },
  ) => {
    if (isMockApi) {
      return mockDelay(mockTrips.find((trip) => trip.id === id) ?? null);
    }

    return apiRequest<Trip>({
      method: 'PATCH',
      url: endpoints.trip(id),
      data: input,
    });
  },
  delete: (id: string) => {
    if (isMockApi) {
      return mockDelay({ ok: true } as const);
    }

    return apiRequest<{ ok: true }>({
      method: 'DELETE',
      url: endpoints.trip(id),
    });
  },
};

export const dealService = {
  list: () => {
    if (isMockApi) {
      return mockDelay(mockDeals);
    }

    return apiRequest<Deal[]>({ method: 'GET', url: endpoints.deals });
  },
};

export const branchService = {
  list: () => {
    if (isMockApi) {
      return mockDelay(mockBranches);
    }

    return apiRequest<Branch[]>({ method: 'GET', url: endpoints.branches });
  },
};

export const productService = {
  list: () => {
    if (isMockApi) {
      return mockDelay(mockProducts);
    }

    return apiRequest<Product[]>({ method: 'GET', url: endpoints.products });
  },
};

export const profileService = {
  notificationPreferences: () => {
    if (isMockApi) {
      return mockDelay(mockNotificationPreferences);
    }

    return apiRequest<NotificationPreference[]>({
      method: 'GET',
      url: endpoints.notificationPreferences,
    });
  },
  setNotificationPreference: (key: string, enabled: boolean) => {
    if (isMockApi) {
      return mockDelay({ id: key, label: key, enabled });
    }

    return apiRequest<NotificationPreference>({
      method: 'PATCH',
      url: endpoints.notificationPreference(key),
      data: { enabled },
    });
  },
};
