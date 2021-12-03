import React, { FC, ReactElement, useState } from 'react';
import {
  Button,
  Form,
  Icon,
  Label,
  Modal,
  ModalProps,
  Rating,
  TextArea,
} from 'semantic-ui-react';
import { ITeam, IUser } from 'ssw-common';

import FieldTag from '../../FieldTag';
import UserChip from '../../UserChip';
import './styles.scss';

interface ClaimPitchProps extends ModalProps {
  user: Partial<IUser>;
  team: ITeam & { target: number };
}

const ContributorFeedback: FC<ClaimPitchProps> = ({
  user,
  team,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      trigger={
        <Label content="Leave Feedback" className="feedback-button" as="a" />
      }
      className="contributor-feedback-modal"
      {...rest}
    >
      <Modal.Header>
        <div className="modal-header">
          Leave Feedback
          <Icon name="close" onClick={() => setIsOpen(false)} />
        </div>
      </Modal.Header>
      <Modal.Content scrolling>
        <div className="modal-content">
          <div className="user-team">
            <UserChip user={user} />
            <FieldTag name={team.name} hexcode={team.color} />
          </div>
          <Rating
            icon="star"
            defaultRating={0}
            maxRating={5}
            className="rating"
            size="huge"
          />
          <Form>
            <TextArea style={{ minHeight: 150 }} />
          </Form>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="submit"
          //onClick={claimPitch}
          content="Submit Claim Request"
          secondary
          //disabled={didUserClaim() || didUserSubmitClaimReq()}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ContributorFeedback;
