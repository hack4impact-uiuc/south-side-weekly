import { buildPath } from '../utils';
import { issueBody } from '../schemas/issue';

export const createIssue = buildPath({
  method: 'POST',
  model: 'Issue',
  opId: 'createIssue',
  description: 'Creates a issue with data in the body.',
  body: {
    description: 'The data to create the issue with.',
    schema: {
      type: 'object',
      properties: {
        ...issueBody,
      },
    },
  },
});
