import { Router } from 'express';

import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createCheckLogSchema, reminderSchema } from '../schemas/check.schemas.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notFound } from '../utils/httpError.js';
import { toCheckLogEntryDto, toHealthCheckDto } from '../utils/mappers.js';

export const checksRouter = Router();

checksRouter.use(requireAuth);

async function findOwnedCheck(userId: string, checkId: string) {
  const check = await prisma.healthCheck.findFirst({
    where: { id: checkId, vehicle: { userId } },
  });

  if (!check) {
    throw notFound('Check could not be found');
  }

  return check;
}

checksRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const checks = await prisma.healthCheck.findMany({
      where: { vehicle: { userId: req.userId } },
      orderBy: { createdAt: 'asc' },
    });

    res.json(checks.map(toHealthCheckDto));
  }),
);

checksRouter.get(
  '/:checkId',
  asyncHandler(async (req, res) => {
    const check = await findOwnedCheck(
      req.userId as string,
      req.params.checkId,
    );

    res.json(toHealthCheckDto(check));
  }),
);

checksRouter.patch(
  '/:checkId/reminder',
  validateBody(reminderSchema),
  asyncHandler(async (req, res) => {
    const check = await findOwnedCheck(
      req.userId as string,
      req.params.checkId,
    );
    const updated = await prisma.healthCheck.update({
      where: { id: check.id },
      data: { reminderEnabled: req.body.enabled },
    });

    res.json(toHealthCheckDto(updated));
  }),
);

checksRouter.get(
  '/:checkId/logs',
  asyncHandler(async (req, res) => {
    const check = await findOwnedCheck(
      req.userId as string,
      req.params.checkId,
    );
    const logs = await prisma.checkLogEntry.findMany({
      where: { checkId: check.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(logs.map(toCheckLogEntryDto));
  }),
);

checksRouter.post(
  '/:checkId/logs',
  validateBody(createCheckLogSchema),
  asyncHandler(async (req, res) => {
    const check = await findOwnedCheck(
      req.userId as string,
      req.params.checkId,
    );
    const input = req.body as ReturnType<typeof createCheckLogSchema.parse>;

    const logDate = input.kind === 'tyre' ? input.dateChecked : input.effectiveDate;
    const title =
      input.kind === 'tyre'
        ? `Check at ${input.location}`
        : input.type === 'insurance'
          ? 'Insurance updated'
          : `${input.coverType} updated`;

    const entry = await prisma.checkLogEntry.create({
      data: {
        vehicleId: check.vehicleId,
        checkId: check.id,
        kind: input.kind,
        title,
        date: logDate,
        location: input.kind === 'tyre' ? input.location : undefined,
        notes: input.notes,
        frontLeft: input.kind === 'tyre' ? input.pressureReadings.frontLeft : undefined,
        frontRight: input.kind === 'tyre' ? input.pressureReadings.frontRight : undefined,
        rearLeft: input.kind === 'tyre' ? input.pressureReadings.rearLeft : undefined,
        rearRight: input.kind === 'tyre' ? input.pressureReadings.rearRight : undefined,
        complianceType: input.kind === 'compliance' ? input.type : undefined,
        insurerName: input.kind === 'compliance' ? input.insurerName : undefined,
        coverType: input.kind === 'compliance' ? input.coverType : undefined,
        effectiveDate: input.kind === 'compliance' ? input.effectiveDate : undefined,
        expiryDate: input.kind === 'compliance' ? input.expiryDate : undefined,
      },
    });

    await prisma.healthCheck.update({
      where: { id: check.id },
      data: {
        lastLogged: logDate,
        status: 'good',
        dueLabel: input.kind === 'compliance' ? 'Valid' : 'All good',
      },
    });

    if (input.kind === 'compliance') {
      await prisma.vehicle.update({
        where: { id: check.vehicleId },
        data: { complianceDue: 'Valid' },
      });
    }

    res.status(201).json(toCheckLogEntryDto(entry));
  }),
);
