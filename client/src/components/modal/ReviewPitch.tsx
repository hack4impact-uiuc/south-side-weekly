import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Input, Modal, ModalProps } from 'semantic-ui-react';
import { BasePopulatedPitch, BasePopulatedUser } from 'ssw-common';
import cn from 'classnames';
import toast from 'react-hot-toast';

import { FieldTag } from '..';
import { isError } from '../../api';
import {
  loadBasePitch,
  loadEditors,
  loadPrimaryEditors,
  loadWriters,
} from '../../api/apiWrapper';
import { apiCall } from '../../api/request';
import { useAuth, useTeams } from '../../contexts';
import UserChip from '../tags/UserChip';
import neighborhoods from '../../utils/neighborhoods';
import { useIssues } from '../../contexts/issues/context';
import { issueStatusEnum } from '../../utils/enums';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { TagList } from '../list/TagList';
import { SingleSelect } from '../select/SingleSelect';
import { MultiSelect } from '../select/MultiSelect';
import { LinkDisplay } from '../ui/LinkDisplayButton';

import './modals.scss';
import './ReviewPitch.scss';

interface ReviewPitchProps extends ModalProps {
  id: string;
}

export const ReviewPitch: FC<ReviewPitchProps> = ({
  id,
  ...rest
}): ReactElement => {
  const { user } = useAuth();
  const { issues } = useIssues();
  const { teams } = useTeams();

  const [pitch, setPitch] = useState<BasePopulatedPitch | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [writers, setWriters] = useState<BasePopulatedUser[]>([]);
  const [primaryEditors, setPrimaryEditors] = useState<BasePopulatedUser[]>([]);
  const [editors, setEditors] = useState<BasePopulatedUser[]>([]);

  const [writer, setWriter] = useState<string | null>(null);
  const [primaryEditor, setPrimaryEditor] = useState<string | null>(null);
  const [secondEditors, setSecondEditors] = useState<string[]>([]);
  const [tertiaryEditors, setTertiaryEditors] = useState<string[]>([]);
  const [pitchNeighborhoods, setPitchNeighborhoods] = useState<string[]>([]);
  const [teamConfig, setTeamConfig] = useState<Record<string, number>>({});
  const [deadline, setDeadline] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [pitchIssues, setPitchIssues] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState('');

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      const [writers, primaryEditors, editors] = await Promise.all([
        loadWriters(),
        loadPrimaryEditors(),
        loadEditors(),
      ]);

      setWriters(writers);
      setPrimaryEditors(primaryEditors);
      setEditors(editors);
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadPitch = async (): Promise<void> => {
      const pitch = await loadBasePitch(id);

      setPitch(pitch);
      setWriter(pitch && pitch.writer && pitch.writer._id);
    };

    if (isOpen) {
      loadPitch();
    }
  }, [isOpen, id, teams]);

  const approvePitch = async (): Promise<void> => {
    const parsedTeams = Object.entries(teamConfig)
      .map(([id, target]) => ({ teamId: id, target }))
      .filter(({ target }) => target > 0);

    if (!primaryEditor || deadline.length === 0 || parsedTeams.length === 0) {
      toast.error('Please fill out all fields', { position: 'bottom-right' });
      return;
    }

    const pitchData = {
      writer: writer || undefined,
      primaryEditor: primaryEditor,
      secondEditors: secondEditors,
      thirdEditors: tertiaryEditors,
      neighborhoods: pitchNeighborhoods,
      teams: parsedTeams,
      deadline: new Date(deadline),
      issueStatuses: pitchIssues.map((issueId) => ({
        issueId,
        issueStatus: issueStatusEnum.MAYBE_IN,
      })),
    };

    const res = await apiCall({
      url: `/pitches/${pitch?._id}/approve`,
      method: 'PUT',
      body: pitchData,
    });

    if (!isError(res)) {
      toast.success('Pitch approved', { position: 'bottom-right' });
      setIsOpen(false);
    } else {
      toast.error('Error approving pitch', { position: 'bottom-right' });
    }
  };

  const declinePitch = async (): Promise<void> => {
    const res = await apiCall({
      url: `/pitches/${pitch?._id}/decline`,
      method: 'PUT',
      body: {
        reasoning,
      },
    });

    if (!isError(res)) {
      toast.success('Pitch declined', { position: 'bottom-right' });
      setIsOpen(false);
    } else {
      toast.error('Failed to decline pitch', { position: 'bottom-right' });
    }
  };

  const writerOptions = useMemo(() => {
    const opts = writers.map((writer) => ({
      label: writer.fullname,
      value: writer._id,
    }));

    if (pitch?.writer) {
      opts.unshift({ label: pitch.writer.fullname, value: pitch.writer._id });
    }

    return opts;
  }, [writers, pitch]);

  return (
    <Modal
      {...rest}
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      className={cn('review-pitch-modal', rest.className)}
    >
      <Modal.Header content="Review Pitch" />
      <Modal.Content>
        <div className="flex-wrapper">
          <div id="title">
            <h2>{pitch?.title}</h2>
          </div>
          <div>
            <LinkDisplay href={pitch?.assignmentGoogleDocLink || ''} />
          </div>
        </div>

        <TagList
          className="pitch-topic"
          size="small"
          tags={pitch?.topics || []}
        />

        <p id="description">{pitch?.description}</p>

        <div className="flex-wrapper section">
          <div>
            <p>
              <b id="pitch-creator">Pitch Creator: </b>
            </p>
          </div>
          <div>
            <UserChip user={pitch?.author} />
          </div>
        </div>

        <div className="section" id="writer-editor-select">
          <div id="writer-select">
            <p>
              <b>Writer</b> <mark className="optional">- Optional</mark>
            </p>
            <SingleSelect
              value={pitch?.writer?._id}
              options={writerOptions}
              onChange={(val) => setWriter(val?.value || null)}
              placeholder="Writer"
              className="selector"
            />
          </div>
          <div id="editor-select">
            <p>
              <b>Editors</b> <mark className="optional">- Optional</mark>
            </p>
            <SingleSelect
              value={primaryEditor}
              options={primaryEditors.map((editor) => ({
                value: editor._id,
                label: editor.fullname,
              }))}
              onChange={(val) => setPrimaryEditor(val?.value || '')}
              placeholder="Primary Editor"
              className="selector"
            />
            <MultiSelect
              value={secondEditors}
              options={editors.map((editor) => ({
                value: editor._id,
                label: editor.fullname,
              }))}
              onChange={(values) =>
                setSecondEditors(values.map((v) => v.value))
              }
              placeholder="Secondary Editors"
              className="selector"
            />
            <MultiSelect
              value={tertiaryEditors}
              options={editors.map((editor) => ({
                value: editor._id,
                label: editor.fullname,
              }))}
              onChange={(values) =>
                setTertiaryEditors(values.map((v) => v.value))
              }
              placeholder="Tertiary Editors"
              className="selector"
            />
          </div>
        </div>
        <div className="section">
          <p>
            <b>Associated Neighborhoods</b>
          </p>
          <MultiSelect
            value={pitchNeighborhoods}
            options={neighborhoods.map((loc) => ({
              value: loc,
              label: loc,
            }))}
            onChange={(values) =>
              setPitchNeighborhoods(values.map((v) => v.value))
            }
            placeholder="Neighborhoods"
            maxMenuHeight={200}
          />
        </div>
        <div className="section">
          <p>
            <b>Number of Contributors Needed Per Team</b>
          </p>
          <div id="target-selectors" className="section">
            {teams.map((team) => (
              <div style={{ margin: '0px 10px 0px 10px' }} key={team._id}>
                <div style={{ textAlign: 'center', margin: '10px' }}>
                  <FieldTag
                    size="small"
                    name={team.name}
                    hexcode={team.color}
                  />
                </div>
                <div>
                  <pre></pre>
                  <Input
                    type="number"
                    value={teamConfig[team._id] || 0}
                    onChange={(e, { value }) =>
                      setTeamConfig((curr) => ({
                        ...curr,
                        [team._id]: parseInt(value),
                      }))
                    }
                    style={{ width: '100px' }}
                    min={0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="section" id="date-issue-selector">
          <div id="deadline-title">
            <p>
              <b>Pitch Completition Deadline</b>
            </p>
            <Input
              type="date"
              value={deadline}
              onChange={(e, { value }) => setDeadline(value)}
            />
          </div>
          <div>
            <div className="flex-wrapper">
              <p id="issue-title">
                <b>
                  Add Pitch to Issue(s){' '}
                  <mark className="optional"> - Optional</mark>
                </b>
              </p>
              <SecondaryButton
                id="add-issue-btn"
                icon="add"
                content="Add Issue"
              />
            </div>
            <MultiSelect
              value={pitchIssues}
              options={issues.map((issue) => ({
                value: issue._id,
                label: new Date(issue.releaseDate).toLocaleDateString(),
              }))}
              onChange={(values) => setPitchIssues(values.map((v) => v.value))}
              placeholder="Select Issues"
            />
          </div>
        </div>
        <div className="section">
          <p>
            <b>Reject Reasoning</b>{' '}
            <mark className="optional"> - Optional</mark>
          </p>
          <Input
            fluid
            value={reasoning}
            onChange={(e, { value }) => setReasoning(value)}
          />
        </div>
        <Modal.Actions>
          <PrimaryButton
            disabled={false}
            onClick={approvePitch}
            content="Approve"
          />
          <SecondaryButton
            disabled={user._id === pitch?.author._id}
            onClick={declinePitch}
            content="Decline"
            border
          />
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
};
