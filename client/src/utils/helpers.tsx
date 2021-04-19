import { MouseEvent, Dispatch, SetStateAction } from 'react';

/**
 * Adds selected element to the specific form array if it isn't already there, otherwise removes it
 *
 * @param e the MouseEvent of clicking the select button
 * @param selectedArray the selected array to check from
 * @param setArray React setter for the selected array
 */
const handleSelectGroupArray = (
  e: MouseEvent<HTMLButtonElement>,
  selectedArray: Array<string>,
  setArray: Dispatch<SetStateAction<Array<string>>>,
): void => {
  const notFoundIdx = -1;
  const elementIdx = selectedArray.indexOf(e.currentTarget.value);

  if (elementIdx === notFoundIdx) {
    const addedElements = selectedArray.concat(e.currentTarget.value);

    setArray(addedElements);
  } else {
    const removedElements = selectedArray.filter(
      (element) => element !== e.currentTarget.value,
    );

    setArray(removedElements);
  }
};

interface ISemanticDropdownOptions {
  key: number;
  text: string;
  value: string;
}

const parseArrayToSemanticDropdownOptions = (
  arr: string[],
): ISemanticDropdownOptions[] => {
  const semanticOptions: ISemanticDropdownOptions[] = [];

  for (let count = 0; count < arr.length; ++count) {
    const newOption: ISemanticDropdownOptions = {
      key: count + 1,
      text: arr[count],
      value: arr[count],
    };

    semanticOptions.push(newOption);
  }

  return semanticOptions;
};

export { handleSelectGroupArray, parseArrayToSemanticDropdownOptions };
