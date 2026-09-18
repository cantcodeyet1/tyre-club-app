import { z } from 'zod';

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

const numericText = (label: string) =>
  requiredText(label).refine(
    (value) => Number.isFinite(Number(value.replace(/\s/g, ''))),
    `${label} must be a number`,
  );

const positiveNumericText = (label: string) =>
  numericText(label).refine(
    (value) => Number(value.replace(/\s/g, '')) > 0,
    `${label} must be greater than 0`,
  );

export const addVehicleSchema = z.object({
  colour: z.string().trim().optional(),
  fuelType: z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid'], {
    error: 'Fuel type is required',
  }),
  make: requiredText('Make'),
  mileage: positiveNumericText('Current mileage'),
  model: requiredText('Model'),
  registration: requiredText('Registration plate'),
  year: numericText('Year').refine((value) => {
    const year = Number(value);
    const nextYear = new Date().getFullYear() + 1;

    return year >= 1900 && year <= nextYear;
  }, 'Enter a valid year'),
});

export type AddVehicleValues = z.infer<typeof addVehicleSchema>;

const pressureField = positiveNumericText('Pressure reading').refine(
  (value) => {
    const pressure = Number(value.replace(/\s/g, ''));

    return pressure >= 10 && pressure <= 80;
  },
  'Enter a valid PSI value',
);

export const tyreLogSchema = z
  .object({
    dateChecked: requiredText('Date checked'),
    frontLeft: z.string().trim().optional(),
    frontRight: z.string().trim().optional(),
    location: requiredText('Location / Fitment centre'),
    notes: z.string().trim().optional(),
    rearLeft: z.string().trim().optional(),
    rearRight: z.string().trim().optional(),
    sameForAll: z.boolean(),
    samePressure: z.string().trim().optional(),
  })
  .superRefine((values, context) => {
    if (values.sameForAll) {
      const parsed = pressureField.safeParse(values.samePressure ?? '');

      if (!parsed.success) {
        context.addIssue({
          code: 'custom',
          message: parsed.error.issues[0]?.message ?? 'Pressure is required',
          path: ['samePressure'],
        });
      }

      return;
    }

    (
      [
        ['frontLeft', 'Front left'],
        ['frontRight', 'Front right'],
        ['rearLeft', 'Rear left'],
        ['rearRight', 'Rear right'],
      ] as const
    ).forEach(([field, label]) => {
      const parsed = pressureField.safeParse(values[field] ?? '');

      if (!parsed.success) {
        context.addIssue({
          code: 'custom',
          message: `${label}: ${
            parsed.error.issues[0]?.message ?? 'Pressure is required'
          }`,
          path: [field],
        });
      }
    });
  });

export type TyreLogValues = z.infer<typeof tyreLogSchema>;

export const complianceLogSchema = z
  .object({
    coverType: requiredText('Cover type'),
    effectiveDate: requiredText('Effective date'),
    expiryDate: requiredText('Expiry date'),
    insurerName: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    type: z.enum(['insurance', 'licence', 'radio', 'other'], {
      error: 'Type is required',
    }),
  })
  .superRefine((values, context) => {
    if (values.type === 'insurance' && !values.insurerName?.trim()) {
      context.addIssue({
        code: 'custom',
        message: 'Insurer name is required',
        path: ['insurerName'],
      });
    }

    if (
      values.effectiveDate &&
      values.expiryDate &&
      new Date(values.expiryDate) <= new Date(values.effectiveDate)
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Expiry date must be after effective date',
        path: ['expiryDate'],
      });
    }
  });

export type ComplianceLogValues = z.infer<typeof complianceLogSchema>;
