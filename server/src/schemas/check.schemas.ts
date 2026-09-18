import { z } from 'zod';

export const reminderSchema = z.object({
  enabled: z.boolean(),
});

const tyreLogSchema = z.object({
  kind: z.literal('tyre'),
  dateChecked: z.string().min(1, 'Date checked is required'),
  location: z.string().min(1, 'Location is required'),
  notes: z.string().trim().optional(),
  pressureReadings: z.object({
    frontLeft: z.coerce.number().min(10).max(80),
    frontRight: z.coerce.number().min(10).max(80),
    rearLeft: z.coerce.number().min(10).max(80),
    rearRight: z.coerce.number().min(10).max(80),
  }),
});

const complianceLogSchema = z.object({
  kind: z.literal('compliance'),
  type: z.enum(['insurance', 'licence', 'radio', 'other']),
  insurerName: z.string().trim().optional(),
  coverType: z.string().min(1, 'Cover type is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  notes: z.string().trim().optional(),
});

export const createCheckLogSchema = z.discriminatedUnion('kind', [
  tyreLogSchema,
  complianceLogSchema,
]);

export type CreateCheckLogInput = z.infer<typeof createCheckLogSchema>;
