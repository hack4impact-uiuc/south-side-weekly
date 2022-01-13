import { buildPath, extractRefPath } from '../utils';
import { issueBody } from '../schemas/issue';
import { issueStatusEnum } from '../../utils/enums';

export const updateIssue = buildPath({
  method: 'PUT',
  model: 'Issue',
  opId: 'updateIssue',
  description: 'Updates a issue with data in the body',
  params: [{ name: 'id', description: 'The id of the issue' }],
  body: {
    description: 'The data to update the issue with',
    schema: {
      type: 'object',
      properties: {
        ...issueBody,
      },
    },
  },
});

export const updateIssueStatus = buildPath({
  method: 'PUT',
  model: 'Issue',
  opId: 'updateIssueStatus',
  description: 'Updates a issue with data in the body',
  params: [{ name: 'pitchId', description: 'The id of the pitch' }],
  body: {
    description: 'The data to update the issue with',
    schema: {
      type: 'object',
      properties: {
        issueId: {
          type: 'string',
          $ref: extractRefPath('Issue'),
        },
        issueStatus: {
          type: 'string',
          enum: Object.values(issueStatusEnum),
        },
      },
    },
  },
});
