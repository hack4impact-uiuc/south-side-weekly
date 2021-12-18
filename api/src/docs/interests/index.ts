import { getInterest, getInterests } from './get';
import { updateInterest, updateManyInterests } from './update';
import { createInterest, createManyInterests } from './create';

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
