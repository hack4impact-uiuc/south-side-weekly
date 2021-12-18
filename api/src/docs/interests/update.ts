import { interestBody } from '../schemas/interest';
import { buildPath } from '../utils';

export const updateInterest = buildPath({
  method: 'PUT',
  model: 'Interest',
  opId: 'updateInterest',
  description: 'Updates an interest by id',
  params: [
    {
      name: 'id',
      description: 'The id of the interest to update',
    },
  ],
  body: {
    description: 'The data to update the interest with',
    schema: {
      type: 'object',
      properties: {
        ...interestBody,
      },
    },
  },
});

export const updateManyInterests = buildPath({
  method: 'PUT',
  model: 'Interest',
  opId: 'updateManyInterests',
  description: 'Updates many interests with data in the body',
  body: {
    description: 'The data to update the interests with',
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
