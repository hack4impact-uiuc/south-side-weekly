import React, { FC, FormEvent, ReactElement, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Button,
  CheckboxProps,
  Form,
  Icon,
  Label,
  Modal,
  ModalProps,
} from 'semantic-ui-react';
import { IIssue } from 'ssw-common';
import { apiCall, isError } from '../../api';

import { issueTypeEnum } from '../../utils/enums';

import './AddIssue.scss';

interface AddIssueProps extends ModalProps {
  callback: () => Promise<void>;
}

type FormData = Pick<IIssue, 'releaseDate' | 'type'>;

const defaultData: FormData = {
  releaseDate: '',
  type: '',
};

const AddIssue: FC<AddIssueProps> = ({ callback, ...rest }): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultData);

  const submitIssue = async (): Promise<void> => {
    const res = await apiCall({
      method: 'POST',
      url: '/issues/',
      body: formData,
    });

    if (!isError(res)) {
      await callback();
      console.log('SUCCESS');
      toast.success('Successfully added a new issue!');
      setIsOpen(false);
    } else {
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

  const formatDate = (date: Date | undefined): string =>
    new Date(date || new Date()).toISOString().split('T')[0];

  useEffect(() => {
    setFormData(defaultData);
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      trigger={
        <Label className="add-issue" as="a">
          <Icon name="plus" />
          Add Issue
        </Label>
      }
      className="add-issue-modal"
      {...rest}
    >
      <Modal.Header>
        <div className="modal-header">
          Add Issue
          <Icon name="close" onClick={() => setIsOpen(false)} />
        </div>
      </Modal.Header>
      <Modal.Content scrolling>
        <div className="modal-content">
          <Form>
            <Form.Input
              type="date"
              className="date-input"
              label="Publication Date"
              onChange={(_, { value }) =>
                changeField('releaseDate', formatDate(new Date(value)))
              }
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
        <Button
          type="submit"
          onClick={submitIssue}
          content="Save"
          secondary
          //disabled={didUserClaim() || didUserSubmitClaimReq()}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default AddIssue;
