import { DynamicColumn } from '../..';
import { PaginationResponseBase, Response } from '../../../api/types';
import { DynamicTableProps } from '../DynamicTable';

type InvalidPaginatedDynamicTableProps = 'footer' | 'view' | 'onHeaderClick';
type UseableDynamicTableProps<
  RecordType,
  Column extends DynamicColumn<RecordType>,
> = Omit<
  DynamicTableProps<RecordType, Column>,
  InvalidPaginatedDynamicTableProps
>;

type InvalidDynamicColumnProps = 'sorter';
interface PaginatedColumn<RecordType>
  extends Omit<DynamicColumn<RecordType>, InvalidDynamicColumnProps> {
  key?: keyof RecordType;
}

interface PaginationQueryArgs {
  sortBy?: string[];
  sortDirection?: string[];
  page?: string[];
  limit?: string[];
}

type QueryFunction<RecordType, QueryArgs> = (
  params: QueryArgs & PaginationQueryArgs,
) => Promise<Response<PaginationResponseBase<RecordType[]>>>;

export type {
  PaginatedColumn,
  PaginationQueryArgs,
  QueryFunction,
  UseableDynamicTableProps,
};
