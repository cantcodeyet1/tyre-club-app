import { Router } from 'express';

import { issueTokens, revokeRefreshToken } from '../lib/authTokens.js';
import { defaultNotificationPreferences } from '../lib/defaults.js';
import { verifyGoogleAccessToken } from '../lib/googleAuth.js';
import { generateMembershipNumber } from '../lib/ids.js';
import {
  generateOpaqueToken,
  hashToken,
} from '../lib/jwt.js';
import {
  passwordResetEmail,
  sendEmail,
  verifyEmailEmail,
} from '../lib/mailer.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import {
  forgotPasswordSchema,
  googleAuthSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
  verifyEmailSchema,
} from '../schemas/auth.schemas.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { badRequest, conflict, notFound, unauthorized } from '../utils/httpError.js';
import { toUserDto } from '../utils/mappers.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      throw conflict('An account with this email already exists');
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        membershipNumber: generateMembershipNumber(),
        notificationPrefs: { create: defaultNotificationPreferences },
      },
    });

    const verificationToken = generateOpaqueToken();

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(verificationToken),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    void sendEmail({
      to: user.email,
      ...verifyEmailEmail(verificationToken),
    });

    const tokens = await issueTokens(user.id);

    res.status(201).json({
      user: toUserDto(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }),
);

authRouter.post(
  '/login',
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user?.passwordHash) {
      throw unauthorized('Invalid email or password');
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      throw unauthorized('Invalid email or password');
    }

    const tokens = await issueTokens(user.id);

    res.json({
      user: toUserDto(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }),
);

authRouter.post(
  '/google',
  validateBody(googleAuthSchema),
  asyncHandler(async (req, res) => {
    const { accessToken: googleAccessToken } = req.body;
    const profile = await verifyGoogleAccessToken(googleAccessToken);

    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId: profile.googleId }, { email: profile.email }] },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: profile.name,
          email: profile.email,
          googleId: profile.googleId,
          avatarUrl: profile.avatarUrl,
          emailVerified: true,
          membershipNumber: generateMembershipNumber(),
          notificationPrefs: { create: defaultNotificationPreferences },
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: profile.googleId, emailVerified: true },
      });
    }

    const tokens = await issueTokens(user.id);

    res.json({
      user: toUserDto(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }),
);

authRouter.post(
  '/refresh',
  validateBody(refreshSchema),
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const tokenHash = hashToken(refreshToken);
    const stored = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (
      !stored ||
      stored.revokedAt ||
      stored.expiresAt.getTime() < Date.now()
    ) {
      throw unauthorized('Refresh token is invalid or expired');
    }

    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await issueTokens(stored.userId);

    res.json(tokens);
  }),
);

authRouter.post(
  '/forgot-password',
  validateBody(forgotPasswordSchema),
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const token = generateOpaqueToken();

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(token),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });
      void sendEmail({ to: user.email, ...passwordResetEmail(token) });
    }

    res.json({ ok: true });
  }),
);

authRouter.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const tokenHash = hashToken(token);
    const stored = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (
      !stored ||
      stored.usedAt ||
      stored.expiresAt.getTime() < Date.now()
    ) {
      throw badRequest('This reset link is invalid or has expired');
    }

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: stored.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: stored.id },
        data: { usedAt: new Date() },
      }),
      prisma.refreshToken.updateMany({
        where: { userId: stored.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    res.json({ ok: true });
  }),
);

authRouter.post(
  '/verify-email',
  validateBody(verifyEmailSchema),
  asyncHandler(async (req, res) => {
    const { token } = req.body;
    const tokenHash = hashToken(token);
    const stored = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });

    if (
      !stored ||
      stored.usedAt ||
      stored.expiresAt.getTime() < Date.now()
    ) {
      throw badRequest('This verification link is invalid or has expired');
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: stored.userId },
        data: { emailVerified: true },
      }),
      prisma.emailVerificationToken.update({
        where: { id: stored.id },
        data: { usedAt: new Date() },
      }),
    ]);

    res.json({ ok: true });
  }),
);

authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user) {
      throw notFound('User not found');
    }

    res.json(toUserDto(user));
  }),
);

authRouter.patch(
  '/me',
  requireAuth,
  validateBody(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        name: req.body.name,
        phone: req.body.phone,
      },
    });

    res.json(toUserDto(user));
  }),
);

authRouter.post(
  '/logout',
  asyncHandler(async (req, res) => {
    const refreshToken = req.body?.refreshToken as string | undefined;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    res.json({ ok: true });
  }),
);
