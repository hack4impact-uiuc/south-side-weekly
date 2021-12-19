import { PaginatedColumn } from './types';

export const buildPaginatedColumn = <T>({
  title,
  width,
  extractor,
  key,
}: PaginatedColumn<T>): PaginatedColumn<T> => ({
  title,
  width,
  extractor,
  key,
});
