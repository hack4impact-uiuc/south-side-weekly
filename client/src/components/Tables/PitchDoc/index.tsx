import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Table } from 'semantic-ui-react';
import { IPitch, IUser } from 'ssw-common';

import { FieldTag, TableTool } from '../..';
import { useAuth, useInterests, useTeams } from '../../../contexts';

import './styles.scss';

interface PitchTableProps {
  pitches: IPitch[];
}

interface PitchHeaderProps {
  pitches: IPitch[];
  data: IPitch[];
  setData: (data: IPitch[]) => void;
}

interface PitchBodyProps {
  data: IPitch[];
}

interface PitchRowProps {
  pitch: IPitch;
}

const titleSort = (a: IPitch, b: IPitch): number =>
  a.title.localeCompare(b.title);

const descriptionSort = (a: IPitch, b: IPitch): number =>
  a.description.localeCompare(b.description);

interface ColumnEnumValue {
  title: string;
  sort: (a: IPitch, b: IPitch) => number;
}

const columnsEnum: { [key: string]: ColumnEnumValue } = {
  TITLE: {
    title: 'TITLE',
    sort: titleSort,
  },
  DESCRIPTION: {
    title: 'DESCRIPTION',
    sort: descriptionSort,
  },
};

const PitchHeader: FC<PitchHeaderProps> = ({
  pitches,
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
        setData(pitches);
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
    setData(pitches);
  }, [pitches, setData]);

  return (
    <Table.Row>
      <Table.HeaderCell
        onClick={() => handleSort(columnsEnum.TITLE)}
        sorted={column === columnsEnum.TITLE ? direction : undefined}
      >
        Title
      </Table.HeaderCell>
      <Table.HeaderCell
        onClick={() => handleSort(columnsEnum.DESCRIPTION)}
        sorted={column === columnsEnum.DESCRIPTION ? direction : undefined}
      >
        Description
      </Table.HeaderCell>
      <Table.HeaderCell>Associated Interests</Table.HeaderCell>
      <Table.HeaderCell>Teams You Can Claim</Table.HeaderCell>
    </Table.Row>
  );
};

const PitchBody: FC<PitchBodyProps> = ({ data }): ReactElement => (
  <>
    {data.length === 0 && (
      <Table.Row>
        <Table.Cell textAlign="center" width={1}>
          <div className="no-results-found">No results found!</div>
        </Table.Cell>
      </Table.Row>
    )}
    {data.map((user, index) => (
      <PitchRow pitch={user} key={index} />
    ))}
  </>
);

const getClaimableTeams = (pitch: IPitch, user: IUser): string[] => (
    pitch.writer ? pitch.teams
    .filter((team) => team.target > 0 && user.teams.includes(team.teamId))
    .map((team) => team.teamId) : []);

const PitchRow: FC<PitchRowProps> = ({ pitch }): ReactElement => {
  const { user } = useAuth();
  const { getInterestById } = useInterests();
  const { getTeamFromId } = useTeams();

  return (<Table.Row>
    <Table.Cell>{pitch.title}</Table.Cell>
    <Table.Cell>{pitch.description}</Table.Cell>
    <Table.Cell>
      {pitch.topics.map((interest, index) => {
        const fullInterest = getInterestById(interest);

        return (
          <FieldTag
            size="small"
            key={index}
            name={fullInterest?.name}
            hexcode={fullInterest?.color}
          />
        );
      })}
    </Table.Cell>
    <Table.Cell>{getClaimableTeams(pitch, user).map((team, index)=> {
      const fullTeam = getTeamFromId(team);

      return (
        <FieldTag
          size="small"
          key={index}
          name={fullTeam?.name}
          hexcode={fullTeam?.color}
        />
      );
    })}</Table.Cell>
  </Table.Row>)
};

const PitchTable: FC<PitchTableProps> = ({ pitches }): ReactElement => {
  const [data, setData] = useState<IPitch[]>([]);

  useEffect(() => {
    setData(pitches);
  }, [pitches]);

  return (
    <TableTool
      tableHeader={
        <PitchHeader pitches={pitches} data={data} setData={setData} />
      }
      tableBody={<PitchBody data={data} />}
      singleLine={pitches.length > 0}
    />
  );
};

export default PitchTable;
