import { Router } from 'express';

import { errorWrap } from '../middleware';
import * as pitchFeedbackController from '../controllers/pitchFeedback.controller';
import { requireAdmin, requireRegistered } from '../middleware/auth';

const router = Router();

// GET /api/pitchFeedback
router.get(
  '/',
  requireAdmin,
  errorWrap(pitchFeedbackController.getAllPitchFeedback),
);

// GET /api/pitchFeedback/:id
router.get(
  '/:id',
  requireAdmin,
  errorWrap(pitchFeedbackController.getPitchFeedback),
);

// GET /api/pitchFeedback/pitch/:id
router.get(
  '/pitch/:id',
  requireAdmin,
  errorWrap(pitchFeedbackController.getFeedbackForPitch),
);

// POST /api/pitchFeedback
router.post(
  '/',
  requireRegistered,
  errorWrap(pitchFeedbackController.createPitchFeedback),
);

// PUT /api/pitchFeedback/:id
router.put(
  '/:id',
  requireRegistered,
  errorWrap(pitchFeedbackController.updatePitchFeedback),
);

// DELETE /api/pitchFeedback/:id
router.delete(
  '/:id',
  requireAdmin,
  errorWrap(pitchFeedbackController.deletePitchFeedback),
);

export default router;
