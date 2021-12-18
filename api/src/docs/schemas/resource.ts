import { visibilityEnum } from '../../utils/enums';
import { buildSchema } from './utils';

export const resourceBody = {
  name: {
    type: 'string',
    description: 'The name of the resource. It must be unique.',
    example: 'Coding',
  },
  link: {
    type: 'string',
    description: 'The link to the resource. It must be unique.',
    example: 'https://www.google.com',
  },
  teams: {
    type: 'array',
    description: 'The teams the resource is a member of.',
    items: {
      type: 'string',
      $ref: '#/components/schemas/Team',
    },
  },
  isGeneral: {
    type: 'boolean',
    description: 'Whether the resource is general or not.',
    example: true,
  },
  visibility: {
    type: 'string',
    enum: Object.values(visibilityEnum),
    default: visibilityEnum.PRIVATE,
    required: true,
  },
  createdAt: {
    type: 'string',
    description: 'The date that the resource was created.',
  },
  updatedAt: {
    type: 'string',
    description: 'The date that the resource was last updated.',
  },
};

export const resourceSchema = buildSchema(resourceBody, ['name', 'link']);
