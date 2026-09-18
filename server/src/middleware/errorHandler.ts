import { ZodError } from 'zod';

import { HttpError } from '../utils/httpError.js';

import type { NextFunction, Request, Response } from 'express';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: err.issues[0]?.message ?? 'Invalid request',
      issues: err.issues,
    });

    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });

    return;
  }

  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
}
