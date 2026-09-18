import { Router } from 'express';

import { authRouter } from './auth.routes.js';
import { checksRouter } from './checks.routes.js';
import { profileRouter } from './profile.routes.js';
import { branchesRouter, dealsRouter, productsRouter } from './reference.routes.js';
import { tripsRouter } from './trips.routes.js';
import { vehiclesRouter } from './vehicles.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/vehicles', vehiclesRouter);
apiRouter.use('/checks', checksRouter);
apiRouter.use('/trips', tripsRouter);
apiRouter.use('/deals', dealsRouter);
apiRouter.use('/branches', branchesRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/profile', profileRouter);
