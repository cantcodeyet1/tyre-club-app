import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../api/queryKeys';
import {
  branchService,
  checkService,
  dealService,
  healthService,
  productService,
  profileService,
  tripService,
  vehicleService,
} from '../services/dataServices';

export function useVehicles() {
  return useQuery({
    queryKey: queryKeys.vehicles,
    queryFn: vehicleService.list,
  });
}

export function useVehicle(id?: string) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: id ? queryKeys.vehicle(id) : ['vehicles', 'missing'],
    queryFn: () => vehicleService.get(id ?? ''),
  });
}

export function useVehicleChecks(vehicleId?: string) {
  return useQuery({
    enabled: Boolean(vehicleId),
    queryKey: vehicleId
      ? queryKeys.vehicleChecks(vehicleId)
      : ['checks', 'missing'],
    queryFn: () => vehicleService.checks(vehicleId ?? ''),
  });
}

export function useCheckLogs(checkId?: string) {
  return useQuery({
    enabled: Boolean(checkId),
    queryKey: checkId
      ? queryKeys.checkLogs(checkId)
      : ['checks', 'missing', 'logs'],
    queryFn: () => checkService.logs(checkId ?? ''),
  });
}

export function useChecks() {
  return useQuery({ queryKey: queryKeys.checks, queryFn: healthService.list });
}

export function useTrips() {
  return useQuery({ queryKey: queryKeys.trips, queryFn: tripService.list });
}

export function useTrip(id?: string) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: id ? queryKeys.trip(id) : ['trips', 'missing'],
    queryFn: () => tripService.get(id ?? ''),
  });
}

export function useDeals() {
  return useQuery({ queryKey: queryKeys.deals, queryFn: dealService.list });
}

export function useBranches() {
  return useQuery({
    queryKey: queryKeys.branches,
    queryFn: branchService.list,
  });
}

export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: productService.list });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['profile', 'notifications'],
    queryFn: profileService.notificationPreferences,
  });
}
