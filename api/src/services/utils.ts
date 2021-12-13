import { FilterQuery } from 'mongoose';

export const mergeFilters = <T>(
  queryFilters: Record<string, unknown>,
  optionsFilters: FilterQuery<T>,
): FilterQuery<T> => ({
  ...queryFilters,
  ...optionsFilters,
});
