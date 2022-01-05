import { omit } from 'lodash';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Button, Divider, Icon, Input, Label } from 'semantic-ui-react';
import { Team, User } from 'ssw-common';
import Swal from 'sweetalert2';

import { FieldTag } from '..';
import { apiCall, isError } from '../../api';
import { EditorRecord } from '../../pages/Pitch';
import { getUserFullName, pluralize } from '../../utils/helpers';
import ContributorFeedback from '../modal/ContributorFeedback';
import { SingleSelect } from '../select/SingleSelect';
import UserChip from '../tag/UserChip';
import { AuthView } from '../wrapper/AuthView';
import './EditingClaimCard.scss';

interface EditingClaimCardProps {
  pitchId: string;
  completed: boolean;
  editors: EditorRecord;
  pendingEditors: EditorRecord;
  team: Team & { target: number };
  callback: () => Promise<void>;
}

interface SelectOption {
  value: string;
  label: string;
}

const editorTypeDropDownOptions: SelectOption[] = [
  {
    value: 'First',
    label: 'First',
  },
  {
    value: 'Seconds',
    label: 'Seconds',
  },
  {
    value: 'Thirds',
    label: 'Thirds',
  },
];

const EditingClaimCard: FC<EditingClaimCardProps> = ({
  pitchId,
  completed,
  editors,
  team,
  pendingEditors,
  callback,
}): ReactElement => {
  const [selectContributorMode, setSelectContributorMode] = useState(false);
  const [filteredContributors, setFilteredContributors] = useState<User[]>([]);
  const [selectedContributor, setSelectedContributor] = useState('');
  const [editTargetMode, setEditTargetMode] = useState(false);
  const [allEditors, setAllEditors] = useState<User[]>([]);
  const [temporaryContributors, setTemporaryContributors] =
    useState<EditorRecord>({});

  const [totalPositions, setTotalPositions] = useState(0);

  const getContributorFromId = (userId: string): User | undefined =>
    allEditors.find(({ _id }) => userId === _id);

  const addContributor = (): void => {
    setSelectContributorMode(false);
    if (selectedContributor) {
      const tempContributorsCopy = { ...temporaryContributors };
      tempContributorsCopy[selectedContributor] = {
        ...getContributorFromId(selectedContributor)!,
        editorType: 'None',
      };

      setTemporaryContributors(tempContributorsCopy);
    }
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

  const approveClaim = async (
    editorId: string,
    editorType: string,
  ): Promise<void> => {
    await apiCall({
      method: 'PUT',
      url: `/pitches/${pitchId}/approveClaim`,
      body: {
        userId: editorId,
        teamId: team._id,
        teams: [team.name],
      },
      query: {
        editor: editorType,
      },
    });

    await callback();
  };

  const addEditor = async (
    editorId: string,
    editorType: string,
  ): Promise<void> => {
    removeTemporaryContributor(editorId);

    await apiCall({
      method: 'PUT',
      url: `/pitches/${pitchId}/addContributor/`,
      body: {
        userId: editorId,
        teamId: team._id,
      },
      query: {
        editor: editorType,
      },
    });

    await callback();
  };

  const removeTemporaryContributor = (editorId: string): void => {
    setTemporaryContributors(omit(temporaryContributors, editorId));
  };

  const removeContributor = async (
    userId: string,
    editorType: string,
  ): Promise<void> => {
    await apiCall({
      method: 'PUT',
      url: `/pitches/${pitchId}/removeContributor`,
      body: {
        userId: userId,
        teamId: team._id,
      },
      query: {
        editor: editorType,
      },
    });

    await callback();
  };

  const changeTarget = async (): Promise<void> => {
    //if (totalPositions - assignmentContributors.length < 0) {
    Swal.fire({
      title:
        'The number of positions cannot be less than the current number of contributors',
      icon: 'error',
    });
    //return;
    // }

    setEditTargetMode(false);

    await apiCall({
      method: 'PUT',
      url: `/pitches/${pitchId}/teamTarget`,
      body: {
        teamId: team._id,
        target: totalPositions - 1,
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
            options={filteredContributors.map((contributor) => ({
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

  useEffect(() => {
    const filterContributors = (contributors: User[]): User[] =>
      contributors.filter(
        ({ _id }) =>
          !Object.keys(editors).includes(_id) &&
          !Object.keys(pendingEditors).includes(_id) &&
          !Object.keys(temporaryContributors).includes(_id),
      );

    const getContributorsByTeam = async (): Promise<void> => {
      const res = await apiCall<User[]>({
        method: 'GET',
        url: `/users/all/team/${team.name}`,
      });

      if (!isError(res)) {
        const contributors = res.data.result;
        setAllEditors(contributors);
        setFilteredContributors(filterContributors(contributors));
      }
    };
    if (selectContributorMode) {
      getContributorsByTeam();
    } else {
      setSelectedContributor('');
    }
  }, [
    editors,
    selectContributorMode,
    team.name,
    temporaryContributors,
    pendingEditors,
  ]);

  const renderCardHeader = (): JSX.Element => {
    void 0;
    if (editTargetMode) {
      return (
        <div className="target-row">
          <div className="target-text">
            <div style={{ display: 'flex' }}>
              {Object.keys(editors).length} out of{' '}
            </div>
            <Input
              className="target-input"
              value={isNaN(totalPositions) ? '' : totalPositions}
              onChange={(_, { value }) => setTotalPositions(parseInt(value))}
            />
            <div style={{ display: 'block', position: 'relative' }}>
              {pluralize('position', team.target + Object.keys(editors).length)}{' '}
              filled
            </div>
          </div>

          <Button content="Save" color="black" onClick={changeTarget} />
        </div>
      );
    }
    return (
      <>
        <p>
          {Object.keys(editors).length} out of{' '}
          {team.target + Object.keys(editors).length}{' '}
          {pluralize('position', team.target + Object.keys(editors).length)}{' '}
          filled
        </p>
        <AuthView view="isAdmin">
          <Icon
            name="pencil"
            link
            onClick={() => {
              setEditTargetMode(true);
              setTotalPositions(team.target + 1);
            }}
          />
        </AuthView>
      </>
    );
  };

  const changeEditor = async (
    userId: string,
    from: string,
    to: string,
  ): Promise<void> => {
    await apiCall({
      method: 'PUT',
      url: `/pitches/${pitchId}/changeEditor`,
      body: {
        userId: userId,
      },
      query: {
        from: from,
        to: to,
      },
    });
    await callback();
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
        {Object.entries(editors).map(([editorId, editor], idx) => (
          <div className="claim-row" key={idx}>
            <UserChip user={omit(editor, 'editorType')} />

            {completed ? (
              <ContributorFeedback
                user={omit(editor, 'editorType')}
                team={team}
                pitchId={pitchId}
              />
            ) : (
              <div className="dropdown-trash">
                <SingleSelect
                  value={editor.editorType}
                  options={editorTypeDropDownOptions}
                  onChange={(e) =>
                    changeEditor(editorId, editor.editorType, e ? e.value : '')
                  }
                  placeholder="Editor Type"
                  className="select-editor-type"
                />
                <Icon
                  name="trash"
                  link
                  onClick={() => removeContributor(editorId, editor.editorType)}
                />
              </div>
            )}
          </div>
        ))}

        {Object.entries(pendingEditors).map(([editorId, editor], idx) => (
          <div className="claim-row" key={idx}>
            <UserChip user={omit(editor, 'editorType')} />

            {completed ? (
              <ContributorFeedback
                user={omit(editor, 'editorType')}
                team={team}
                pitchId={pitchId}
              />
            ) : (
              <div className="dropdown-trash">
                <SingleSelect
                  value={editor.editorType}
                  options={editorTypeDropDownOptions}
                  onChange={(e) => approveClaim(editorId, e ? e.value : '')}
                  placeholder="Editor Type"
                  className="select-editor-type"
                />
                <Icon
                  name="trash"
                  link
                  onClick={() => declineClaim(editorId)}
                />
              </div>
            )}
          </div>
        ))}

        {Object.entries(temporaryContributors).map(
          ([editorId, editor], idx) => (
            <div className="claim-row" key={idx}>
              <UserChip user={omit(editor, 'editorType')} />
              <div className="dropdown-trash">
                <SingleSelect
                  value={editor.editorType}
                  options={editorTypeDropDownOptions}
                  onChange={(e) => addEditor(editorId, e ? e.value : '')}
                  placeholder="Editor Type"
                  className="select-editor-type"
                />
                <Icon
                  name="trash"
                  link
                  onClick={() => removeTemporaryContributor(editorId)}
                />
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default EditingClaimCard;
