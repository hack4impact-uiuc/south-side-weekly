import { DropdownProps, DropdownItemProps } from 'semantic-ui-react';

export interface ISelectAttribute {
  label: string;
  value: string;
  options: DropdownItemProps[];
  onChange?: (
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps,
  ) => void;
  viewable: boolean;
  editable: boolean;
}
