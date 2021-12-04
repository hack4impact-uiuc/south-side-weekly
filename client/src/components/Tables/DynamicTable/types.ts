import { ReactNode } from 'react';
import { SemanticWIDTHS } from 'semantic-ui-react';

export interface DynamicColumn<RecordType> {
  title: ReactNode;
  width?: SemanticWIDTHS;
  sorter?: (a: RecordType, b: RecordType) => number;
  extractor: keyof RecordType | ((record: RecordType) => ReactNode);
}

export type SortDirection = 'ascending' | 'descending';

export type Sort<Column> = {
  column: Column;
  direction: SortDirection;
};

export type View<
  RecordType,
  Column extends DynamicColumn<RecordType> = DynamicColumn<RecordType>,
> = {
  records: RecordType[];
  columns: Column[];
  initialSort?: Sort<Column>;
};
