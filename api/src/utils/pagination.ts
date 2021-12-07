import { Document, Query } from 'mongoose';
import { Request } from 'express';
import { isArray } from 'lodash';

const processFilters = <T extends Document<any>>(
  req: Request,
  query: Query<T[], T, Record<string, unknown>>,
): void => {
  type valueType = typeof req.query.value;
  type queryFilter = Record<string, valueType | Record<string, valueType>>;
  const filters: queryFilter = {};
  const excludedFields = ['activity', 'limit', 'page', 'sortBy', 'sortDirection']
  
  if (req.query.activity) {
    const activity = req.query.activity as string;
    const now = new Date();

    const ACTIVE_PERIOD = 3;
    const ActiveCutoff = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth() - ACTIVE_PERIOD - 1,
      now.getUTCDate(),
    );
    const RecentlyActiveCutoff = new Date(
      now.getUTCFullYear() - 1,
      now.getUTCMonth(),
      now.getUTCDate(),
    );

    if (activity === 'Active') {
      query.find({ lastActive: { $gte: ActiveCutoff } } as any);
    } else if (activity === 'Recently Active') {
      query.find({
        lastActive: { $gte: RecentlyActiveCutoff, $lt: ActiveCutoff },
      } as any);
    } else {
      query.find({ lastActive: { $lt: RecentlyActiveCutoff } } as any);
    }
  }

  const queryParams = Object.keys(req.query).filter((key) =>
    !excludedFields.includes(key),
  );

  queryParams.forEach((key) => {
    const query = req.query[key];
    if (isArray(query)) {
      filters[key] = { $all: query };
    } else {
      filters[key] = query;
    }
  });

  if (Object.keys(filters).length) {
    //TODO: type should be more specific than 'any'
    query.find(filters as any);
  }
};

const processPagination = <T extends Document<any>>(
  req: Request,
  query: Query<T[], T, Record<string, unknown>>,
): void => {
  if (req.query.page && req.query.limit) {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    const sortBy = req.query.sortBy as string;
    const sortDirection = req.query.sortDirection as string;

    if (sortBy) {
      query.sort({ sortBy: sortDirection });
    }

    const skipIndex = page * limit;
    query.limit(limit).skip(skipIndex);
  }
};

export { processFilters, processPagination };
