import React, { FC, ReactElement } from 'react';
import { Dropdown as SemanticDropDown } from 'semantic-ui-react';

interface IOptions {
  text: string;
  color: string;
}

interface ISemanticOptions {
  key: number;
  text: string;
  value: number;
}

interface IProps {
  text?: string;
  options?: Array<IOptions>;
  multiple?: boolean;
  width?: string | number;
}

const parseOptionsToSemantic = (
  options: Array<IOptions>,
): Array<ISemanticOptions> => {
  const parsedOptions: Array<ISemanticOptions> = [];
  let countLooped = 1;
  options.map((option) => {
    const semanticOption: ISemanticOptions = {
      key: countLooped,
      text: option.text,
      value: countLooped,
    };
    parsedOptions.push(semanticOption);
    ++countLooped;
  });
  return parsedOptions;
};

const Dropdown: FC<IProps> = ({
  text = 'Dropdwon',
  options = [],
  multiple = false,
  width = 'fit-content',
}): ReactElement => (
  <SemanticDropDown
    text={text}
    options={parseOptionsToSemantic(options)}
    multiple={multiple}
    simple
    item
    style={{ width: width }}
  />
);

export default Dropdown;
