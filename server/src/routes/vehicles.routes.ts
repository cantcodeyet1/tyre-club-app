import { Router } from 'express';

import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import {
  createVehicleSchema,
  updateVehicleSchema,
} from '../schemas/vehicle.schemas.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notFound } from '../utils/httpError.js';
import { toHealthCheckDto, toVehicleDto } from '../utils/mappers.js';

export const vehiclesRouter = Router();

vehiclesRouter.use(requireAuth);

async function findOwnedVehicle(userId: string, vehicleId: string) {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, userId },
  });

  if (!vehicle) {
    throw notFound('Vehicle could not be found');
  }

  return vehicle;
}

vehiclesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const vehicles = await prisma.vehicle.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(vehicles.map(toVehicleDto));
  }),
);

vehiclesRouter.post(
  '/',
  validateBody(createVehicleSchema),
  asyncHandler(async (req, res) => {
    const input = req.body as ReturnType<
      typeof createVehicleSchema.parse
    >;

    const vehicle = await prisma.vehicle.create({
      data: {
        userId: req.userId as string,
        name: `${input.make.trim()} ${input.model.trim()}`,
        make: input.make.trim(),
        model: input.model.trim(),
        year: input.year,
        registration: input.registration?.trim()
          ? input.registration.trim().toUpperCase()
          : undefined,
        odometerKm: input.odometerKm,
        tyreSize: input.tyreSize?.trim() || '265/65 R17',
        colour: input.colour?.trim() || undefined,
        photoUrl: input.photoUrl || undefined,
        fuelType: input.fuelType,
        transmission: input.transmission ?? 'Automatic',
        status: 'good',
        nextService: 'Tyre pressure check in 4 weeks',
        complianceDue: 'Valid',
        checksDue: 0,
        checks: {
          create: [
            {
              category: 'service',
              title: 'Tyre Pressure',
              dueLabel: 'Set reminder',
              status: 'neutral',
              lastLogged: 'Not logged yet',
              nextDue: 'Not set',
              frequency: 'Monthly',
              detail:
                'Log tyre pressure checks to keep reminders and history up to date.',
              reminderEnabled: false,
            },
            {
              category: 'compliance',
              title: 'Car Insurance',
              dueLabel: 'Add policy',
              status: 'neutral',
              lastLogged: 'Not logged yet',
              nextDue: 'Not set',
              frequency: 'Yearly',
              detail: 'Add insurance details and expiry date.',
              reminderEnabled: false,
            },
          ],
        },
      },
    });

    res.status(201).json(toVehicleDto(vehicle));
  }),
);

vehiclesRouter.get(
  '/:vehicleId',
  asyncHandler(async (req, res) => {
    const vehicle = await findOwnedVehicle(
      req.userId as string,
      req.params.vehicleId,
    );

    res.json(toVehicleDto(vehicle));
  }),
);

vehiclesRouter.patch(
  '/:vehicleId',
  validateBody(updateVehicleSchema),
  asyncHandler(async (req, res) => {
    const existing = await findOwnedVehicle(
      req.userId as string,
      req.params.vehicleId,
    );
    const input = req.body as ReturnType<typeof updateVehicleSchema.parse>;
    const make = input.make?.trim() ?? existing.make;
    const model = input.model?.trim() ?? existing.model;

    const vehicle = await prisma.vehicle.update({
      where: { id: existing.id },
      data: {
        make,
        model,
        name: `${make} ${model}`,
        year: input.year,
        registration:
          input.registration !== undefined
            ? input.registration.trim()
              ? input.registration.trim().toUpperCase()
              : null
            : undefined,
        odometerKm: input.odometerKm,
        colour: input.colour?.trim(),
        photoUrl:
          input.photoUrl !== undefined ? input.photoUrl || null : undefined,
        fuelType: input.fuelType,
        transmission: input.transmission,
        tyreSize: input.tyreSize?.trim(),
      },
    });

    res.json(toVehicleDto(vehicle));
  }),
);

vehiclesRouter.delete(
  '/:vehicleId',
  asyncHandler(async (req, res) => {
    const vehicle = await findOwnedVehicle(
      req.userId as string,
      req.params.vehicleId,
    );

    await prisma.vehicle.delete({ where: { id: vehicle.id } });

    res.json({ ok: true });
  }),
);

vehiclesRouter.get(
  '/:vehicleId/checks',
  asyncHandler(async (req, res) => {
    const vehicle = await findOwnedVehicle(
      req.userId as string,
      req.params.vehicleId,
    );
    const checks = await prisma.healthCheck.findMany({
      where: { vehicleId: vehicle.id },
      orderBy: { createdAt: 'asc' },
    });

    res.json(checks.map(toHealthCheckDto));
  }),
);
