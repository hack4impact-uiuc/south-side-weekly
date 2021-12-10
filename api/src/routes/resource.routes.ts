import { Router } from 'express';

import { errorWrap } from '../middleware';
import { ResourceController } from '../controllers';
import { requireAdmin, requireRegistered } from '../middleware/auth';

const router = Router();

// GET /api/resources
router.get('/', requireRegistered, errorWrap(ResourceController.getResources));

// GET /api/resources/:id
router.get(
  '/:id',
  requireRegistered,
  errorWrap(ResourceController.getResource),
);

// PUT /api/resources/:id
router.put('/:id', requireAdmin, errorWrap(ResourceController.updateResource));

// POST /api/resources
router.post('/', requireAdmin, errorWrap(ResourceController.createResource));

// DELETE /api/resources/:id
router.delete(
  '/:id',
  requireAdmin,
  errorWrap(ResourceController.deleteResource),
);

export default router;
