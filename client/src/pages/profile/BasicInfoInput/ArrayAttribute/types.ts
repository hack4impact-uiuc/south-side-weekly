import { DropdownProps, DropdownItemProps } from 'semantic-ui-react';

export interface IArrayAttribute {
  label: string;
  value: string[];
  options: DropdownItemProps[];
  onChange?: (
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps,
  ) => void;
  onAddItem?: (
    event: React.KeyboardEvent<HTMLElement>,
    data: DropdownProps,
  ) => void;
  viewable: boolean;
  editable: boolean;
}
