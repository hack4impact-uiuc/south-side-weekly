import { Router } from 'express';

import { errorWrap } from '../middleware';
import * as interestController from '../controllers/interestController';
import { requireAdmin, requireRegistered } from '../middleware/auth';

const router = Router();

// GET /api/teams
router.get('/', requireRegistered, errorWrap(interestController.getInterests));

// GET /api/teams/:id
router.get(
  '/:id',
  requireRegistered,
  errorWrap(interestController.getInterest),
);

// POST /api/teams
router.post('/', requireAdmin, errorWrap(interestController.createInterest));

// POST /api/teams/many
router.post(
  '/many',
  requireAdmin,
  errorWrap(interestController.createInterests),
);

// PUT /api/teams/many
router.put(
  '/many',
  requireAdmin,
  errorWrap(interestController.updateInterests),
);

// PUT /api/teams/:id
router.put('/:id', requireAdmin, errorWrap(interestController.updatedInterest));

export default router;
