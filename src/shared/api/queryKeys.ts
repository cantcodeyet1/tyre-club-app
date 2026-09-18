export const queryKeys = {
  currentUser: ['auth', 'me'] as const,
  vehicles: ['vehicles'] as const,
  vehicle: (id: string) => ['vehicles', id] as const,
  checks: ['checks'] as const,
  vehicleChecks: (vehicleId: string) =>
    ['vehicles', vehicleId, 'checks'] as const,
  checkLogs: (checkId: string) => ['checks', checkId, 'logs'] as const,
  trips: ['trips'] as const,
  trip: (id: string) => ['trips', id] as const,
  deals: ['deals'] as const,
  branches: ['branches'] as const,
  products: ['products'] as const,
  notificationPreferences: ['profile', 'notifications'] as const,
};
