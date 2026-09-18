import crypto from 'node:crypto';

import jwt from 'jsonwebtoken';

import { env } from '../env.js';

export type AccessTokenPayload = {
  sub: string;
};

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId } satisfies AccessTokenPayload, env.jwtAccessSecret, {
    expiresIn: env.accessTokenTtl,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString('hex');
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function refreshTokenExpiry(): Date {
  const expires = new Date();
  expires.setDate(expires.getDate() + env.refreshTokenTtlDays);

  return expires;
}

export function generateOpaqueToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
