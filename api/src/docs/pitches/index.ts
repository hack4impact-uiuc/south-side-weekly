import {
  getPitchById,
  getPitches,
  getApprovedPitches,
  getPendingPitches,
  getPitchesWithPendingClaims,
} from './get';
import { createPitch } from './post';
import { updatePitch, approvePitch, declinePitch, submitClaim } from './put';
import { deletePitch } from './delete';

export const pitchPaths = {
  '/pitches': {
    ...getPitches,
  },
  '/approved': {
    ...getApprovedPitches,
  },
  '/pending': {
    ...getPendingPitches,
  },
  '/pendingClaims': {
    ...getPitchesWithPendingClaims,
  },
  '/pitches/:id': {
    ...getPitchById,
    ...createPitch,
    ...updatePitch,
    ...deletePitch,
  },
  '/pitches/:id/approve': {
    ...approvePitch,
  },
  '/pitches/:id/decline': {
    ...declinePitch,
  },
  '/pitches/:id/submitClaim': {
    ...submitClaim,
  },
};
