import { ReactNode } from 'react';
import { SemanticWIDTHS } from 'semantic-ui-react';

export interface ColumnType<RecordType> {
  title: ReactNode;
  width?: SemanticWIDTHS;
  sorter?: (a: RecordType, b: RecordType) => number;
  extractor: keyof RecordType | ((record: RecordType) => ReactNode);
}

export type SortDirection = 'ascending' | 'descending';
