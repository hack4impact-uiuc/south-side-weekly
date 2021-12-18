import { buildPath } from '../utils';
import { pitchFeedbackBody } from '../schemas/pitchFeedback';

export const updatePitchFeedback = buildPath({
  method: 'PUT',
  model: 'PitchFeedback',
  opId: 'updatePitchFeedback',
  description: 'Updates a pitch feedback with data in the body',
  params: [{ name: 'id', description: 'The id of the pitch feedback' }],
  body: {
    description: 'The data to update the pitch feedback with',
    schema: {
      type: 'object',
      properties: {
        ...pitchFeedbackBody,
      },
    },
  },
});
