import { buildPath } from '../utils';
import { pitchFeedbackBody } from '../schemas/pitchFeedback';

export const createPitchFeedback = buildPath({
  method: 'POST',
  model: 'PitchFeedback',
  opId: 'createPitchFeedback',
  description: 'Creates a pitch feedback with data in the body',
  body: {
    description: 'The data to create the pitch feedback with',
    schema: {
      type: 'object',
      properties: {
        ...pitchFeedbackBody,
      },
    },
  },
});
