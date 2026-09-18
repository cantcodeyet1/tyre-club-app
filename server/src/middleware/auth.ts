import { verifyAccessToken } from '../lib/jwt.js';
import { unauthorized } from '../utils/httpError.js';

import type { NextFunction, Request, Response } from 'express';

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    next(unauthorized('Missing access token'));

    return;
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = verifyAccessToken(token);

    req.userId = payload.sub;
    next();
  } catch {
    next(unauthorized('Invalid or expired access token'));
  }
}
