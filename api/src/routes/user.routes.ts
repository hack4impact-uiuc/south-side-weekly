import { Router } from 'express';

import { errorWrap } from '../middleware';
import { UserController } from '../controllers';
import {
  requireAdmin,
  requireContributor,
  requireRegistered,
  requireRequestSecret,
} from '../middleware/auth';

const router = Router();

// GET /api/users
router.get('/', requireRegistered, errorWrap(UserController.getUsers));

// GET /api/users/approved
router.get(
  '/approved',
  requireRegistered,
  errorWrap(UserController.getApproved),
);

// GET /api/users/pending
router.get('/pending', requireAdmin, errorWrap(UserController.getPendingUsers));

// GET /api/users/denied
router.get('/denied', requireAdmin, errorWrap(UserController.getDeniedUsers));

// GET /api/users/me
router.get('/me', requireRegistered, errorWrap(UserController.getMe));

router.get(
  '/stallUsers',
  requireRequestSecret,
  errorWrap(UserController.stallOldScheduledOnboarding),
);

// GET /api/users/:id
router.get('/:id', requireRegistered, errorWrap(UserController.getUser));

router.get(
  '/:id/permissions',
  requireRegistered,
  errorWrap(UserController.getUserPermissions),
);

// POST /api/users/
router.post('/', requireAdmin, errorWrap(UserController.createUser));

// PUT /api/users/visitPage
router.put(
  '/visitPage',
  requireRegistered,
  errorWrap(UserController.visitPage),
);

// PUT /api/users/:id
router.put('/:id', requireRegistered, errorWrap(UserController.updateUser));

router.put('/:id/approve', requireAdmin, errorWrap(UserController.approveUser));

router.put('/:id/deny', requireAdmin, errorWrap(UserController.rejectUser));

router.put(
  '/:id/claimPitch',
  requireRegistered,
  errorWrap(UserController.claimPitch),
);

router.get(
  '/:id/pitches',
  requireContributor,
  errorWrap(UserController.pitches),
);

// DELETE /api/users/:id
router.delete('/:id', requireAdmin, errorWrap(UserController.deleteUser));

export default router;
