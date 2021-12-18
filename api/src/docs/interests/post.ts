import { interestBody } from '../schemas/interest';
import { buildPath } from '../utils';

export const createInterest = buildPath({
  method: 'POST',
  model: 'Interest',
  opId: 'createInterest',
  description: 'Creates an interest with data in the body',
  body: {
    description: 'The data to create the interest with',
    schema: {
      type: 'object',
      properties: {
        ...interestBody,
      },
    },
  },
});

export const createManyInterests = buildPath({
  method: 'POST',
  model: 'Interest',
  opId: 'createManyInterests',
  description: 'Creates many interests with data in the body',
  body: {
    description: 'The data to create the interests with',
    schema: {
      type: 'object',
      properties: {
        interests: {
          type: 'array',
          items: {
            ...interestBody,
          },
        },
      },
    },
  },
});
