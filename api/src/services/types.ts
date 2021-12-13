import { FilterQuery } from 'mongoose';

export interface PaginateOptions<T> {
  offset: number;
  limit: number;
  sort: Record<string, unknown>;
  filters: FilterQuery<T>;
}
