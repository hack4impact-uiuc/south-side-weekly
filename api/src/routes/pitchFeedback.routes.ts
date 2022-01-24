import { Router } from 'express';

import { errorWrap } from '../middleware';
import { PitchFeedbackController } from '../controllers';
import { requireAdmin, requireRegistered } from '../middleware/auth';

const router = Router();

// GET /api/pitchFeedback
router.get(
  '/',
  requireAdmin,
  errorWrap(PitchFeedbackController.getAllPitchFeedback),
);

// GET /api/pitchFeedback/:id
router.get(
  '/:id',
  requireAdmin,
  errorWrap(PitchFeedbackController.getPitchFeedback),
);

// GET /api/pitchFeedback/pitch/:id
router.get(
  '/pitch/:id',
  requireAdmin,
  errorWrap(PitchFeedbackController.getFeedbackForPitch),
);

// GET /api/pitchFeedback/:pitchId/:userId
router.get(
  '/:pitchId/:userId',
  requireAdmin,
  errorWrap(PitchFeedbackController.getPitchFeedbackFromUser),
);

// POST /api/pitchFeedback
router.post(
  '/',
  requireRegistered,
  errorWrap(PitchFeedbackController.createPitchFeedback),
);

// PUT /api/pitchFeedback/:id
router.put(
  '/:id',
  requireRegistered,
  errorWrap(PitchFeedbackController.updatePitchFeedback),
);

// DELETE /api/pitchFeedback/:id
router.delete(
  '/:id',
  requireAdmin,
  errorWrap(PitchFeedbackController.deletePitchFeedback),
);

export default router;
