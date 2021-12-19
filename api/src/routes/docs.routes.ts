import { NextFunction, Request, Response, Router } from 'express';
import SwaggerUI from 'swagger-ui-express';

import { docs } from '../docs';

const router = Router();

router.use(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    // res.set('Content-Type', 'text/html');
    next();
  },
  SwaggerUI.serveFiles(docs),
  SwaggerUI.setup(docs, { explorer: true }),
);

export default router;
