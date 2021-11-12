import React, { FC, ReactElement, useState } from 'react';
import { ModalProps, Table, SemanticWIDTHS } from 'semantic-ui-react';
import { IUser } from 'ssw-common';


interface DirectoryRowProps {
    cells: ICell[];
  }
  
interface DirectoryHeaderProps {
    columnHeaders: IColumnHeader[];
    handleSort: (column: IColumnHeader) => void;
}

interface DirectoryBodyProps {
    data: IUser[];
}

type Direction = 'ascending' | 'descending';

interface IColumnHeader {
    title?: string;
    width?: SemanticWIDTHS;
    headerModal?: React.FC<ModalProps>;
    order?: Direction;
    sort?: (a: IUser, b: IUser) => number;
}

const TableHeader: FC<DirectoryHeaderProps> = ({
    columnHeaders,
    handleSort
}): ReactElement => (
    <Table.Row>
    {columnHeaders.map((column, index) => {
        <Table.HeaderCell width={column.width} onClick={() => handleSort(column)} sorted={column.order} key={index}>
            {column.title}
        </Table.HeaderCell>
    })}
    </Table.Row>
);

interface ICell {
    width?: SemanticWIDTHS;
    adminView?: boolean;
    content: ReactElement;
}

const TableRow: FC<DirectoryRowProps> = ({
    cells
}): ReactElement => (
    <Table.Row>
        
    </Table.Row>
);