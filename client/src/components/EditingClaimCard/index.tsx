import { omit } from 'lodash';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { SelectOptionActionMeta } from 'react-select';
import { Button, Divider, Icon, Input, Label } from 'semantic-ui-react';
import { IPitchAggregate, ITeam, IUser } from 'ssw-common';
import Swal from 'sweetalert2';

import { ContributorFeedback, FieldTag, Select, UserChip } from '..';
import { editResource, isError } from '../../api';
import {
  addContributorToPitch,
  approvePitchClaim,
  changeEditorType,
  declinePitchClaim,
  removeContributorFromPitch,
  updatePitchTeamTarget,
} from '../../api/pitch';
import { getUsersByTeam } from '../../api/user';
import { useTeams } from '../../contexts';
import { EditorRecord } from '../../pages/reviewClaim/types';
import { getUserFullName, pluralize } from '../../utils/helpers';
import './styles.scss';

interface EditingClaimCardProps {
  pitchId: string;
  completed: boolean;
  editors: EditorRecord;
  team: ITeam & { target: number };
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
  callback,
}): ReactElement => {
  const { getTeamFromId: getTeamFromProvider } = useTeams();
  const [selectContributorMode, setSelectContributorMode] = useState(false);
  const [filteredContributors, setFilteredContributors] = useState<IUser[]>([]);
  const [selectedContributor, setSelectedContributor] = useState('');
  const [editTargetMode, setEditTargetMode] = useState(false);
  const [allEditors, setAllEditors] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [temporaryContributors, setTemporaryContributors] =
    useState<EditorRecord>({});

  console.log('TMP:', temporaryContributors);

  console.log('EDITORS:', editors);

  const [totalPositions, setTotalPositions] = useState(0);

  const getContributorFromId = (userId: string): IUser | undefined =>
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

  const addEditor = async (
    editorId: string,
    editorType: string,
  ): Promise<void> => {
    removeTemporaryContributor(editorId);
    const res = await addContributorToPitch(
      pitchId,
      editorId,
      team._id,
      editorType,
    );

    console.log(res);

    await callback();
  };

  const removeTemporaryContributor = (editorId: string): void => {
    setTemporaryContributors(omit(temporaryContributors, editorId));
  };

  const removeContributor = async (
    userId: string,
    editorType: string,
  ): Promise<void> => {
    const res = await removeContributorFromPitch(
      pitchId,
      userId,
      team._id,
      editorType,
    );
    console.log(res);

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
    await updatePitchTeamTarget(pitchId, team._id, totalPositions - 1);
    callback();
  };

  const renderAddContributor = (): JSX.Element => {
    if (selectContributorMode) {
      return (
        <div className="select-contributor-row">
          <Select
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
    const filterContributors = (contributors: IUser[]): IUser[] =>
      contributors.filter(
        ({ _id }) =>
          !Object.keys(editors).includes(_id) &&
          !Object.keys(temporaryContributors).includes(_id),
      );

    const getContributorsByTeam = async (): Promise<void> => {
      const res = await getUsersByTeam(team.name);
      if (!isError(res)) {
        console.log('FETCHED CONTRIBUTORS');
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
  }, [editors, selectContributorMode, team.name, temporaryContributors]);

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
          {/* <Button content="cancel" /> */}
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
        <Icon
          name="pencil"
          link
          onClick={() => {
            setEditTargetMode(true);
            setTotalPositions(team.target + 1);
          }}
        />
      </>
    );
  };

  const changeEditor = async (
    userId: string,
    from: string,
    to: string,
  ): Promise<void> => {
    console.log(userId, from, to);
    await changeEditorType(pitchId, userId, from, to);
    await callback();
    //await void 0;
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
        {Object.entries(editors).map(([editorId, editor], idx) => {
          console.log('hey');
          return (
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
                  <Select
                    value={editor.editorType}
                    options={editorTypeDropDownOptions}
                    onChange={(e) =>
                      changeEditor(
                        editorId,
                        editor.editorType,
                        e ? e.value : '',
                      )
                    }
                    placeholder="Editor Type"
                    className="select-editor-type"
                  />
                  <Icon
                    name="trash"
                    link
                    onClick={() =>
                      removeContributor(editorId, editor.editorType)
                    }
                  />
                </div>
              )}
            </div>
          );
        })}

        {Object.entries(temporaryContributors).map(
          ([editorId, editor], idx) => {
            //const editor = getContributorFromId(userId)!;
            console.log('jey');
            return (
              <div className="claim-row" key={idx}>
                <UserChip user={omit(editor, 'editorType')} />
                <div className="dropdown-trash">
                  <Select
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
            );
          },
        )}
      </div>
    </div>
  );
};

export default EditingClaimCard;
