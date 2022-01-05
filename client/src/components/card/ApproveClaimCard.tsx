import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button, Divider, Icon, Input, Label } from 'semantic-ui-react';
import { Team, User, UserFields } from 'ssw-common';
import Swal from 'sweetalert2';

import { FieldTag } from '..';
import { apiCall, isError } from '../../api';
import { getUserFullName, pluralize } from '../../utils/helpers';
import ContributorFeedback from '../modal/ContributorFeedback';
import { SingleSelect } from '../select/SingleSelect';
import UserChip from '../tag/UserChip';
import { AuthView } from '../wrapper/AuthView';
import './ApproveClaimCard.scss';

interface ApproveClaimCardProps {
  pendingContributors: UserFields[];
  assignmentContributors: UserFields[];
  team: Team & { target: number };
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
  const [filteredContribtors, setFilteredContributors] = useState<User[]>([]);
  const [allTeamContributors, setAllTeamContributors] = useState<User[] | null>(
    null,
  );
  const [selectedContributor, setSelectedContributor] = useState('');
  const [editTargetMode, setEditTargetMode] = useState(false);
  const [loading, setLoading] = useState(false);

  //const team = getTeamFromId(teamId);

  const [totalPositions, setTotalPositions] = useState(0);

  const addContributor = async (): Promise<void> => {
    setSelectContributorMode(false);
    if (selectedContributor) {
      await apiCall({
        method: 'PUT',
        url: `/pitches/${pitchId}/addContributor`,
        body: {
          userId: selectedContributor,
          teamId: team._id,
        },
        query: {
          writer: team.name === 'Writing',
        },
      });
    }
    await callback();
  };

  const removeContributor = async (userId: string): Promise<void> => {
    await apiCall({
      method: 'PUT',
      url: `/pitches/${pitchId}/removeContributor`,
      body: {
        userId: userId,
        teamId: team._id,
      },
      query: {
        writer: team.name === 'Writing',
      },
    });

    await callback();
  };

  const approveClaim = async (userId: string): Promise<void> => {
    setLoading(true);

    await apiCall({
      method: 'PUT',
      url: `/pitches/${pitchId}/approveClaim`,
      body: {
        userId: userId,
        teamId: team._id,
        teams: [team.name],
      },
      query: {
        writer: team.name === 'Writing',
      },
    });

    await callback();
    setLoading(false);
  };

  const declineClaim = async (userId: string): Promise<void> => {
    await apiCall({
      method: 'PUT',
      url: `/pitches/${pitchId}/declineClaim`,
      body: {
        userId: userId,
        teamId: team._id,
      },
    });
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

    await apiCall({
      method: 'PUT',
      url: `/pitches/${pitchId}/teamTarget`,
      body: {
        teamId: team._id,
        target: totalPositions - assignmentContributors.length,
      },
    });

    callback();
  };

  const renderAddContributor = (): JSX.Element => {
    if (selectContributorMode) {
      return (
        <div className="select-contributor-row">
          <SingleSelect
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
      <AuthView view="isAdmin">
        <Label
          className="add-contributor"
          as="a"
          onClick={() => setSelectContributorMode(true)}
        >
          <Icon name="plus" />
          Add contributor
        </Label>
      </AuthView>
    );
  };

  const filterContributors = useCallback(
    (contributors: User[]): User[] =>
      contributors.filter(
        ({ _id }) =>
          !assignmentContributors.map((user) => user._id).includes(_id) &&
          !pendingContributors.map((user) => user._id).includes(_id),
      ),
    [assignmentContributors, pendingContributors],
  );

  useEffect(() => {
    const getContributorsByTeam = async (): Promise<void> => {
      const res = await apiCall<User[]>({
        method: 'GET',
        url: `/users/all/team/${team.name}`,
      });
      if (!isError(res)) {
        const contributors = res.data.result;
        setAllTeamContributors(contributors);
        setFilteredContributors(filterContributors(contributors));
      }
    };
    if (selectContributorMode) {
      if (allTeamContributors) {
        setFilteredContributors(filterContributors(allTeamContributors));
        return;
      }
      getContributorsByTeam();
    } else {
      setSelectedContributor('');
    }
  }, [
    selectContributorMode,
    team.name,
    filterContributors,
    allTeamContributors,
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
        <AuthView view="isAdmin">
          <Icon
            name="pencil"
            link
            onClick={() => {
              setEditTargetMode(true);
              setTotalPositions(team.target + assignmentContributors.length);
            }}
          />
        </AuthView>
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
          void 0;
          return (
            <div key={idx} className="claim-row">
              <UserChip user={contributor} />

              <div className="button-group">
                <Button
                  content="Approve"
                  positive
                  size="small"
                  onClick={() => approveClaim(contributor._id)}
                  loading={loading}
                />
                <Button
                  content="Decline"
                  negative
                  size="small"
                  onClick={() => declineClaim(contributor._id)}
                />
              </div>
            </div>
          );
        })}
        {assignmentContributors.map((contributor, idx) => (
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
                onClick={() => removeContributor(contributor._id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApproveClaimCard;
