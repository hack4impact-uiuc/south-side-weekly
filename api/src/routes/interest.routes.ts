import { Router } from 'express';

import { errorWrap } from '../middleware';
import { InterestController } from '../controllers';
import { requireAdmin, requireRegistered } from '../middleware/auth';

const router = Router();

// GET /api/teams
router.get('/', requireRegistered, errorWrap(InterestController.getInterests));

// GET /api/teams/:id
router.get(
  '/:id',
  requireRegistered,
  errorWrap(InterestController.getInterest),
);

// POST /api/teams
router.post('/', requireAdmin, errorWrap(InterestController.createInterest));

// POST /api/teams/many
router.post(
  '/many',
  requireAdmin,
  errorWrap(InterestController.createInterests),
);

// PUT /api/teams/many
router.put(
  '/many',
  requireAdmin,
  errorWrap(InterestController.updateInterests),
);

// PUT /api/teams/:id
router.put('/:id', requireAdmin, errorWrap(InterestController.updatedInterest));

export default router;
