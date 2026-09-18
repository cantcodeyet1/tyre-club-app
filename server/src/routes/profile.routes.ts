import { Router } from 'express';

import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { updateNotificationPreferenceSchema } from '../schemas/profile.schemas.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notFound } from '../utils/httpError.js';
import { toNotificationPreferenceDto } from '../utils/mappers.js';

export const profileRouter = Router();

profileRouter.use(requireAuth);

profileRouter.get(
  '/notifications',
  asyncHandler(async (req, res) => {
    const prefs = await prisma.notificationPreference.findMany({
      where: { userId: req.userId },
      orderBy: { sortOrder: 'asc' },
    });

    res.json(prefs.map(toNotificationPreferenceDto));
  }),
);

profileRouter.patch(
  '/notifications/:key',
  validateBody(updateNotificationPreferenceSchema),
  asyncHandler(async (req, res) => {
    const pref = await prisma.notificationPreference.findFirst({
      where: { userId: req.userId, key: req.params.key },
    });

    if (!pref) {
      throw notFound('Notification preference could not be found');
    }

    const updated = await prisma.notificationPreference.update({
      where: { id: pref.id },
      data: { enabled: req.body.enabled },
    });

    res.json(toNotificationPreferenceDto(updated));
  }),
);
