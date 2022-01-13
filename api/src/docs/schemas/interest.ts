// Swagger Interest schema

import { buildSchema } from './utils';

export const interestBody = {
  name: {
    type: 'string',
    description: 'The name of the interest.',
    example: 'Coding',
  },
  active: {
    type: 'boolean',
    description: 'Whether the interest is active or not.',
    example: true,
  },
  color: {
    type: 'string',
    description: 'The color of the interest. Stored as a hexcode',
    example: '#FF0000',
  },
};

export const interestSchema = buildSchema(
  interestBody,
  Object.keys(interestBody),
);
