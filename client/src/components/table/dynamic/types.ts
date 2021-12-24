import { ReactNode } from 'react';
import { SemanticWIDTHS } from 'semantic-ui-react';

export interface DynamicColumn<T> {
  title: ReactNode;
  width?: SemanticWIDTHS;
  sorter?: (a: T, b: T) => number;
  extractor: keyof T | ((record: T) => ReactNode);
}

export type SortDirection = 'ascending' | 'descending';

export type Sort<T> = {
  column: T;
  direction: SortDirection;
};

export type View<T, K extends DynamicColumn<T> = DynamicColumn<T>> = {
  records: T[];
  columns: K[];
  initialSort?: Sort<K>;
};
