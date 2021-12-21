import { DynamicColumn } from './types';

export const buildColumn = <T>({
  title,
  width,
  sorter,
  extractor,
}: DynamicColumn<T>): DynamicColumn<T> => ({
  title: title,
  width: width,
  sorter: sorter,
  extractor: extractor,
});
