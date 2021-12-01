import { ColumnType } from './types';

export const buildColumn = <T>({
  title,
  width,
  sorter,
  extractor,
}: ColumnType<T>): ColumnType<T> => ({
  title: title,
  width: width,
  sorter: sorter,
  extractor: extractor,
});
