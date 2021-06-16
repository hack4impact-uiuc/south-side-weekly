import { InputProps, SemanticICONS } from 'semantic-ui-react';

interface InputOnChangeData extends InputProps {
  value: string;
}

export interface ISocialsInput {
  icon: SemanticICONS;
  value: string;
  readOnly: boolean;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData,
  ) => void;
}
