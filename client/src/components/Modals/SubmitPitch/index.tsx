import { isEmpty, startCase, toLower, toString } from 'lodash';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Button, Form, Modal, ModalProps } from 'semantic-ui-react';

import { createPitch, isError } from '../../../api';
import { useAuth } from '../../../contexts';
import { allInterests } from '../../../utils/constants';

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
  const [didAgree, setDidAgree] = useState(false);
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
    setDidAgree(false);
    setDidSubmit(false);
  }, []);

  const submitPitch = async (): Promise<void> => {
    setDidSubmit(true);

    if (!isInvalidForm()) {
      const body = {
        name: title,
        pitchAuthor: user._id,
        assignmentGoogleDocLink: link,
        pitchStatus: 'PENDING',
        pitchDescription: description,
        topics: Array.from(topics),
      };

      const res = await createPitch({ ...body });

      if (!isError(res)) {
        callback();
        setIsOpen(false);
      }
    }

    return;
  };

  const isInvalidForm = (): boolean =>
    [title, description, link, topics].every(isEmpty) && !didAgree;
  interface FieldError {
    content: string;
    pointing: 'left' | 'above' | 'below' | 'right';
  }
  const isFieldError = (
    field: string | Set<string> | boolean,
  ): FieldError | boolean => {
    const message: FieldError = {
      content: 'You must fill out this field',
      pointing: 'above',
    };

    if (typeof field === 'boolean') {
      return didSubmit && !didAgree;
    }

    if (didSubmit && isEmpty(field)) {
      if (field instanceof Set) {
        return true;
      }

      return message;
    }

    return false;
  };

  return (
    <Modal
      trigger={<Button className="default-btn" content="Submit Pitch" />}
      open={isOpen}
      className="submit-modal"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      {...rest}
    >
      <Modal.Header content="Submit a pitch" />
      <Modal.Content>
        <Form>
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
                label={startCase(toLower(topic))}
                checked={topics.has(topic)}
                onClick={(e, { value }) => addTopic(toString(value))}
                value={topic}
              />
            ))}
          </Form.Group>
          <h3>Conflict of Interest Discolsure</h3>
          <p>
            By clicking "I agree", you agree that you are not involved with the
            events or people covered in your pitch. i.e. do you have a
            relationship with them as an employee, family memember, friend, or
            donor?
          </p>
          <Form.Checkbox
            checked={didAgree}
            onClick={() => setDidAgree(!didAgree)}
            error={isFieldError(didAgree)}
            label="I agree"
          />
        </Form>
        <Modal.Actions>
          <Button
            type="submit"
            onClick={submitPitch}
            content="Submit pitch for review"
            positive
          />
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
};

export default SubmitPitchModal;
