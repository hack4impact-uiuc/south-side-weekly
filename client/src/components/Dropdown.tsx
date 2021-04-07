import React, { FC, ReactElement } from 'react';
import { Dropdown as SemanticDropDown } from 'semantic-ui-react';

import '../css/Dropdown.css';

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
  defaultValue?: string;
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
  text = 'Dropdown',
  options = [],
  defaultValue = '',
}): ReactElement => (
  <SemanticDropDown
    className="custom-dropdown"
    text={text}
    options={parseOptionsToSemantic(options)}
    defaultValue={defaultValue}
    scrolling
  />
);

export default Dropdown;
