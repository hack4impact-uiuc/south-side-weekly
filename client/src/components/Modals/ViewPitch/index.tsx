import React, {
  FC,
  ReactElement,
  useState,
  useEffect,
} from 'react';
import {
  Button,
  Form,
  Modal,
  ModalProps,
  Grid,
  GridColumn,
  Image,
} from 'semantic-ui-react';
import { IPitchAggregate, IPitch } from 'ssw-common';

import { FieldTag } from '../..';
import { aggregatePitch, isError } from '../../../api';


import './styles.scss';

interface ViewPitchProps extends ModalProps {
  pitchId: string;
}

const ViewPitchModal: FC<ViewPitchProps> = ({
  pitchId,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [aggregate, setAggregate] = useState<IPitchAggregate>();

 
  // should this be a callback (and added to the dependency array)
  

  useEffect(() => {
    const getAggregate = async (): Promise<void> => {
      const res = await aggregatePitch(pitchId);
      if (!isError(res)) {
        setAggregate(res.data.result);
        console.log(res.data.result);
      }
    };
    getAggregate();
  }, [pitchId]);


  return (
    <Modal
      trigger={<Button className="default-btn" content="Submit a Pitch" />}
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      className="claim-modal"
      {...rest}
    >
      <Modal.Header content="View Pitch" />
      <Modal.Content>
        <h3> Pitch Title: {aggregate?.title} </h3>
        <div className="teams-section">
          <FieldTag content="Visual Arts"></FieldTag>
          <div className="team">
            <FieldTag content="Visual Arts"></FieldTag>
          </div>
        </div>
        <p className="description">
          pitch description pitch description pitch description
        </p>
        <Grid columns="2">
          <GridColumn>
            <div className="avatar-name">
              <h4>Pitch Creator </h4>
              <div className="avatar-pic">
                <Image
                  src="https://react.semantic-ui.com/images/wireframe/square-image.png"
                  avatar
                />
              </div>
            </div>

            <div className="avatar-name">
              <h4>Pitch Creator: </h4>
              <div className="avatar-pic">
                <Image
                  src="https://react.semantic-ui.com/images/wireframe/square-image.png"
                  avatar
                />
              </div>
            </div>
          </GridColumn>
          <GridColumn>
            <h4>Primary Editor: </h4>
            <h4>Second Editor: </h4>
            <h4>Third Editor: </h4>
          </GridColumn>
        </Grid>
        <span></span>
        <h4> Contributors Currently On Pitch </h4>
        <Grid>
          <GridColumn>
            <p>First, Last Name </p>
          </GridColumn>
        </Grid>
        <Form>
          <Form.Group
            inline
            widths={5}
            className="team-select-group"
          ></Form.Group>
        </Form>
        <div className="contributors-section"></div>
      </Modal.Content>
    </Modal>
  );
};

export default ViewPitchModal;
