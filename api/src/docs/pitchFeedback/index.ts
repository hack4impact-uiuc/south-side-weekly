import {
  getPitchFeedbackById,
  getPitchFeedbacks,
  getFeedbackForPitch,
} from './get';
import { createPitchFeedback } from './post';
import { updatePitchFeedback } from './put';
import { deletePitchFeedback } from './delete';

export const pitchFeedbackPaths = {
  '/pitchFeedback': {
    ...getPitchFeedbacks,
  },
  '/pitchFeedback/:id': {
    ...getPitchFeedbackById,
    ...createPitchFeedback,
    ...updatePitchFeedback,
    ...deletePitchFeedback,
  },
  '/pitchFeedback/pitch/:id': {
    ...getFeedbackForPitch,
  },
};
