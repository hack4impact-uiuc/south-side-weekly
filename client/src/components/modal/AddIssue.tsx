import React, { FC, FormEvent, ReactElement, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Button,
  CheckboxProps,
  Form,
  Icon,
  Modal,
  ModalProps,
} from 'semantic-ui-react';
import { IIssue } from 'ssw-common';

import { apiCall, isError } from '../../api';
import { issueTypeEnum } from '../../utils/enums';
import { addTime } from '../../utils/helpers';
import { PrimaryButton } from '../ui/PrimaryButton';
import { Pusher } from '../ui/Pusher';
import './AddIssue.scss';
import './modals.scss';

type FormData = Pick<IIssue, 'releaseDate' | 'type'>;

const defaultData: FormData = {
  releaseDate: '',
  type: '',
};

const AddIssueModal: FC<ModalProps> = ({ ...rest }): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultData);

  const submitIssue = async (): Promise<void> => {
    const res = await apiCall({
      method: 'POST',
      url: '/issues/',
      body: {
        ...formData,
        releaseDate: new Date(addTime(formData.releaseDate)),
      },
    });

    if (!isError(res)) {
      toast.success('Successfully added a new issue!');
      setIsOpen(false);
    } else if (res.error.response.status === 409) {
      toast.error('Issue with this date and type already exists');
    } else {
      console.log(res);
      toast.error('Unable to add a new issue');
    }
  };

  const changeField = <T extends keyof FormData>(
    key: T,
    value: FormData[T],
  ): void => {
    const data = { ...formData };
    data[key] = value;
    setFormData(data);
  };

  const handleRadio = (
    _: FormEvent<HTMLInputElement>,
    { value }: CheckboxProps,
  ): void => {
    changeField('type', value ? (value as string) : '');
  };

  const formatDate = (date: Date | undefined): string => {
    console.log(date);
    return new Date(date || new Date()).toISOString().split('T')[0];
  };

  useEffect(() => {
    setFormData(defaultData);
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      trigger={<PrimaryButton content="Add Issue" icon="add" />}
      className="add-issue-modal"
      {...rest}
    >
      <Modal.Header>
        Add Issue
        <Pusher />
        <Icon name="close" onClick={() => setIsOpen(false)} />
      </Modal.Header>
      <Modal.Content scrolling>
        <div className="modal-content">
          <Form>
            <Form.Input
              type="date"
              className="date-input"
              label="Publication Date"
              onChange={(_, { value }) => {
                if (value) {
                  changeField('releaseDate', formatDate(new Date(value)));
                }
              }}
              value={formData.releaseDate}
            />
            <Form.Group className="issue-type">
              <Form.Radio
                label="Print"
                size="large"
                value={issueTypeEnum.PRINT}
                onChange={handleRadio}
                checked={formData.type === issueTypeEnum.PRINT}
              />
              <Form.Radio
                label="Online"
                size="large"
                value={issueTypeEnum.ONLINE}
                onChange={handleRadio}
                checked={formData.type === issueTypeEnum.ONLINE}
              />
            </Form.Group>
          </Form>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button type="submit" onClick={submitIssue} content="Save" secondary />
      </Modal.Actions>
    </Modal>
  );
};

export default AddIssueModal;
