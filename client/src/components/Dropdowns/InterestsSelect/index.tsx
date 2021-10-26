import React, { FC, ReactElement } from 'react';
import { MultiValue, ActionMeta } from 'react-select';

import MultiSelect from '../MultiSelect';
import { useInterests } from '../../../contexts';

interface InterestsSelectProps {
    onChange: (
        newValue: MultiValue<{
            value: string;
            label: string;
        }>,
        actionMeta: ActionMeta<{
            value: string;
            label: string;
        }>,
      ) => void;
      values: string[];
    }

const InterestsSelect: FC<InterestsSelectProps> = ({ onChange, values }): ReactElement => {


    const { interests } = useInterests();

    return (
        <MultiSelect
            options={interests.map(interest => ({
                value: interest._id,
                label: interest.name
            }))}
            placeholder="Interests"
            onChange={onChange}
            value={values}
        />
    );
};

export default InterestsSelect;