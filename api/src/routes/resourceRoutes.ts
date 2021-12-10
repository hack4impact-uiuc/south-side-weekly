import { Router } from 'express';

import { errorWrap } from '../middleware';
import * as resourceController from '../controllers/resourceController';
import { requireAdmin, requireRegistered } from '../middleware/auth';

const router = Router();

// GET /api/resources
router.get('/', requireRegistered, errorWrap(resourceController.getResources));

// GET /api/resources/:id
router.get(
  '/:id',
  requireRegistered,
  errorWrap(resourceController.getResource),
);

// PUT /api/resources/:id
router.put('/:id', requireAdmin, errorWrap(resourceController.updateResource));

// POST /api/resources
router.post('/', requireAdmin, errorWrap(resourceController.createResource));

// DELETE /api/resources/:id
router.delete(
  '/:id',
  requireAdmin,
  errorWrap(resourceController.deleteResource),
);

export default router;
