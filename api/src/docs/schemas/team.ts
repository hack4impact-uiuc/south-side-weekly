// Swagger Interest schema

import { buildSchema } from './utils';

export const teamBody = {
  name: {
    type: 'string',
    description: 'The name of the team.',
    example: 'Coding',
  },
  active: {
    type: 'boolean',
    description: 'Whether the team is active or not.',
    example: true,
  },
  color: {
    type: 'string',
    description: 'The color of the team. Stored as a hexcode',
    example: '#FF0000',
  },
};

export const teamSchema = buildSchema(teamBody, Object.keys(teamBody));
