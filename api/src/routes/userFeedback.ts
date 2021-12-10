import { Router } from 'express';

import { errorWrap } from '../middleware';
import * as userFeedbackController from '../controllers/userFeedback.controller';
import { requireAdmin, requireRegistered } from '../middleware/auth';

const router = Router();

// GET /api/userFeedback
router.get(
  '/',
  requireAdmin,
  errorWrap(userFeedbackController.getAllUserFeedback),
);

// GET /api/userFeedback/:id
router.get(
  '/:id',
  requireRegistered,
  errorWrap(userFeedbackController.getUserFeedback),
);

// GET /api/userFeedback/user/:id
router.get(
  '/user/:id',
  requireRegistered,
  errorWrap(userFeedbackController.getAllFeedbackForUser),
);

// POST /api/userFeedback
router.post(
  '/',
  requireRegistered,
  errorWrap(userFeedbackController.createUserFeedback),
);

// PUT /api/userFeedback/:id
router.put(
  '/:id',
  requireRegistered,
  errorWrap(userFeedbackController.updateUserFeedback),
);

// DELETE /api/userFeedback/:id
router.delete(
  '/:id',
  requireRegistered,
  errorWrap(userFeedbackController.deleteUserFeedback),
);

export default router;
