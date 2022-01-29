import React, { FC, useEffect, useMemo, useState } from 'react';
import { Divider, Icon, Modal, ModalProps, Message } from 'semantic-ui-react';
import cn from 'classnames';
import { FullPopulatedPitch } from 'ssw-common';
import toast from 'react-hot-toast';

import { PrimaryButton } from '../ui/PrimaryButton';
import { Pusher } from '../ui/Pusher';
import { LinkDisplay } from '../ui/LinkDisplayButton';
import { apiCall, isError } from '../../api';
import { TagList } from '../list/TagList';
import UserChip from '../tag/UserChip';
import { useAuth } from '../../contexts';
import { PitchContributors } from '../list/PitchContributors';
import { ClaimPitchFields, ClaimPitchForm } from '../form/ClaimPitchForm';

import './ClaimPitch.scss';

interface ClaimPitchProps extends ModalProps {
  id: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ClaimPitch: FC<ClaimPitchProps> = ({
  id,
  setOpen,
  open,
  ...rest
}) => {
  const [pitch, setPitch] = useState<FullPopulatedPitch | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadPitch = async (): Promise<void> => {
      const res = await apiCall<FullPopulatedPitch>({
        method: 'GET',
        url: `/pitches/${id}`,
        populate: 'full',
      });

      if (!isError(res)) {
        setPitch(res.data.result);
        toast.dismiss();
        toast.success('Successfully loaded pitch!');
      }
    };

    toast.loading('Loading pitch...');
    loadPitch();
  }, [id]);

  const handleClose = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    data: ModalProps,
  ): void => {
    if (rest.onClose) {
      rest.onClose(e, data);
    }
    setOpen(false);
  };

  const submitClaim = async (data: ClaimPitchFields): Promise<void> => {
    if (data.teams.length === 0) {
      toast.error('You must select at least one team!');
      return;
    }

    const res = await apiCall({
      url: `/pitches/${pitch?._id}/submitClaim`,
      method: 'PUT',
      body: {
        ...data,
        userId: user!._id,
      },
    });

    if (!isError(res)) {
      toast.success('Successfully submitted claim for Pitch!');
      setOpen(false);
    } else {
      toast.error('Failed to submit claim!');
    }
  };

  const hasClaimedPitch = useMemo(() => {
    if (!pitch) {
      return false;
    }

    const isWriter = pitch.writer._id === user?._id;
    const isEditor =
      pitch.primaryEditor._id === user?._id ||
      pitch.secondEditors.some((editor) => editor._id === user?._id) ||
      pitch.thirdEditors.some((editor) => editor._id === user?._id);
    const isContributor = pitch.assignmentContributors.some(
      (contributor) => contributor.userId._id === user?._id,
    );

    return isWriter || isEditor || isContributor;
  }, [pitch, user]);

  const hasSubmittedClaim = useMemo(() => {
    if (!pitch) {
      return false;
    }

    return (
      pitch.pendingContributors.findIndex((c) => c.userId._id === user!._id) >=
      0
    );
  }, [pitch, user]);

  return (
    <Modal
      {...rest}
      open={open}
      onClose={handleClose}
      className={cn('claim-pitch-modal', rest.className)}
    >
      <Modal.Header>
        <span>Claim Pitch</span>
        <Pusher />
        <Icon name="close" onClick={handleClose} />
      </Modal.Header>
      <Modal.Content scrolling>
        {hasSubmittedClaim && (
          <Message
            header="Wait!"
            warning
            content="You have already submitted claim for this pitch"
          />
        )}
        {hasClaimedPitch && (
          <Message
            header="Wait!"
            content="You have already claimed this pitch. Please contact an Staff or Admin to claim this pitch."
            warning
          />
        )}
        <div className="flex-wrapper">
          <div id="title">
            <h2>{pitch?.title}</h2>
          </div>
          <div>
            <LinkDisplay href={pitch?.assignmentGoogleDocLink || ''} />
          </div>
        </div>
        <TagList tags={pitch?.topics || []} />
        <div className="description">{pitch?.description}</div>

        <details>
          <summary id="contributors-summary">
            <h4>Contributors Currently on Pitch</h4>
          </summary>
          <div id="main-contributors">
            <div className="left-col">
              <div className="row">
                <span className="chip-label">
                  <h4>Author</h4>
                </span>
                <div className="chips">
                  <UserChip user={pitch?.author} />
                </div>
              </div>
              <div className="row">
                <span className="chip-label">
                  <h4>Writer</h4>
                </span>
                <div className="chips">
                  <UserChip user={pitch?.writer} />
                </div>
              </div>
            </div>
            <div className="right-col">
              <div className="row">
                <span className="chip-label">
                  <h4>Primary Editor</h4>
                </span>
                <div className="chips">
                  <UserChip user={pitch?.primaryEditor} />
                </div>
              </div>
              <div className="row">
                <span className="chip-label">
                  <h4>Second Editors</h4>
                </span>
                <div className="chips">
                  {pitch?.secondEditors.map((editor) => (
                    <UserChip className="chip" key={editor._id} user={editor} />
                  ))}
                </div>
              </div>
              <div className="row">
                <span className="chip-label">
                  <h4>Third Editors</h4>
                </span>
                <div className="chips">
                  {pitch?.thirdEditors.map((editor) => (
                    <UserChip className="chip" key={editor._id} user={editor} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <h4>Other Contributors Currently On Pitch</h4>
          <Divider />
          <div id="contributors">
            {(pitch?.assignmentContributors || []).length > 0 ? (
              <PitchContributors pitch={pitch} />
            ) : (
              <p>No contributors on pitch yet</p>
            )}
          </div>
        </details>
        <ClaimPitchForm
          pitch={pitch}
          onSubmit={submitClaim}
          initialValues={{ message: '', teams: [] }}
          disabled={hasClaimedPitch || hasSubmittedClaim}
        />
      </Modal.Content>
      <Modal.Actions>
        <PrimaryButton
          disabled={hasClaimedPitch || hasSubmittedClaim}
          type="submit"
          form="claim-pitch-form"
          content="Submit"
        />
      </Modal.Actions>
    </Modal>
  );
};
