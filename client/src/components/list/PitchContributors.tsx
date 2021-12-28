import React, { FC, ReactElement, useMemo } from 'react';
import { FullPopulatedPitch, UserFields } from 'ssw-common';

import UserChip from '../tags/UserChip';

interface PitchContributorsProps {
  pitch: FullPopulatedPitch | null;
}

export const PitchContributors: FC<PitchContributorsProps> = ({
  pitch,
}): ReactElement => {
  const teams = useMemo(() => {
    const teamsToContributors = new Map<string, UserFields[]>();

    pitch?.assignmentContributors.forEach((c) => {
      c.teams.forEach((team) => {
        if (teamsToContributors.has(team.name)) {
          const users = teamsToContributors.get(team.name);
          users!.push(c.userId);
        } else {
          teamsToContributors.set(team.name, [c.userId]);
        }
      });
    });

    const groupedContributors = Array.from(
      teamsToContributors,
      ([team, users]) => ({ team, users }),
    );

    groupedContributors.sort((a, b) => a.team.localeCompare(b.team));

    return groupedContributors;
  }, [pitch]);

  return (
    <>
      {teams.map((team) => (
        <div key={team.team} className="row">
          <span className="chip-label">
            <h4>{team.team}</h4>
          </span>
          <div className="chips">
            {team.users.map((user) => (
              <UserChip className="chip" key={user._id} user={user} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
