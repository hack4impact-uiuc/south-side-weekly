import _, { isEmpty } from 'lodash';
import { FilterQuery } from 'mongoose';

export const extractPopulateQuery = (
  query: Record<string, unknown>,
): 'none' | 'default' | 'full' => {
  if (!query.populate) {
    return 'none';
  }

  const populate = query.populate as string;

  switch (populate) {
    case 'default':
    case 'full':
      return populate;
    default:
      return 'default';
  }
};

type PaginateParameters = { limit: number; offset: number };

export const extractPaginateQuery = (
  query: Record<string, unknown>,
): PaginateParameters => {
  const limit = extractLimit(query);
  const offset = extractOffset(query);

  return { limit, offset };
};

export const extractLimit = (query: Record<string, unknown>): number => {
  if (!query.limit) {
    return 0;
  }

  const limit = query.limit as string;

  if (isNaN(Number(limit))) {
    return 0;
  }

  return Number(limit);
};

export const extractOffset = (query: Record<string, unknown>): number => {
  if (!query.offset) {
    return 0;
  }

  const offset = query.offset as string;

  if (isNaN(Number(offset))) {
    return 0;
  }

  return Number(offset);
};

export const extractSortQuery = (
  query: Record<string, unknown>,
): Record<string, OrderBy> => {
  const sortyBy = extractSortBy(query);
  const orderBy = extractOrderBy(query);

  if (!sortyBy) {
    return {};
  }
  return { [sortyBy]: orderBy };
};

export const extractSortBy = (
  query: Record<string, unknown>,
): string | null => {
  if (!query.sortBy) {
    return null;
  }

  return query.sortBy as string;
};

type OrderBy = 'asc' | 'desc' | '1' | '-1' | '0' | 'ascending' | 'descending';

const isValidOrderBy = (orderBy: unknown): orderBy is OrderBy =>
  orderBy === 'asc' ||
  orderBy === 'desc' ||
  orderBy === '1' ||
  orderBy === '-1' ||
  orderBy === '0' ||
  orderBy === 'ascending' ||
  orderBy === 'descending';

export const extractOrderBy = (
  query: Record<string, unknown>,
): OrderBy | null => {
  if (!isValidOrderBy(query.orderBy)) {
    return null;
  }

  return query.orderBy;
};

const takenKeys = ['limit', 'offset', 'populate', 'sortBy', 'orderBy'];

export const extractFilterQuery = <T>(
  query: Record<string, unknown>,
): FilterQuery<T> | null => {
  Object.keys(query).forEach((key) => {
    if (isEmpty(query[key])) {
      delete query[key];
    }
  });

  return _.omit(query, takenKeys, null, undefined, '');
};
