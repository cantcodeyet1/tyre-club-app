import type {
  CheckLogEntry as PrismaCheckLogEntry,
  Deal as PrismaDeal,
  Branch as PrismaBranch,
  HealthCheck as PrismaHealthCheck,
  NotificationPreference as PrismaNotificationPreference,
  Product as PrismaProduct,
  Trip as PrismaTrip,
  User as PrismaUser,
  Vehicle as PrismaVehicle,
} from '@prisma/client';

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
});

export function toUserDto(user: PrismaUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl ?? undefined,
    membershipNumber: user.membershipNumber,
    memberSince: monthFormatter.format(user.memberSince),
    phone: user.phone,
  };
}

export function toVehicleDto(vehicle: PrismaVehicle) {
  return {
    id: vehicle.id,
    name: vehicle.name,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    registration: vehicle.registration ?? undefined,
    odometerKm: vehicle.odometerKm,
    tyreSize: vehicle.tyreSize,
    colour: vehicle.colour ?? undefined,
    photoUrl: vehicle.photoUrl ?? undefined,
    fuelType: (vehicle.fuelType ?? undefined) as
      | 'Petrol'
      | 'Diesel'
      | 'Electric'
      | 'Hybrid'
      | undefined,
    transmission: (vehicle.transmission ?? undefined) as
      | 'Manual'
      | 'Automatic'
      | undefined,
    status: vehicle.status as 'good' | 'warning' | 'danger' | 'neutral',
    nextService: vehicle.nextService,
    complianceDue: vehicle.complianceDue,
    checksDue: vehicle.checksDue,
  };
}

export function toHealthCheckDto(check: PrismaHealthCheck) {
  return {
    id: check.id,
    vehicleId: check.vehicleId,
    category: check.category as 'compliance' | 'service' | 'reports',
    title: check.title,
    dueLabel: check.dueLabel,
    status: check.status as 'good' | 'warning' | 'danger' | 'neutral',
    lastLogged: check.lastLogged,
    detail: check.detail,
    frequency: check.frequency ?? undefined,
    nextDue: check.nextDue ?? undefined,
    reminderEnabled: check.reminderEnabled,
  };
}

export function toCheckLogEntryDto(entry: PrismaCheckLogEntry) {
  const hasPressureReading =
    entry.frontLeft !== null &&
    entry.frontRight !== null &&
    entry.rearLeft !== null &&
    entry.rearRight !== null;

  return {
    id: entry.id,
    vehicleId: entry.vehicleId,
    checkId: entry.checkId,
    kind: entry.kind as 'tyre' | 'compliance',
    title: entry.title,
    date: entry.date,
    location: entry.location ?? undefined,
    notes: entry.notes ?? undefined,
    pressureReadings: hasPressureReading
      ? {
          frontLeft: entry.frontLeft as number,
          frontRight: entry.frontRight as number,
          rearLeft: entry.rearLeft as number,
          rearRight: entry.rearRight as number,
        }
      : undefined,
    complianceType: (entry.complianceType ?? undefined) as
      | 'insurance'
      | 'licence'
      | 'radio'
      | 'other'
      | undefined,
    insurerName: entry.insurerName ?? undefined,
    coverType: entry.coverType ?? undefined,
    effectiveDate: entry.effectiveDate ?? undefined,
    expiryDate: entry.expiryDate ?? undefined,
    createdAt: entry.createdAt.toISOString(),
  };
}

export function toTripDto(trip: PrismaTrip) {
  return {
    id: trip.id,
    vehicleId: trip.vehicleId,
    title: trip.title,
    route: trip.route,
    date: trip.date,
    status: trip.status as 'upcoming' | 'active' | 'past',
    estimatedCost: trip.estimatedCost,
    actualCost: trip.actualCost ?? undefined,
    distanceKm: trip.distanceKm,
    startMileageKm: trip.startMileageKm ?? undefined,
    notes: trip.notes ?? undefined,
    createdAt: trip.createdAt.toISOString(),
  };
}

export function toDealDto(deal: PrismaDeal) {
  return {
    id: deal.id,
    title: deal.title,
    description: deal.description,
    tag: deal.tag,
    route: deal.route,
  };
}

export function toBranchDto(branch: PrismaBranch) {
  return {
    id: branch.id,
    name: branch.name,
    address: branch.address,
    hours: branch.hours,
    phone: branch.phone,
  };
}

export function toProductDto(product: PrismaProduct) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
  };
}

export function toNotificationPreferenceDto(
  pref: PrismaNotificationPreference,
) {
  return {
    id: pref.key,
    label: pref.label,
    enabled: pref.enabled,
  };
}
