import { z } from 'zod';

const fuelTypeEnum = z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid']);
const transmissionEnum = z.enum(['Manual', 'Automatic']);

export const createVehicleSchema = z.object({
  make: z.string().trim().min(1, 'Make is required'),
  model: z.string().trim().min(1, 'Model is required'),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  registration: z.string().trim().min(1, 'Registration plate is required'),
  odometerKm: z.coerce.number().min(0),
  colour: z.string().trim().optional(),
  fuelType: fuelTypeEnum.optional(),
  transmission: transmissionEnum.optional(),
  tyreSize: z.string().trim().optional(),
});

export const updateVehicleSchema = z.object({
  make: z.string().trim().min(1).optional(),
  model: z.string().trim().min(1).optional(),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  registration: z.string().trim().min(1).optional(),
  odometerKm: z.coerce.number().min(0).optional(),
  colour: z.string().trim().optional(),
  fuelType: fuelTypeEnum.optional(),
  transmission: transmissionEnum.optional(),
  tyreSize: z.string().trim().optional(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
