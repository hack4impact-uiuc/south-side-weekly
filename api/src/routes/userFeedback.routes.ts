import { Router } from 'express';

import { errorWrap } from '../middleware';
import { UserFeedbackController } from '../controllers';
import { requireAdmin, requireRegistered } from '../middleware/auth';

const router = Router();

// GET /api/userFeedback
router.get(
  '/',
  requireAdmin,
  errorWrap(UserFeedbackController.getAllUserFeedback),
);

// GET /api/userFeedback/:id
router.get(
  '/:id',
  requireRegistered,
  errorWrap(UserFeedbackController.getUserFeedback),
);

// GET /api/userFeedback/user/:id
router.get(
  '/user/:id',
  requireRegistered,
  errorWrap(UserFeedbackController.getAllFeedbackForUser),
);

// GET /api/userFeedback/:userId/:pitchId/:teamId
router.get(
  '/:userId/:pitchId/:teamId',
  requireRegistered,
  errorWrap(UserFeedbackController.getUserFeedbackForPitch),
);

// POST /api/userFeedback
router.post(
  '/',
  requireRegistered,
  errorWrap(UserFeedbackController.createUserFeedback),
);

// PUT /api/userFeedback/:id
router.put(
  '/:id',
  requireRegistered,
  errorWrap(UserFeedbackController.updateUserFeedback),
);

// DELETE /api/userFeedback/:id
router.delete(
  '/:id',
  requireRegistered,
  errorWrap(UserFeedbackController.deleteUserFeedback),
);

export default router;
