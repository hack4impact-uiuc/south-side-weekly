import React, { FC, ReactElement } from 'react';
import { IUser } from 'ssw-common';
import { Input } from 'semantic-ui-react';

interface IBasicInfoInput {
  label: keyof IUser;
  value: string;
  isEditMode: boolean;
  updateUserField: <T extends keyof IUser>(key: T, value: IUser[T]) => void;
}

const BasicInfoInput: FC<IBasicInfoInput> = ({
  label,
  value,
  isEditMode,
  updateUserField,
}): ReactElement => {
  const parseCamelCase = (str: string): string => {
    const split = str.replace(/([a-z])([A-Z])/g, '$1 $2');
    return split.charAt(0).toUpperCase() + split.slice(1);
  };

  return (
    <div className="input-field">
      <span>{`${parseCamelCase(label)}:`}</span>
      <Input
        value={value}
        transparent
        readOnly={!isEditMode}
        onChange={(e) => updateUserField(label, e.currentTarget.value)}
      />
    </div>
  );
};

export default BasicInfoInput;
