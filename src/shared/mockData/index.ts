import type {
  Branch,
  Deal,
  HealthCheck,
  NotificationPreference,
  Product,
  Trip,
  User,
  Vehicle,
} from '../types/domain';

export const mockUser: User = {
  id: 'usr-001',
  name: 'Tendai Moyo',
  email: 'tariro@tyreclub.co.zw',
  phone: '+263 77 555 0198',
  membershipNumber: 'TC-2026-1842',
  memberSince: 'Apr 2026',
};

export const mockVehicles: Vehicle[] = [
  {
    id: 'veh-001',
    name: 'Toyota Hilux',
    make: 'Toyota',
    model: 'Hilux',
    year: 2021,
    registration: 'FJK 456',
    odometerKm: 84320,
    tyreSize: '265/65 R17',
    status: 'danger',
    nextService: 'Insurance expired',
    complianceDue: 'Insurance expired',
    checksDue: 3,
  },
  {
    id: 'veh-002',
    name: 'BMW Series 3',
    make: 'BMW',
    model: 'Series 3',
    year: 2023,
    registration: 'ABC 123',
    odometerKm: 84320,
    tyreSize: '225/45 R18',
    status: 'good',
    nextService: 'Wheel rotation in 8 weeks',
    complianceDue: 'Valid',
    checksDue: 0,
  },
  {
    id: 'veh-003',
    name: 'Honda Fit',
    make: 'Honda',
    model: 'Fit',
    year: 2018,
    registration: 'ADR 2391',
    odometerKm: 90120,
    tyreSize: '185/55 R16',
    status: 'good',
    nextService: 'All good',
    complianceDue: 'Valid',
    checksDue: 0,
  },
];

export const mockChecks: HealthCheck[] = [
  {
    id: 'chk-001',
    vehicleId: 'veh-001',
    category: 'compliance',
    title: 'Vehicle licence renewal',
    dueLabel: 'Due in 6 days',
    status: 'danger',
    lastLogged: '12 Jun 2026',
    detail: 'Upload new licence disc and set next reminder date.',
  },
  {
    id: 'chk-002',
    vehicleId: 'veh-001',
    category: 'service',
    title: 'Front tyre pressure',
    dueLabel: 'Needs attention',
    status: 'warning',
    lastLogged: '10 Jun 2026',
    detail: 'Front-left pressure is below the recommended range.',
  },
  {
    id: 'chk-003',
    vehicleId: 'veh-002',
    category: 'reports',
    title: 'Monthly condition report',
    dueLabel: 'Ready to review',
    status: 'neutral',
    lastLogged: '01 Jun 2026',
    detail: 'Mileage, tyre wear, and service notes are ready for export.',
  },
  {
    id: 'chk-004',
    vehicleId: 'veh-003',
    category: 'service',
    title: 'Tyre rotation',
    dueLabel: 'All good',
    status: 'good',
    lastLogged: '05 Jun 2026',
    detail: 'Tyres rotated and balanced at Tyre Club Samora.',
  },
];

export const mockTrips: Trip[] = [
  {
    id: 'trip-001',
    vehicleId: 'veh-001',
    title: 'Harare to Bulawayo',
    route: 'Harare -> Kwekwe -> Bulawayo',
    date: '2026-06-21',
    status: 'upcoming',
    estimatedCost: 148,
    distanceKm: 439,
  },
  {
    id: 'trip-002',
    vehicleId: 'veh-002',
    title: 'Mutare delivery run',
    route: 'Msasa -> Mutare -> Msasa',
    date: '2026-06-15',
    status: 'active',
    estimatedCost: 96,
    distanceKm: 536,
  },
  {
    id: 'trip-003',
    vehicleId: 'veh-003',
    title: 'Airport transfer week',
    route: 'Borrowdale -> RGM Airport',
    date: '2026-05-28',
    status: 'past',
    estimatedCost: 45,
    actualCost: 42,
    distanceKm: 118,
  },
];

export const mockDeals: Deal[] = [
  {
    id: 'deal-credit',
    title: 'Buy tyres on credit',
    description: 'Flexible tyre replacement plans for members and fleets.',
    tag: 'Finance',
    route: '/deals/credit',
  },
  {
    id: 'deal-maz',
    title: 'MAZ member scheme',
    description: 'Preferential offers for registered transport operators.',
    tag: 'Partner',
    route: '/deals/maz',
  },
  {
    id: 'deal-buy',
    title: 'Buy tyres',
    description: 'Browse popular fitments, brands, and service bundles.',
    tag: 'Shop',
    route: '/deals/buy-tyres',
  },
];

export const mockBranches: Branch[] = [
  {
    id: 'samora',
    name: 'Tyre Club Samora',
    address: 'Samora Machel Avenue, Harare',
    hours: 'Mon-Fri 08:00-17:00, Sat 08:00-13:00',
    phone: '+263 24 270 1900',
  },
  {
    id: 'msasa',
    name: 'Tyre Club Msasa',
    address: 'Mutare Road, Msasa',
    hours: 'Mon-Fri 08:00-17:00',
    phone: '+263 24 244 0118',
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prd-001',
    name: 'Passenger tyres',
    category: 'Tyres',
    description: 'Popular city, SUV, and performance tyre fitments.',
  },
  {
    id: 'prd-002',
    name: 'Wheel balancing',
    category: 'Services',
    description: 'Balancing, alignment checks, and rotation support.',
  },
  {
    id: 'prd-003',
    name: 'Fleet inspections',
    category: 'Fleet',
    description: 'Scheduled checkups, compliance reporting, and advice.',
  },
];

export const mockNotificationPreferences: NotificationPreference[] = [
  { id: 'whatsapp', label: 'WhatsApp reminders', enabled: true },
  { id: 'email', label: 'Email summaries', enabled: true },
  { id: 'push', label: 'Push notifications', enabled: false },
];
