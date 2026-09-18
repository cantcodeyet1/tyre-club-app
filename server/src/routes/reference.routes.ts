import { Router } from 'express';

import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { toBranchDto, toDealDto, toProductDto } from '../utils/mappers.js';

export const dealsRouter = Router();
export const branchesRouter = Router();
export const productsRouter = Router();

dealsRouter.use(requireAuth);
branchesRouter.use(requireAuth);
productsRouter.use(requireAuth);

dealsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const deals = await prisma.deal.findMany({ orderBy: { sortOrder: 'asc' } });

    res.json(deals.map(toDealDto));
  }),
);

branchesRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const branches = await prisma.branch.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    res.json(branches.map(toBranchDto));
  }),
);

productsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const products = await prisma.product.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    res.json(products.map(toProductDto));
  }),
);
