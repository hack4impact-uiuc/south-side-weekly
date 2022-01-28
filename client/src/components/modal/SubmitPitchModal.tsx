import React, { FC, ReactElement, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Icon, Modal, ModalProps, Popup, Header } from 'semantic-ui-react';
import { Pitch } from 'ssw-common';

import { isError, apiCall } from '../../api';
import { useAuth } from '../../contexts';
import { SubmitPitchFields, SubmitPitchForm } from '../form/SubmitPitchForm';
import { PrimaryButton } from '../ui/PrimaryButton';
import { Pusher } from '../ui/Pusher';

import './modals.scss';

const HelperMessage = (): ReactElement => (
  <>
    <Header as="h2">Here are guidelines for submitting a pitch:</Header>
    <p>
      A good pitch should set up an issue or other story idea, explain why it’s
      compelling to cover, provide basic information about the background of the
      issue, and suggest some reporting avenues of inquiry and research. It
      shouldn’t be overly complicated or long, and should leave the writer and
      editor who are eventually assigned to the story room to be creative in how
      they go about tackling the pitch. Some background research or knowledge
      will likely be required to write the pitch, but it shouldn’t be so
      involved that you feel you can write the story with the information you’ve
      obtained for it—there should still be a lot to report out that we learn in
      the process
    </p>
    <Header as="h2">For Example:</Header>
    <p>
      A handful of prominent Black politicians and activists are pushing for
      local reparations conversations and ordinances. Chicago has a rich history
      here—there’s the Burge reparations project and Chicago City Council was
      one of the first legislative bodies to pass an ordinance around this, in
      2000—and it seems like momentum is picking up. 6th Ward Alderman Roderick
      Sawyer, head of the City Council’s Committee on Health and Human
      Relations, is holding a hearing in coming weeks about reparations and has
      a bill to create a commission to study the issue, and former mayoral and
      current Senate candidate Willie Wilson has been pushing that bill as well.
      West Side state rep and former mayoral candidate La Shawn Ford has also
      recently been pushing the legislature on this. Profile all of these
      efforts (and others not discussed in this pitch), attend public hearings
      on the topic, interview those involved, and tell us exactly where these
      efforts are going.
    </p>
  </>
);

interface SubmitPitchModalProps extends ModalProps {
  pitch?: Pick<
    Pitch,
    | 'title'
    | 'description'
    | 'assignmentGoogleDocLink'
    | 'conflictOfInterest'
    | 'topics'
    | 'writer'
    | '_id'
  >;
  hasTrigger?: boolean;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SubmitPitchModal: FC<SubmitPitchModalProps> = ({
  pitch,
  hasTrigger = true,
  open,
  setOpen,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(open);
  const { user } = useAuth();

  const submitPitch = async (data: SubmitPitchFields): Promise<void> => {
    const body: Record<string, unknown> = {
      title: data.title,
      assignmentGoogleDocLink: data.assignmentGoogleDocLink,
      description: data.description,
      topics: data.topics,
      conflictOfInterest: data.conflictOfInterest === 'true',
      writer: user!._id,
      author: user!._id,
    };

    if (data.writerIntent === undefined || data.writerIntent === 'false') {
      body.writer = null;
    }

    const res = await apiCall<Pitch>({
      url: pitch ? `/pitches/${pitch._id}` : `/pitches`,
      method: pitch ? 'PUT' : 'POST',
      body,
    });

    if (!isError(res)) {
      const message = pitch
        ? 'Pitch updated successfully'
        : 'Pitch submitted successfully';
      toast.success(message);
      setIsOpen(false);
      setOpen?.(false);
    }
  };

  const initVals = useMemo(() => {
    if (pitch) {
      return {
        title: pitch.title,
        assignmentGoogleDocLink: pitch.assignmentGoogleDocLink,
        description: pitch.description,
        topics: pitch.topics,
        conflictOfInterest: pitch.conflictOfInterest ? 'true' : 'false',
        writerIntent: pitch.writer === user?._id ? 'true' : 'false',
      };
    }

    return {
      title: '',
      description: '',
      assignmentGoogleDocLink: '',
      topics: [],
      conflictOfInterest: 'false',
      writerIntent: undefined,
    };
  }, [pitch, user]);

  return (
    <Modal
      trigger={hasTrigger && <PrimaryButton content="Submit Pitch" />}
      open={open || isOpen}
      className="submit-pitch-modal"
      onOpen={() => {
        setIsOpen(true);
        setOpen?.(true);
      }}
      onClose={() => {
        setIsOpen(false);
        setOpen?.(false);
      }}
      {...rest}
    >
      <Modal.Header>
        <span>Submit a pitch</span>
        <div>
          <Popup
            content={HelperMessage()}
            trigger={<Icon size="small" name="info circle" />}
            position="bottom left"
            wide="very"
            hoverable
          />
        </div>
        <Pusher />
        <Icon
          id="close-icon"
          name="times"
          onClick={() => {
            setIsOpen(false);
            setOpen?.(false);
          }}
        />
      </Modal.Header>
      <Modal.Content>
        <SubmitPitchForm
          id="submit-pitch-form"
          initialValues={initVals}
          onSubmit={submitPitch}
        />
      </Modal.Content>
      <Modal.Actions>
        <PrimaryButton
          type="submit"
          content={pitch ? 'Update Pitch' : 'Submit Pitch'}
          form="submit-pitch-form"
        />
      </Modal.Actions>
    </Modal>
  );
};
