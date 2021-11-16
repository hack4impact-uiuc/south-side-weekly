import React, { FC, ReactElement, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Form, Header, Icon } from 'semantic-ui-react';
import { IPitchAggregate, ITeam, IUser } from 'ssw-common';
import { FieldTag, UserChip } from '..';
import { useTeams } from '../../contexts';

import { staffPages } from '../../utils/constants';

import './styles.scss';

interface ApproveClaimCardProps {
  pendingContributors: Partial<IUser>[];
  assignmentContributors: Partial<IUser>[];
  teamId: string;
  pitchTeams: IPitchAggregate['aggregated']['teams'];
}

const ApproveClaimCard: FC<ApproveClaimCardProps> = ({
  teamId,
  pendingContributors,
  assignmentContributors,
  pitchTeams,
}): ReactElement => {
  const getTeamFromId = (
    teamId: string,
  ): (ITeam & { target: number }) | undefined =>
    pitchTeams.find(({ _id }) => _id === teamId);

  const team = getTeamFromId(teamId);

  return (
    <div className="approve-claim-card">
      <div className="card-header">
        <FieldTag name={team?.name} hexcode={team?.color} />
        <p>
          {assignmentContributors.length} out of {team?.target} position filled
        </p>
        <Icon name="pencil" />
      </div>
      <hr className="header-divider" />
      <div className="claim-section">
        {pendingContributors.map((contributor, idx) => {
          console.log(contributor);
          return (
            <div key={idx} className="claim-row">
              <UserChip user={contributor} />

              <div className="radio-group">
                <Form.Radio label="Approve" />
                <Form.Radio label="Decline" />
              </div>
            </div>
          );
        })}

        {assignmentContributors.map((contributor, idx) => {
          console.log(contributor);
          return (
            <div key={idx} className="claim-row">
              <UserChip user={contributor} />

              <div className="radio-group">
                <Form.Radio label="Approve" />
                <Form.Radio label="Decline" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApproveClaimCard;
