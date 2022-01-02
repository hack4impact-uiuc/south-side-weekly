import { Router } from 'express';

import { errorWrap } from '../middleware';
import { PitchController } from '../controllers';
import {
  requireAdmin,
  requireRegistered,
  requireStaff,
} from '../middleware/auth';

const router = Router();

// GET /api/pitches
router.get('/', requireRegistered, errorWrap(PitchController.getPitches));

// GET /api/pitches/pending
router.get(
  '/pending',
  requireAdmin,
  errorWrap(PitchController.getPendingPitches),
);

// GET /api/pitches/approved
router.get(
  '/approved',
  requireRegistered,
  errorWrap(PitchController.getApprovedPitches),
);

// GET /api/pitches/pendingClaims
router.get(
  '/pendingClaims',
  requireStaff,
  errorWrap(PitchController.getPitchesWithPendingClaims),
);

router.get(
  '/claimable/:userId',
  requireRegistered,
  errorWrap(PitchController.getClaimablePitches),
);

// GET /api/pitches/:id
router.get('/:id', requireRegistered, errorWrap(PitchController.getPitch));

// POST /api/pitches
router.post('/', requireRegistered, errorWrap(PitchController.createPitch));

// PUT /api/pitches/:id
router.put('/:id', requireRegistered, errorWrap(PitchController.updatePitch));

// PUT /api/pitches/:id/approve
router.put(
  '/:id/approve',
  requireAdmin,
  errorWrap(PitchController.approvePitch),
);

// PUT /api/pitches/:id/decline
router.put(
  '/:id/decline',
  requireAdmin,
  errorWrap(PitchController.declinePitch),
);

// PUT /api/pitches/:id/submitClaim
router.put(
  '/:id/submitClaim',
  requireRegistered,
  errorWrap(PitchController.submitClaim),
);

// PUT /api/pitches/:id/teamTarget
router.put(
  '/:id/teamTarget',
  requireRegistered,
  errorWrap(PitchController.updateTeamTarget),
);

// PUT /api/pitches/:id/approveClaim
router.put(
  '/:id/approveClaim',
  requireStaff,
  errorWrap(PitchController.approveClaimRequest),
);

// PUT /api/pitches/:id/changeEditor
router.put(
  '/:id/changeEditor',
  requireStaff,
  errorWrap(PitchController.changeEditor),
);

// PUT /api/pitches/:id/addContributor
router.put(
  '/:id/addContributor',
  requireStaff,
  errorWrap(PitchController.addContributor),
);

// PUT /api/pitches/:id/removeContributor
router.put(
  '/:id/removeContributor',
  requireStaff,
  errorWrap(PitchController.removeContributor),
);

// DELETE /api/pitches/:id
router.delete(
  '/:id',
  requireRegistered,
  errorWrap(PitchController.deletePitch),
);

export default router;
