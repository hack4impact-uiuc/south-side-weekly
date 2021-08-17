import { isEmpty, isUndefined, toString } from 'lodash';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Button, Form, Modal, ModalProps } from 'semantic-ui-react';
import Swal from 'sweetalert2';

import { createPitch, isError } from '../../../api';
import { useAuth } from '../../../contexts';
import { allInterests } from '../../../utils/constants';
import { titleCase } from '../../../utils/helpers';

import './styles.scss';

const MAX_LENGTH = 300;

interface SubmitPitchModalProps extends ModalProps {
  callback(): void;
}

const SubmitPitchModal: FC<SubmitPitchModalProps> = ({
  callback,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [topics, setTopics] = useState(new Set<string>());
  const [conflictofInterest, setConflictOfInterest] = useState<
    boolean | undefined
  >(undefined);
  const [didSubmit, setDidSubmit] = useState(false);

  const { user } = useAuth();

  const addTopic = (topic: string): void => {
    topics.has(topic) ? topics.delete(topic) : topics.add(topic);
    setTopics(new Set(topics));
  };

  useEffect(() => {
    setTitle('');
    setDescription('');
    setLink('');
    setTopics(new Set());
    setConflictOfInterest(undefined);
    setDidSubmit(false);
  }, [isOpen]);

  const submitPitch = async (): Promise<void> => {
    setDidSubmit(true);

    if (!isInvalidForm()) {
      const body = {
        title: title,
        author: user._id,
        assignmentGoogleDocLink: link,
        status: 'PENDING',
        description: description,
        topics: Array.from(topics),
        conflictOfInterest: conflictofInterest!,
      };

      const res = await createPitch({ ...body });

      if (!isError(res)) {
        callback();
        Swal.fire({
          title: 'Successfully submitted pitch!',
          icon: 'success',
        });
        setIsOpen(false);
      }
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
    } else if (field instanceof Set && isEmpty(field)) {
      return true;
    }

    return false;
  };

  return (
    <Modal
      trigger={<Button className="default-btn" content="Submit a Pitch" />}
      open={isOpen}
      className="submit-modal"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      {...rest}
    >
      <Modal.Header content="Submit a pitch" />
      <Modal.Content>
        <Form id="submit-pitch" onSubmit={submitPitch}>
          <Form.Group widths="equal">
            <Form.Input
              required
              error={isFieldError(title)}
              label="Title"
              value={title}
              onChange={(e, { value }) => setTitle(value)}
              size="small"
            />
            <Form.Input
              required
              error={isFieldError(link)}
              label={'Link to Google Doc'}
              value={link}
              onChange={(e, { value }) => setLink(value)}
              size="small"
            />
          </Form.Group>

          <Form.TextArea
            required
            maxLength={MAX_LENGTH}
            value={description}
            onChange={(e, { value }) => setDescription(toString(value))}
            label="Description"
            error={isFieldError(description)}
          />

          <h3>Topics (Please select at least 1 topic)</h3>
          <Form.Group inline widths="4" className="checkbox-group">
            {allInterests.map((topic, index) => (
              <Form.Checkbox
                error={isFieldError(topics)}
                className="checkbox"
                key={index}
                label={titleCase(topic)}
                checked={topics.has(topic)}
                onClick={(e, { value }) => addTopic(toString(value))}
                value={topic}
              />
            ))}
          </Form.Group>
          <h3>Conflict of Interest Discolsure</h3>
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
              checked={!isUndefined(conflictofInterest) && !conflictofInterest}
              error={isFieldError(conflictofInterest)}
            />
          </Form.Group>
        </Form>
        <Modal.Actions>
          <Button
            type="submit"
            content="Submit pitch for review"
            positive
            form="submit-pitch"
          />
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
};

export default SubmitPitchModal;
