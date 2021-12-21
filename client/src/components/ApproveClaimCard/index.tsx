import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Button, Divider, Icon, Input, Label } from 'semantic-ui-react';
import { ITeam, IUser } from 'ssw-common';
import Swal from 'sweetalert2';

import { ContributorFeedback, FieldTag, Select, UserChip } from '..';
import { isError } from '../../api';
import {
  addContributorToPitch,
  approvePitchClaim,
  declinePitchClaim,
  removeContributorFromPitch,
  updatePitchTeamTarget,
} from '../../api/pitch';
import { getUsersByTeam } from '../../api/user';
import { getUserFullName, pluralize } from '../../utils/helpers';
import './styles.scss';

interface ApproveClaimCardProps {
  pendingContributors: Partial<IUser>[];
  assignmentContributors: Partial<IUser>[];
  team: ITeam & { target: number };
  pitchId: string;
  completed: boolean;
  callback: () => Promise<void>;
}

const ApproveClaimCard: FC<ApproveClaimCardProps> = ({
  team,
  pendingContributors,
  assignmentContributors,
  pitchId,
  completed,
  callback,
}): ReactElement => {
  const [selectContributorMode, setSelectContributorMode] = useState(false);
  const [filteredContribtors, setFilteredContributors] = useState<IUser[]>([]);
  const [selectedContributor, setSelectedContributor] = useState('');
  const [editTargetMode, setEditTargetMode] = useState(false);
  const [loading, setLoading] = useState(false);

  //const team = getTeamFromId(teamId);

  const [totalPositions, setTotalPositions] = useState(0);

  const addContributor = async (): Promise<void> => {
    setSelectContributorMode(false);
    if (selectedContributor) {
      const res = await addContributorToPitch(
        pitchId,
        selectedContributor,
        team._id,
      );
      console.log(res);
    }
    await callback();
  };

  const removeContributor = async (userId: string): Promise<void> => {
    const res = await removeContributorFromPitch(pitchId, userId, team._id);
    console.log(res);

    await callback();
  };

  const approveClaim = async (userId: string): Promise<void> => {
    setLoading(true);
    await approvePitchClaim(pitchId, userId, team._id, [team.name]);
    await callback();
    setLoading(false);
  };

  const declineClaim = async (userId: string): Promise<void> => {
    await declinePitchClaim(pitchId, userId, team._id);
    await callback();
  };

  const changeTarget = async (): Promise<void> => {
    if (totalPositions - assignmentContributors.length < 0) {
      Swal.fire({
        title:
          'The number of positions cannot be less than the current number of contributors',
        icon: 'error',
      });
      return;
    }

    setEditTargetMode(false);
    await updatePitchTeamTarget(
      pitchId,
      team._id,
      totalPositions - assignmentContributors.length,
    );
    callback();
  };

  const renderAddContributor = (): JSX.Element => {
    if (selectContributorMode) {
      return (
        <div className="select-contributor-row">
          <Select
            value={selectedContributor}
            options={filteredContribtors.map((contributor) => ({
              value: contributor._id,
              label: getUserFullName(contributor),
            }))}
            onChange={(e) => setSelectedContributor(e ? e.value : '')}
            placeholder="Select Contributor"
            className="select-contributor"
          />
          <div>
            <Button
              content="Add"
              positive
              onClick={addContributor}
              size="small"
            />
            <Button
              content="Cancel"
              negative
              onClick={() => setSelectContributorMode(false)}
              size="small"
            />
          </div>
        </div>
      );
    }
    return (
      <Label
        className="add-contributor"
        as="a"
        onClick={() => setSelectContributorMode(true)}
      >
        <Icon name="plus" />
        Add contributor
      </Label>
    );
  };

  useEffect(() => {
    const getContributorsByTeam = async (): Promise<void> => {
      const filterContributors = (contributors: IUser[]): IUser[] =>
        contributors.filter(
          ({ _id }) =>
            !assignmentContributors.map((user) => user._id).includes(_id) &&
            !pendingContributors.map((user) => user._id).includes(_id),
        );

      const res = await getUsersByTeam(team.name);
      if (!isError(res)) {
        console.log('FETCHED CONTRIBUTORS');
        const contributors = res.data.result;
        setFilteredContributors(filterContributors(contributors));
      }
    };
    if (selectContributorMode) {
      getContributorsByTeam();
    } else {
      setSelectedContributor('');
    }
  }, [
    selectContributorMode,
    team.name,
    assignmentContributors,
    pendingContributors,
  ]);

  const renderCardHeader = (): JSX.Element => {
    void 0;
    if (editTargetMode) {
      return (
        <div className="target-row">
          <div className="target-text">
            <div style={{ display: 'flex' }}>
              {assignmentContributors.length} out of{' '}
            </div>
            <Input
              className="target-input"
              value={isNaN(totalPositions) ? '' : totalPositions}
              onChange={(_, { value }) => setTotalPositions(parseInt(value))}
            />
            <div style={{ display: 'block', position: 'relative' }}>
              {pluralize(
                'position',
                team.target + assignmentContributors.length,
              )}{' '}
              filled
            </div>
          </div>

          <Button content="Save" color="black" onClick={changeTarget} />
          {/* <Button content="cancel" /> */}
        </div>
      );
    }
    return (
      <>
        <p>
          {assignmentContributors.length} out of{' '}
          {team.target + assignmentContributors.length}{' '}
          {pluralize('position', team.target + assignmentContributors.length)}{' '}
          filled
        </p>
        <Icon
          name="pencil"
          link
          onClick={() => {
            setEditTargetMode(true);
            setTotalPositions(team.target + assignmentContributors.length);
          }}
        />
      </>
    );
  };

  return (
    <div className="approve-claim-card">
      <div className="card-header">
        <FieldTag name={team.name} hexcode={team.color} />
        {renderCardHeader()}
      </div>
      <Divider />
      {!completed && renderAddContributor()}
      <div className="claim-section">
        {pendingContributors.map((contributor, idx) => {
          //console.log("contributor");
          void 0;
          return (
            <div key={idx} className="claim-row">
              <UserChip user={contributor} />

              <div className="button-group">
                <Button
                  content="Approve"
                  positive
                  size="small"
                  onClick={() => approveClaim(contributor._id!)}
                  loading={loading}
                />
                <Button
                  content="Decline"
                  negative
                  size="small"
                  onClick={() => declineClaim(contributor._id!)}
                />
              </div>
            </div>
          );
        })}
        {assignmentContributors.map((contributor, idx) => {
          console.log(contributor);
          return (
            <div key={idx} className="claim-row">
              <UserChip user={contributor} />

              {completed ? (
                <ContributorFeedback
                  user={contributor}
                  team={team}
                  pitchId={pitchId}
                />
              ) : (
                <Icon
                  name="trash"
                  link
                  onClick={() => removeContributor(contributor._id!)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApproveClaimCard;
