import React, { FC, ReactElement, MouseEvent, useState } from 'react';
import { Button } from 'semantic-ui-react';

import CheckSVG from '../../assets/check.svg';
import '../../css/WizardSelectButton.css';

interface IProps {
  onClick(e: MouseEvent<HTMLButtonElement>): void;
  selectedArray: Array<string>;
  color: string;
  value: string;
  width?: string;
  height?: string;
  margin?: string;
  padding?: string;
  buttonText?: string;
  clickedIcon?: string;
  disabled?: boolean;
}

const NOT_FOUND_IDX = -1;

/**
 *
 * @param {(e: MouseEvent<HTMLButtonElement) : void} onClick the function to execute when button is clicked
 * @param {Array<string>} selectedArray the array of elements that the button corresopnds to
 * @param {string} color the background color that the button should be set to
 * @param {string} value the value of the button
 * @param {string} width the width of the button; default will fit the content of the button
 * @param {string} height the height of the button; dfeault will fit the content of the button
 * @param {string} margin the margin to place around the button
 * @param {string} padding
 * @param {string} buttonText
 * @param {string} clickedIcon
 * @param {boolean} disabled
 */
const WizardSelectButton: FC<IProps> = ({
  onClick,
  selectedArray,
  color,
  value,
  width = 'fit-content',
  height = 'fit-content',
  margin = 'none',
  padding = 'none',
  buttonText = value,
  clickedIcon = CheckSVG,
  disabled = false,
}): ReactElement => {
  const [selected, setSelected] = useState<boolean>(false);

  React.useEffect(() => {
    setSelected(selectedArray.indexOf(value) !== NOT_FOUND_IDX);
  }, [selectedArray, value]);

  return (
    <div style={{ margin: margin }} className="select-wrapper">
      <Button
        style={{
          backgroundColor: color,
          width: width,
          height: height,
          padding: padding,
        }}
        onClick={onClick}
        value={value}
        className="select-btn"
        disabled={disabled}
      >
        {buttonText}
      </Button>
      <img
        src={clickedIcon}
        alt="checked"
        className={`selected-icon ${selected && 'active'}`}
      />
    </div>
  );
};

export default WizardSelectButton;
