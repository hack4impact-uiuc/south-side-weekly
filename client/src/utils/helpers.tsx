import { MouseEvent, Dispatch, SetStateAction } from 'react';

/**
 * Adds selected element to the specific form array if it isn't already there, otherwise removes it
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

export { handleSelectGroupArray };
