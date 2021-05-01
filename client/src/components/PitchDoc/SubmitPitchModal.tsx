import React, { ReactElement, useEffect, useState } from 'react';
import { Modal, Button, Form, Checkbox, Grid } from 'semantic-ui-react';

import { interestsButtonsMap } from '../../utils/constants';
import { pitchStatusEnum, assignmentStatusEnum } from '../../utils/enums';
import { createPitch, isError } from '../../utils/apiWrapper';
import '../../css/pitchDoc/SubmitPitchModal.css';

function SubmitPitchModal(): ReactElement {
  const [firstOpen, setFirstOpen] = useState<boolean>(false);
  const [secondOpen, setSecondOpen] = useState<boolean>(false);
  const [radioValue, setRadioValue] = useState<string | number | undefined>('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [pitchTitle, setPitchTitle] = useState<string>('');
  const [pitchDescription, setPitchDescription] = useState<string>('');
  const [pitchLink, setPitchLink] = useState<string>('');
  //TODO: replace hardcoded value with actual current user
  const userId = '6031a866c70ec705736a79e5';

  const pitchData: { [key: string]: number | string | string[] | boolean } = {
    name: pitchTitle,
    pitchDescription: pitchDescription,
    assignmentGoogleDocLink: pitchLink,
    pitchStatus: pitchStatusEnum.PENDING,
    assignmentStatus: assignmentStatusEnum.NONE,
    topics: selectedTopics,
    pitchAuthor: userId,
    conflictOfInterest: radioValue ? true : false,
  };

  const handleCheckboxes = (topic: string): void => {
    const notFoundIdx = -1;
    const elementIdx = selectedTopics.indexOf(topic);
    if (elementIdx === notFoundIdx) {
      const addedElements = selectedTopics.concat(topic);
      setSelectedTopics(addedElements);
    } else {
      const removedElements = selectedTopics.filter(
        (element) => element !== topic,
      );
      setSelectedTopics(removedElements);
    }
  };

  const submitPitch = async (): Promise<void> => {
    const res = await createPitch(pitchData);
    if (!isError(res)) {
      setSecondOpen(true);
    }
  };

  useEffect(() => {
    setRadioValue('');
    setSelectedTopics([]);
    setPitchTitle('');
    setPitchDescription('');
    setPitchLink('');
  }, [firstOpen]);
  return (
    <>
      <Modal
        className="submit-pitch-modal"
        onClose={() => setFirstOpen(false)}
        onOpen={() => setFirstOpen(true)}
        open={firstOpen}
        trigger={
          <Button className="submit-pitch-button"> Submit a Pitch </Button>
        }
        closeIcon
      >
        <Modal.Actions>
          <div className="submit-pitch-wrapper">
            <div className="header">
              <div className="title">Submit a Pitch</div>
              <div className="description">
                Please select the relevant topics this pitch relates to:
              </div>
            </div>
            <div className="form-section">
              <div className="checkbox-section">
                {interestsButtonsMap.map((interest, idx) => (
                  <Checkbox
                    key={idx}
                    className="item"
                    label={interest.display}
                    onClick={() => handleCheckboxes(interest.value)}
                  />
                ))}
              </div>
              <div className="input-section">
                <Form className="submit-pitch-form">
                  <Form.Input
                    fluid
                    label="Pitch Title"
                    placeholder="Pitch title"
                    onChange={(e) => setPitchTitle(e.currentTarget.value)}
                  />
                  <Form.TextArea
                    fluid
                    label="Summarize Pitch in 1-2 Sentences (300 character limit)"
                    placeholder="Pitch summary"
                    onChange={(e) => setPitchDescription(e.currentTarget.value)}
                  />
                  <Grid columns={2}>
                    <Grid.Row className="top-row">
                      <Grid.Column>
                        <Form.Input
                          fluid
                          label="Link to Google Doc"
                          placeholder="Pitch Google Doc Link"
                          onChange={(e) => setPitchLink(e.currentTarget.value)}
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <div className="disclosure-title">
                          Conflict of Interest Disclosure
                        </div>
                        <div>
                          Are you involved with the events or people covered in
                          your pitch? i.e. do you have a relationship with them
                          as an employee, family member, friend, or donor?
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="bottom-row">
                      <Grid.Column textAlign="center">
                        <Button
                          fluid
                          className="submit-button"
                          content="Submit My Pitch For Review!"
                          onClick={submitPitch}
                        />
                      </Grid.Column>
                      <Grid.Column
                        className="radio-buttons"
                        verticalAlign="middle"
                      >
                        <Form.Group>
                          <Form.Radio
                            className="yes-radio"
                            value={1}
                            checked={radioValue === 1}
                            onClick={(e, { value }) => setRadioValue(value)}
                            label="Yes"
                          />
                          <Form.Radio
                            value={0}
                            checked={radioValue === 0}
                            onClick={(e, { value }) => setRadioValue(value)}
                            label="No"
                          />
                        </Form.Group>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Form>
              </div>
            </div>
          </div>
        </Modal.Actions>
      </Modal>

      <Modal
        onClose={() => {
          setSecondOpen(false);
          setFirstOpen(false);
        }}
        onOpen={() => setFirstOpen(false)}
        open={secondOpen}
        className="submit-pitch-success"
        closeIcon
      >
        <Modal.Actions>
          <div className="success-wrapper">
            <div className="text">
              You successfully submitted your Pitch! Once approved, it will show
              up on the Pitch Doc.
            </div>
          </div>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default SubmitPitchModal;
