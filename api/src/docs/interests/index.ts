import { getInterest, getInterests } from './get';
import { updateInterest, updateManyInterests } from './put';
import { createInterest, createManyInterests } from './post';

export const interestPaths = {
  '/interests': {
    ...getInterests,
    ...updateManyInterests,
    ...createManyInterests,
    ...createInterest,
  },
  '/interests/{id}': {
    ...updateInterest,
    ...getInterest,
  },
};
