import { isEmpty, isUndefined, toString } from 'lodash';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  Button,
  Form,
  Icon,
  Modal,
  ModalProps,
  Popup,
  Header,
} from 'semantic-ui-react';
import { IPitch } from 'ssw-common';
import Swal from 'sweetalert2';

import { InterestsSelect } from '../..';
import { createPitch, isError } from '../../../api';
import { useAuth } from '../../../contexts';

import './styles.scss';

const MAX_LENGTH = 300;

interface SubmitPitchModalProps extends ModalProps {
  callback(): void;
}

const notify = (): string =>
  toast.error('Please fill out all the fields before submitting!', {
    position: 'bottom-right',
  });

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

const SubmitPitchModal: FC<SubmitPitchModalProps> = ({
  callback,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [conflictofInterest, setConflictOfInterest] = useState<
    boolean | undefined
  >();
  const [didSubmit, setDidSubmit] = useState(false);
  const [writerChoice, setWriterChoice] = useState<boolean>();
  const { user } = useAuth();

  useEffect(() => {
    setTitle('');
    setDescription('');
    setLink('');
    setConflictOfInterest(undefined);
    setDidSubmit(false);
    setWriterChoice(undefined);
    setTopics([]);
  }, [isOpen]);

  const submitPitch = async (): Promise<void> => {
    setDidSubmit(true);

    if (isInvalidForm()) {
      notify();
      return;
    }

    let body: Partial<IPitch> = {
      title: title,
      author: user._id,
      assignmentGoogleDocLink: link,
      status: 'PENDING',
      description: description,
      topics: topics,
      conflictOfInterest: conflictofInterest!,
    };

    if (writerChoice) {
      body = { ...body, writer: user._id };
    }

    const res = await createPitch({ ...body });

    if (!isError(res)) {
      callback();
      Swal.fire({
        title: 'Successfully submitted pitch!',
        icon: 'success',
      });

      setIsOpen(false);
    }

    return;
  };

  const isInvalidForm = (): boolean =>
    [title, description, link, topics].some(isEmpty) ||
    isUndefined(conflictofInterest);

  const isFieldError = (
    field: string | Set<string> | boolean | undefined,
  ): boolean => {
    if (!didSubmit) {
      return false;
    }

    if (isUndefined(field)) {
      return true;
    } else if ((field instanceof Set && isEmpty(field)) || field === '') {
      return true;
    }

    return false;
  };

  return (
    <div>
      <Toaster></Toaster>
      <Modal
        trigger={<Button className="default-btn" content="Submit a Pitch" />}
        open={isOpen}
        className="submit-modal"
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        {...rest}
      >
        <Modal.Header>
          <span style={{ paddingRight: '10px' }}>Submit a pitch</span>
          <Popup
            content={HelperMessage()}
            trigger={<Icon size="small" name="info circle" />}
            position="bottom left"
            wide="very"
            hoverable
          />
        </Modal.Header>
        <Modal.Content>
          <Form id="submit-pitch" onSubmit={submitPitch}>
            <Form.Group widths="equal">
              <Form.Input
                error={isFieldError(title)}
                label={<h5 className="label">Pitch Title</h5>}
                value={title}
                onChange={(e, { value }) => setTitle(value)}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                error={isFieldError(link)}
                label={<h5 className="label">Google Doc Link</h5>}
                value={link}
                onChange={(e, { value }) => setLink(value)}
              />
            </Form.Group>
            <Form.TextArea
              maxLength={MAX_LENGTH}
              value={description}
              onChange={(e, { value }) => setDescription(toString(value))}
              label={<h5 className="label">Description</h5>}
              error={isFieldError(description)}
            />
            <h5 className="label-topics">
              Associated Topics<p className="unbold">(select 1-4 topics) </p>
            </h5>
            <InterestsSelect
              values={topics}
              onChange={(values) => {
                if (values.length <= 4) {
                  setTopics(values.map((item) => item.value));
                }
              }}
            />
            {user.role === 'WRITER' ? (
              <div>
                {' '}
                <h5 className="label">
                  Do you want to be the writer of the story?{' '}
                </h5>
                <Form.Group inline>
                  <Form.Radio
                    name="writer-choice"
                    label="Yes"
                    onClick={() => setWriterChoice(true)}
                    checked={writerChoice}
                    error={isFieldError(writerChoice)}
                  />
                  <Form.Radio
                    name="writer-choice"
                    label="No, I want someone else to write the story"
                    onClick={() => setWriterChoice(false)}
                    checked={!isUndefined(writerChoice) && !writerChoice}
                    error={isFieldError(writerChoice)}
                  />
                </Form.Group>{' '}
              </div>
            ) : (
              <></>
            )}

            <h5 className="label">Conflict of Interest Disclosure</h5>
            <p>
              Are you involved with the events or people covered in your pitch?
              i.e. do you have a relationship with them as an employee, family
              member, friend, or donor?
            </p>
            <Form.Group inline>
              <Form.Radio
                name="interest-conflict"
                label="Yes"
                onClick={() => setConflictOfInterest(true)}
                checked={conflictofInterest}
                error={isFieldError(conflictofInterest)}
              />
              <Form.Radio
                name="interest-conflict"
                label="No"
                onClick={() => setConflictOfInterest(false)}
                checked={
                  !isUndefined(conflictofInterest) && !conflictofInterest
                }
                error={isFieldError(conflictofInterest)}
              />
            </Form.Group>
          </Form>
          <Modal.Actions>
            <Button
              type="submit"
              content="Submit"
              positive
              form="submit-pitch"
            />
          </Modal.Actions>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default SubmitPitchModal;
