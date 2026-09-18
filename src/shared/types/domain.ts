export type Status = 'good' | 'warning' | 'danger' | 'neutral';

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  membershipNumber: string;
  memberSince: string;
  phone: string;
};

export type Vehicle = {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  registration?: string;
  odometerKm: number;
  tyreSize: string;
  colour?: string;
  photoUrl?: string;
  fuelType?: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission?: 'Manual' | 'Automatic';
  status: Status;
  nextService: string;
  complianceDue: string;
  checksDue: number;
};

export type HealthCheck = {
  id: string;
  vehicleId: string;
  category: 'compliance' | 'service' | 'reports';
  title: string;
  dueLabel: string;
  status: Status;
  lastLogged: string;
  detail: string;
  frequency?: string;
  nextDue?: string;
  reminderEnabled?: boolean;
};

export type TyrePressureReadings = {
  frontLeft: number;
  frontRight: number;
  rearLeft: number;
  rearRight: number;
};

export type CheckLogEntry = {
  id: string;
  vehicleId: string;
  checkId: string;
  kind: 'tyre' | 'compliance';
  title: string;
  date: string;
  location?: string;
  notes?: string;
  pressureReadings?: TyrePressureReadings;
  complianceType?: 'insurance' | 'licence' | 'radio' | 'other';
  insurerName?: string;
  coverType?: string;
  effectiveDate?: string;
  expiryDate?: string;
  createdAt: string;
};

export type Trip = {
  id: string;
  vehicleId: string;
  title: string;
  route: string;
  date: string;
  status: 'upcoming' | 'active' | 'past';
  estimatedCost: number;
  actualCost?: number;
  distanceKm: number;
  startMileageKm?: number;
  notes?: string;
  createdAt?: string;
};

export type Deal = {
  id: string;
  title: string;
  description: string;
  tag: string;
  route: string;
};

export type Branch = {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
};

export type NotificationPreference = {
  id: string;
  label: string;
  enabled: boolean;
};
