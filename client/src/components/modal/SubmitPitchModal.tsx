import React, { FC, ReactElement, useState } from 'react';
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

export const SubmitPitchModal: FC<ModalProps> = ({ ...rest }): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const submitPitch = async (data: SubmitPitchFields): Promise<void> => {
    const body: Pick<
      Partial<Pitch>,
      | 'title'
      | 'assignmentGoogleDocLink'
      | 'description'
      | 'topics'
      | 'conflictOfInterest'
      | 'writer'
      | 'author'
    > = {
      title: data.title,
      assignmentGoogleDocLink: data.assignmentGoogleDocLink,
      description: data.description,
      topics: data.topics,
      conflictOfInterest: data.conflictOfInterest === 'true',
      writer: user!._id,
      author: user!._id,
    };

    if (data.writerIntent === undefined || data.writerIntent === 'false') {
      body.writer = undefined;
    }

    const res = await apiCall({
      url: '/pitches',
      method: 'POST',
      body,
    });

    if (!isError(res)) {
      toast.success('Pitch successfully submitted!');
      setIsOpen(false);
    }
  };

  return (
    <Modal
      trigger={<PrimaryButton content="Submit Pitch" />}
      open={isOpen}
      className="submit-pitch-modal"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
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
        <Icon id="close-icon" name="times" onClick={() => setIsOpen(false)} />
      </Modal.Header>
      <Modal.Content>
        <SubmitPitchForm
          id="submit-pitch-form"
          initialValues={{
            title: '',
            description: '',
            assignmentGoogleDocLink: '',
            topics: [],
            conflictOfInterest: 'false',
            writerIntent: undefined,
          }}
          onSubmit={submitPitch}
        />
      </Modal.Content>
      <Modal.Actions>
        <PrimaryButton
          type="submit"
          content="Submit"
          form="submit-pitch-form"
        />
      </Modal.Actions>
    </Modal>
  );
};
