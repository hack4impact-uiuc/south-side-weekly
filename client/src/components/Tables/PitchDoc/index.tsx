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
  sortedPitches: IPitch[];
  setSortedPitches: (sortedPitches: IPitch[]) => void;
}

interface PitchBodyProps {
  sortedPitches: IPitch[];
}

interface PitchRowProps {
  pitch: IPitch;
}

const titleSort = (a: IPitch, b: IPitch): number =>
  a.title.localeCompare(b.title);

interface ColumnEnumValue {
  title: string;
  sort: (a: IPitch, b: IPitch) => number;
}

const columnsEnum: { [key: string]: ColumnEnumValue } = {
  TITLE: {
    title: 'TITLE',
    sort: titleSort,
  },
};

const PitchHeader: FC<PitchHeaderProps> = ({
  pitches,
  sortedPitches,
  setSortedPitches,
}): ReactElement => {
  const [column, setColumn] = useState<ColumnEnumValue>();
  const [direction, setDirection] = useState<'ascending' | 'descending'>();

  const handleSort = (newColumn: ColumnEnumValue): void => {
    if (column?.title === newColumn.title) {
      if (direction === 'ascending') {
        setDirection('descending');
        setSortedPitches(sortedPitches.slice().reverse());
      } else if (direction === 'descending') {
        setSortedPitches(pitches);
        setDirection(undefined);
        setColumn(undefined);
      } else {
        setDirection('ascending');
        setSortedPitches(sortedPitches.slice().reverse());
      }
    } else {
      setColumn(newColumn);
      setDirection('ascending');

      const copy = [...sortedPitches];
      copy.sort(newColumn.sort);
      setSortedPitches(copy);
    }
  };

  useEffect(() => {
    setSortedPitches(pitches);
  }, [pitches, setSortedPitches]);

  return (
    <Table.Row>
      <Table.HeaderCell
        onClick={() => handleSort(columnsEnum.TITLE)}
        sorted={column === columnsEnum.TITLE ? direction : undefined}
      >
        Title
      </Table.HeaderCell>
      <Table.HeaderCell>Description</Table.HeaderCell>
      <Table.HeaderCell>Associated Interests</Table.HeaderCell>
      <Table.HeaderCell>Teams You Can Claim</Table.HeaderCell>
    </Table.Row>
  );
};

const PitchBody: FC<PitchBodyProps> = ({ sortedPitches }): ReactElement => (
  <>
    {sortedPitches.length === 0 && (
      <Table.Row>
        <Table.Cell textAlign="center" width={1}>
          <div className="no-results-found">No results found!</div>
        </Table.Cell>
      </Table.Row>
    )}
    {sortedPitches.map((user, index) => (
      <PitchRow pitch={user} key={index} />
    ))}
  </>
);

const getClaimableTeams = (pitch: IPitch, user: IUser): string[] =>
  pitch.writer
    ? pitch.teams
        .filter((team) => team.target > 0 && user.teams.includes(team.teamId))
        .map((team) => team.teamId)
    : [];

const PitchRow: FC<PitchRowProps> = ({ pitch }): ReactElement => {
  const { user } = useAuth();
  const { getInterestById } = useInterests();
  const { getTeamFromId } = useTeams();

  return (
    <Table.Row>
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
      <Table.Cell>
        {getClaimableTeams(pitch, user).map((team, index) => {
          const fullTeam = getTeamFromId(team);

          return (
            <FieldTag
              size="small"
              key={index}
              name={fullTeam?.name}
              hexcode={fullTeam?.color}
            />
          );
        })}
      </Table.Cell>
    </Table.Row>
  );
};

const PitchTable: FC<PitchTableProps> = ({ pitches }): ReactElement => {
  const [sortedPitches, setSortedPitches] = useState<IPitch[]>([]);

  useEffect(() => {
    setSortedPitches(pitches);
  }, [pitches]);

  return (
    <TableTool
      tableHeader={
        <PitchHeader
          pitches={pitches}
          sortedPitches={sortedPitches}
          setSortedPitches={setSortedPitches}
        />
      }
      tableBody={<PitchBody sortedPitches={sortedPitches} />}
      singleLine={pitches.length > 0}
    />
  );
};

export default PitchTable;