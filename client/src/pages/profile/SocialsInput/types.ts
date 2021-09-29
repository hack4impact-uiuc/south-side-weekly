import { InputProps, SemanticICONS } from 'semantic-ui-react';

interface InputOnChangeData extends InputProps {
  value: string;
}

export interface ISocialsInput {
  icon: SemanticICONS;
  value: string;
  disabled: boolean;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData,
  ) => void;
  viewable: boolean;
}
