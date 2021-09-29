import { InputProps } from 'semantic-ui-react';

interface InputOnChangeData extends InputProps {
  value: string;
}

export interface IStringAttribute {
  label: string;
  value: string;
  disabled: boolean;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData,
  ) => void;
  viewable: boolean;
}
