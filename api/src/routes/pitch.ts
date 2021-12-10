import { Router } from 'express';

import { errorWrap } from '../middleware';
import * as pitchController from '../controllers/pitch.controller';
import {
  requireAdmin,
  requireRegistered,
  requireStaff,
} from '../middleware/auth';

const router = Router();

// GET /api/pitches
router.get('/', requireRegistered, errorWrap(pitchController.getPitches));

// GET /api/pitches/pending
router.get(
  '/pending',
  requireAdmin,
  errorWrap(pitchController.getPendingPitches),
);

// GET /api/pitches/approved
router.get(
  '/approved',
  requireRegistered,
  errorWrap(pitchController.getApprovedPitches),
);

// GET /api/pitches/pendingClaims
router.get(
  '/pendingClaims',
  requireStaff,
  errorWrap(pitchController.getPitchesWithPendingClaims),
);

// GET /api/pitches/:id
router.get('/:id', requireRegistered, errorWrap(pitchController.getPitch));

// POST /api/pitches
router.post('/', requireRegistered, errorWrap(pitchController.createPitch));

// PUT /api/pitches/:id
router.put('/:id', requireRegistered, errorWrap(pitchController.updatePitch));

// PUT /api/pitches/:id/approve
router.put(
  '/:id/approve',
  requireAdmin,
  errorWrap(pitchController.approvePitch),
);

// PUT /api/pitches/:id/decline
router.put(
  '/:id/decline',
  requireAdmin,
  errorWrap(pitchController.declinePitch),
);

// PUT /api/pitches/:id/submitClaim
router.put(
  '/:id/submitClaim',
  requireRegistered,
  errorWrap(pitchController.submitClaim),
);

// DELETE /api/pitches/:id
router.delete(
  '/:id',
  requireRegistered,
  errorWrap(pitchController.deletePitch),
);

export default router;
