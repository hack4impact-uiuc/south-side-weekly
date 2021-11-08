import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Table } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { AdminView, FieldTag, UserModal, UserPicture, TableTool } from '../..';
import { getUserFullName } from '../../../utils/helpers';

const ROLE_WIDTH = 2;
const ONBOARDING_WIDTH = 2;
const ACTIVITY_WIDTH = 1;
const JOINED_WIDTH = 1;
const EDITED_WIDTH = 1;

interface OnboardingHeaderProps {
    users: IUser[];
    data: IUser[];
    setData: (data: IUser[]) => void;
}

interface ColumnEnumValue {
    title: string;
    sort: (a: IUser, b: IUser) => number;
}

const fullNameSort = (a: IUser, b: IUser): number => {
    const aFullName = getUserFullName(a);
    const bFullName = getUserFullName(b);
  
    return aFullName.localeCompare(bFullName);
};


const dateSort = (a: IUser, b: IUser): number => {
    const first = new Date(a.dateJoined);
    const second = new Date(b.dateJoined);

    return first.getTime() - second.getTime();
};

const columnsEnum: { [key: string]: ColumnEnumValue } = {
    NAME: {
      title: 'NAME',
      sort: fullNameSort,
    },
    REGISTRATION: {
      title: 'REGISTRATION',
      sort: dateSort,
    },
};

const OnboardingHeader: FC<OnboardingHeaderProps> = ({
    users,
    data,
    setData,
}): ReactElement => {
    const [column, setColumn] = useState<ColumnEnumValue>();
    const [direction, setDirection] = useState<'ascending' | 'descending'>();

    const handleSort = (newColumn: ColumnEnumValue): void => {
        if (column?.title === newColumn.title) {
            if (direction === 'ascending') {
            setDirection('descending');
            setData(data.slice().reverse());
            } else if (direction === 'descending') {
            setData(users);
            setDirection(undefined);
            setColumn(undefined);
            } else {
            setDirection('ascending');
            setData(data.slice().reverse());
            }
        } else {
            setColumn(newColumn);
            setDirection('ascending');

            const copy = [...data];
            copy.sort(newColumn.sort);
            setData(copy);
        }
    };
    useEffect(() => {
        setData(users);
    }, [users, setData]);

    return (
        <Table.Row>
            <Table.HeaderCell width={1}/>
            <Table.HeaderCell
                onClick={() => handleSort(columnsEnum.NAME)}
                sorted={column === columnsEnum.NAME ? direction : undefined}
            >
                Name
            </Table.HeaderCell>
            <Table.HeaderCell>
                Teams
            </Table.HeaderCell>
        </Table.Row>
    )
}