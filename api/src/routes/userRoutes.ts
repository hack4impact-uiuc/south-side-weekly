import { Router } from 'express';

import { errorWrap } from '../middleware';
import * as userController from '../controllers/userController';
import {
  requireAdmin,
  requireRegistered,
  requireRequestSecret,
} from '../middleware/auth';

const router = Router();

// GET /api/users/
router.get('/', requireRegistered, errorWrap(userController.getUsers));

// GET /api/users/approved
router.get(
  '/approved',
  requireRegistered,
  errorWrap(userController.getApproved),
);

// GET /api/users/pending
router.get('/pending', requireAdmin, errorWrap(userController.getPendingUsers));

// GET /api/users/denied
router.get('/denied', requireAdmin, errorWrap(userController.getDeniedUsers));

router.get(
  '/stallUsers',
  requireRequestSecret,
  errorWrap(userController.stallOldScheduledOnboarding),
);

// GET /api/users/:id
router.get('/:id', requireRegistered, errorWrap(userController.getUser));

router.get(
  '/:id/permissions',
  requireRegistered,
  errorWrap(userController.getUserPermissions),
);

// POST /api/users/
router.post('/', requireAdmin, errorWrap(userController.createUser));

// PUT /api/users/visitPage
router.put(
  '/visitPage',
  requireRegistered,
  errorWrap(userController.visitPage),
);

// PUT /api/users/:id
router.put('/:id', requireRegistered, errorWrap(userController.updateUser));

router.put('/:id/approve', requireAdmin, errorWrap(userController.approveUser));

router.put('/:id/deny', requireAdmin, errorWrap(userController.rejectUser));

router.put(
  '/:id/claimPitch',
  requireRegistered,
  errorWrap(userController.claimPitch),
);

// DELETE /api/users/:id
router.delete('/:id', requireAdmin, errorWrap(userController.deleteUser));

export default router;
