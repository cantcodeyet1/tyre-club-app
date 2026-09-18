import { z } from 'zod';

export const createTripSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle is required'),
  title: z.string().trim().min(1, 'Title is required'),
  route: z.string().trim().min(1, 'Route is required'),
  date: z.string().min(1, 'Date is required'),
  distanceKm: z.coerce.number().min(0).optional(),
  estimatedCost: z.coerce.number().min(0).optional(),
  startMileageKm: z.coerce.number().min(0).optional(),
});

export const updateTripSchema = z.object({
  status: z.enum(['upcoming', 'active', 'past']).optional(),
  actualCost: z.coerce.number().min(0).optional(),
  distanceKm: z.coerce.number().min(0).optional(),
  estimatedCost: z.coerce.number().min(0).optional(),
  startMileageKm: z.coerce.number().min(0).optional(),
  title: z.string().trim().min(1).optional(),
  route: z.string().trim().min(1).optional(),
  date: z.string().min(1).optional(),
  notes: z.string().trim().optional(),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
