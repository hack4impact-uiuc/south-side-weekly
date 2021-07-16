import { InputProps } from 'semantic-ui-react';

interface InputOnChangeData extends InputProps {
  value: string;
}

export interface IDateAttribute {
  label: string;
  value: Date;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData,
  ) => void;
  max?: Date;
  viewable: boolean;
  editable: boolean;
}
