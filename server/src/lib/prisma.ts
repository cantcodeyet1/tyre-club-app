import { PrismaClient } from '@prisma/client';

import { env } from '../env.js';

declare global {
   
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: env.isProduction ? ['error', 'warn'] : ['error', 'warn'],
  });

if (!env.isProduction) {
  global.__prisma = prisma;
}
