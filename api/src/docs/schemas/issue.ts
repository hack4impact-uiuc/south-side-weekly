import { issueTypeEnum } from '../../utils/enums';
import { buildSchema } from './utils';

export const issueBody = {
  deadlineDate: {
    type: 'string',
    description: 'The deadline date of the issue.',
    example: '2020-01-01T00:00:00.000Z',
  },
  releaseDate: {
    type: 'string',
    description: 'The release date of the issue.',
    example: '2020-01-01T00:00:00.000Z',
  },
  pitches: {
    type: 'array',
    description: 'The pitches associated with the issue.',
    items: {
      type: 'string',
      description: 'The id of the pitch.',
    },
  },
  type: {
    type: 'string',
    enum: Object.values(issueTypeEnum),
  },
};

export const issueSchema = buildSchema(issueBody, [
  'deadlineDate',
  'releaseDate',
  'type',
]);
