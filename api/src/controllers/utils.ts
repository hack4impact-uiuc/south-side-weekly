import _, { isEmpty } from 'lodash';
import { FilterQuery } from 'mongoose';
import { PaginateOptions } from '../services/types';

export const extractPopulateQuery = (
  query: Record<string, unknown>,
): 'none' | 'default' | 'full' => {
  console.log(query);
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

export const extractOptions = <T>(
  query: Record<string, unknown>,
): PaginateOptions<T> => ({
  limit: extractLimit(query),
  offset: extractOffset(query),
  sort: extractSortQuery(query),
  filters: extractFilterQuery(query),
  search: extractSearchQuery(query),
});

const extractLimit = (query: Record<string, unknown>): number => {
  if (!query.limit) {
    return 0;
  }

  const limit = query.limit as string;

  if (isNaN(Number(limit))) {
    return 0;
  }

  return Number(limit);
};

const extractOffset = (query: Record<string, unknown>): number => {
  if (!query.offset) {
    return 0;
  }

  const offset = query.offset as string;

  if (isNaN(Number(offset))) {
    return 0;
  }

  return Number(offset);
};

const extractSortQuery = (
  query: Record<string, unknown>,
): Record<string, OrderBy> => {
  const sortyBy = extractSortBy(query);
  const orderBy = extractOrderBy(query);

  if (!sortyBy) {
    return {};
  }
  return { [sortyBy]: orderBy };
};

const extractSortBy = (query: Record<string, unknown>): string | null => {
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

const extractOrderBy = (query: Record<string, unknown>): OrderBy | null => {
  if (!isValidOrderBy(query.orderBy)) {
    return null;
  }

  return query.orderBy;
};

export const extractSearchQuery = (query: Record<string, unknown>): string => {
  if (!query.search) {
    return '';
  }

  return query.search as string;
};

const takenKeys = [
  'limit',
  'offset',
  'populate',
  'sortBy',
  'orderBy',
  'search',
];

const extractFilterQuery = <T>(
  query: Record<string, unknown>,
): FilterQuery<T> | null => {
  const copyQuery = { ...query };
  Object.keys(copyQuery).forEach((key) => {
    if (
      isEmpty(copyQuery[key]) ||
      copyQuery[key] === 'null' ||
      copyQuery[key] === 'undefined' ||
      takenKeys.includes(key)
    ) {
      delete copyQuery[key];
    }
  });

  const cleanFilters = Object.keys(copyQuery).map((filter) => {
    const [field, operator] = filter.split('__');
    let value = copyQuery[filter];

    if (typeof value === 'string' && value.includes(',')) {
      value = value.split(',');
    }

    if (operator) {
      return { [field]: { [`$${operator}`]: value } };
    }

    return { [field]: value };
  });

  const filters = _.merge({}, ...cleanFilters);

  return filters;
};
