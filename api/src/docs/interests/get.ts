import { buildPath } from '../utils';

export const getInterests = buildPath({
  method: 'GET',
  model: 'Interest',
  opId: 'getInterests',
  description: 'Gets all interests',
});

export const getInterest = buildPath({
  method: 'GET',
  model: 'Interest',
  opId: 'getInterest',
  description: 'Gets an interest by id',
  params: [
    {
      name: 'id',
      description: 'The id of the interest to get',
    },
  ],
});
