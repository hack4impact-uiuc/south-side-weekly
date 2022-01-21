import { groupBy, omit } from 'lodash';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Button, Divider, Icon, Label, Popup } from 'semantic-ui-react';
import { Team, User } from 'ssw-common';
import Swal from 'sweetalert2';

import { FieldTag } from '..';
import { apiCall, isError } from '../../api';
import { EditorRecord, PendingEditorRecord } from '../../pages/Pitch';
import { editorTypeEnum } from '../../utils/enums';
import { getUserFullName } from '../../utils/helpers';
import ContributorFeedback from '../modal/ContributorFeedback';
import { SingleSelect } from '../select/SingleSelect';
import UserChip from '../tag/UserChip';
import { AuthView } from '../wrapper/AuthView';
import './EditingClaimCard.scss';

interface EditingClaimCardProps {
  pitchId: string;
  completed: boolean;
  editors: EditorRecord;
  pendingEditors: PendingEditorRecord;
  team: Team & { target: number };
  callback: () => Promise<void>;
}

interface SelectOption {
  value: string;
  label: string;
}

const editorTypeDropDownOptions: SelectOption[] = Object.values(
  editorTypeEnum,
).map((type) => ({ value: type, label: type }));

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
  const [allEditors, setAllEditors] = useState<User[]>([]);
  const [temporaryContributors, setTemporaryContributors] =
    useState<EditorRecord>({});

  const getContributorFromId = (userId: string): User | undefined =>
    allEditors.find(({ _id }) => userId === _id);

  const addContributor = (): void => {
    setSelectContributorMode(false);
    if (selectedContributor) {
      const tempContributorsCopy = { ...temporaryContributors };
      tempContributorsCopy[selectedContributor] = {
        user: getContributorFromId(selectedContributor)!,
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

  const numEditors = (): number =>
    Object.values(
      groupBy(Object.values(editors).map(({ editorType }) => editorType)),
    ).length;

  const renderCardHeader = (): JSX.Element => (
    <p>{numEditors()} out of 3 positions filled</p>
  );

  const changeEditor = async (
    userId: string,
    from: string,
    to: string,
  ): Promise<void> => {
    if (from === to) {
      return;
    }

    if (from === editorTypeEnum.PRIMARY) {
      Swal.fire({
        title: 'Cannot remove only Primary Editor.',
        text: 'If you want to remove a Primary Editor, add a new Contributor with editing-level Primary.',
        icon: 'error',
      });
      return;
    }
    const primaryEditor = Object.values(editors).find(
      ({ editorType }) => editorType === editorTypeEnum.PRIMARY,
    );

    let shouldCancelChange = false;
    if (primaryEditor && to === editorTypeEnum.PRIMARY) {
      await Swal.fire({
        title: 'Primary Editor already exists.',
        text: `This action will remove the current Primary Editor, ${primaryEditor.user.fullname}. Contributors on this pitch will not be alerted of this.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Assign New Primary Editor',
      }).then((result) => {
        if (!result.isConfirmed) {
          shouldCancelChange = true;
        }
      });
    }

    if (shouldCancelChange) {
      return;
    }

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
    <div className="editing-claim-card">
      <div className="card-header">
        <FieldTag name={team.name} hexcode={team.color} />
        {renderCardHeader()}
      </div>
      <Divider />
      {!completed && renderAddContributor()}
      <div className="claim-section">
        {Object.entries(editors).map(
          ([editorId, { user, editorType }], idx) => (
            <div className="claim-row" key={idx}>
              <UserChip user={omit(user, 'editorType')} />
              <FieldTag content={editorType} />
              <AuthView view="minStaff">
                {completed ? (
                  <ContributorFeedback
                    user={omit(user, 'editorType')}
                    team={team}
                    pitchId={pitchId}
                  />
                ) : (
                  <div className="dropdown-trash">
                    <SingleSelect
                      value={editorType}
                      options={editorTypeDropDownOptions}
                      onChange={(e) =>
                        changeEditor(editorId, editorType, e ? e.value : '')
                      }
                      placeholder="Editor Type"
                      className="select-editor-type"
                      isClearable={false}
                    />

                    <Icon
                      name="trash"
                      link={editorType !== editorTypeEnum.PRIMARY}
                      onClick={() => removeContributor(editorId, editorType)}
                      disabled={editorType === editorTypeEnum.PRIMARY}
                      className={
                        editorType === editorTypeEnum.PRIMARY
                          ? 'disabled-trash'
                          : ''
                      }
                    />
                  </div>
                )}
              </AuthView>
            </div>
          ),
        )}

        {Object.entries(pendingEditors).map(
          ([editorId, { user, editorType, message }], idx) => (
            <div className="claim-row" key={idx}>
              <div className="field-tag-popup">
                <UserChip user={omit(user, 'editorType')} />
                <Popup
                  content={message}
                  trigger={<Icon size="small" name="question circle" />}
                  wide="very"
                  position="top center"
                  hoverable
                />
              </div>

              <div className="dropdown-trash">
                <FieldTag content="pending" />
                <AuthView view="minStaff">
                  <SingleSelect
                    value={editorType}
                    options={editorTypeDropDownOptions}
                    onChange={(e) => approveClaim(editorId, e ? e.value : '')}
                    placeholder="Editor Type"
                    className="select-editor-type"
                    isClearable={false}
                  />
                  <Icon
                    name="trash"
                    link
                    onClick={() => declineClaim(editorId)}
                  />
                </AuthView>
              </div>
            </div>
          ),
        )}

        {Object.entries(temporaryContributors).map(
          ([editorId, { user, editorType }], idx) => (
            <div className="claim-row" key={idx}>
              <UserChip user={omit(user, 'editorType')} />
              <div className="dropdown-trash">
                <SingleSelect
                  value={editorType}
                  options={editorTypeDropDownOptions}
                  onChange={(e) => addEditor(editorId, e ? e.value : '')}
                  placeholder="Editor Type"
                  className="select-editor-type"
                  isClearable={false}
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
