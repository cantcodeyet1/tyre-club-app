import { Router } from 'express';

import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createTripSchema, updateTripSchema } from '../schemas/trip.schemas.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { badRequest, notFound } from '../utils/httpError.js';
import { toTripDto } from '../utils/mappers.js';

export const tripsRouter = Router();

tripsRouter.use(requireAuth);

async function findOwnedTrip(userId: string, tripId: string) {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId },
  });

  if (!trip) {
    throw notFound('Trip could not be found');
  }

  return trip;
}

tripsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const trips = await prisma.trip.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
    });

    res.json(trips.map(toTripDto));
  }),
);

tripsRouter.post(
  '/',
  validateBody(createTripSchema),
  asyncHandler(async (req, res) => {
    const input = req.body as ReturnType<typeof createTripSchema.parse>;
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: input.vehicleId, userId: req.userId },
    });

    if (!vehicle) {
      throw badRequest('Select a valid vehicle');
    }

    const trip = await prisma.trip.create({
      data: {
        userId: req.userId as string,
        vehicleId: vehicle.id,
        title: input.title,
        route: input.route,
        date: input.date,
        status: 'upcoming',
        distanceKm: input.distanceKm ?? 0,
        estimatedCost: input.estimatedCost ?? 0,
        startMileageKm: input.startMileageKm,
      },
    });

    res.status(201).json(toTripDto(trip));
  }),
);

tripsRouter.get(
  '/:tripId',
  asyncHandler(async (req, res) => {
    const trip = await findOwnedTrip(req.userId as string, req.params.tripId);

    res.json(toTripDto(trip));
  }),
);

tripsRouter.patch(
  '/:tripId',
  validateBody(updateTripSchema),
  asyncHandler(async (req, res) => {
    const existing = await findOwnedTrip(
      req.userId as string,
      req.params.tripId,
    );
    const input = req.body as ReturnType<typeof updateTripSchema.parse>;

    const trip = await prisma.trip.update({
      where: { id: existing.id },
      data: {
        status: input.status,
        actualCost: input.actualCost,
        distanceKm: input.distanceKm,
        estimatedCost: input.estimatedCost,
        startMileageKm: input.startMileageKm,
        title: input.title,
        route: input.route,
        date: input.date,
        notes: input.notes,
      },
    });

    res.json(toTripDto(trip));
  }),
);

tripsRouter.delete(
  '/:tripId',
  asyncHandler(async (req, res) => {
    const trip = await findOwnedTrip(req.userId as string, req.params.tripId);

    await prisma.trip.delete({ where: { id: trip.id } });

    res.json({ ok: true });
  }),
);
