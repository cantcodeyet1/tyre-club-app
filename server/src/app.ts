import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiRouter } from './routes/index.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(','),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '5mb' }));
  app.use(morgan(env.isProduction ? 'combined' : 'dev'));

  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'tyre-club-server' });
  });

  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
