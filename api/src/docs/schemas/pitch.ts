import {
  assignmentStatusEnum,
  editStatusEnum,
  issueStatusEnum,
  pitchStatusEnum,
} from '../../utils/enums';
import { extractRefPath } from '../utils';
import { buildSchema } from './utils';

export const pitchBody = {
  title: {
    type: 'string',
    description: 'The title of the pitch.',
  },
  issues: {
    type: 'array',
    description: 'The issues that the pitch is for.',
    items: {
      $ref: extractRefPath('Issue'),
    },
  },
  author: {
    type: 'string',
    description: 'The id of the user who submitted the pitch.',
    $ref: extractRefPath('User'),
  },
  primaryEditor: {
    type: 'string',
    description: 'The id of the user who is the primary editor of the pitch.',
    $ref: extractRefPath('User'),
  },
  secondEditors: {
    type: 'array',
    description: 'The id of the users who are second editors of the pitch.',
    items: {
      $ref: extractRefPath('User'),
    },
  },
  thirdEditors: {
    type: 'array',
    description: 'The id of the users who are second editors of the pitch.',
    items: {
      $ref: extractRefPath('User'),
    },
  },
  writer: {
    type: 'string',
    description: 'The id of the user who is the writer of the pitch.',
    $ref: extractRefPath('User'),
  },
  conflictOfInterest: {
    type: 'string',
    description:
      'This is a boolean that indicates if the author of this pitch has a conflict of interest.',
  },
  status: {
    type: 'string',
    description: 'The status of the pitch.',
    enum: Object.values(pitchStatusEnum),
  },
  description: {
    type: 'string',
    description: 'The description of the pitch.',
  },
  assignmentStatus: {
    type: 'string',
    description: 'The status of the pitch.',
    enum: Object.values(assignmentStatusEnum),
  },
  assignmentGoogleDocLink: {
    type: 'string',
    description: 'The link to the google doc that contains the assignment.',
  },
  assignmentContributors: {
    userId: {
      type: 'string',
      description: 'The id of the user who is contributing to the assignment.',
      $ref: extractRefPath('User'),
    },
    teams: {
      type: 'array',
      description: 'The teams that the user is contributing to.',
      items: {
        type: 'string',
        description: 'The id of the team that the user is contributing to.',
        $ref: extractRefPath('Team'),
      },
    },
  },
  pendingContributors: {
    userId: {
      type: 'string',
      description: 'The id of the user who is contributing to the assignment.',
      $ref: extractRefPath('User'),
    },
    teams: {
      type: 'array',
      description: 'The teams that the user is contributing to.',
      items: {
        type: 'string',
        description: 'The id of the team that the user is contributing to.',
        $ref: extractRefPath('Team'),
      },
    },
    message: {
      type: 'string',
      description:
        'The reasoning the user submits for wanting to contribute to the pitch',
    },
    dateSubmitted: {
      type: 'string',
      description: 'The date the user submitted the request.',
    },
  },
  topics: {
    type: 'array',
    description: 'The topics that the pitch is for.',
    items: {
      $ref: extractRefPath('Interest'),
    },
  },
  teams: {
    type: 'array',
    description:
      'The teams that the pitch needs along with the the target number of members needed on that team that are left.',
    items: {
      teamId: {
        type: 'string',
        description: 'The id of the team that the pitch needs.',
        $ref: extractRefPath('Team'),
      },
      target: {
        type: 'number',
        description: 'The target number of members that the still team needs.',
      },
    },
  },
  reviewedBy: {
    type: 'array',
    description: 'The users who have reviewed the pitch.',
    items: {
      $ref: extractRefPath('User'),
    },
  },
  deadline: {
    type: 'string',
    description: 'The deadline that this pitch is due.',
  },
  neighborhoods: {
    type: 'array',
    description: 'The neighborhoods that the pitch is for.',
    items: {
      type: 'string',
      description: 'The name of the neighborhood that the pitch is for.',
    },
  },
  issueStatuses: {
    type: 'array',
    description:
      'The issues that are on the pitch and the corresponding statuses on those issues',
    items: {
      issueId: {
        type: 'string',
        description: 'The id of the issue that the pitch is for.',
        $ref: extractRefPath('Issue'),
      },
      issueStats: {
        type: 'string',
        description: 'The status of the issue.',
        enum: Object.values(issueStatusEnum),
      },
    },
  },
  editStatus: {
    type: 'string',
    description: 'The edit status of the pitch.',
    enum: Object.values(editStatusEnum),
  },
  createdAt: {
    type: 'string',
    description: 'The date that the pitch was created.',
  },
  updatedAt: {
    type: 'string',
    description: 'The date that the pitch was last updated.',
  },
};

export const pitchSchema = buildSchema(pitchBody, [
  'title',
  'author',
  'description',
  'conflictOfInterest',
]);
