import React, { ReactElement, Dispatch, SetStateAction, FC } from 'react';
import { Button, Modal, ModalContent } from 'semantic-ui-react';
import { openPopupWidget } from 'react-calendly';

import '../../css/wizard/Onboard8.css';
import WizardSvg from '../../components/WizardSvg';
import WizardStar from '../../components/WizardStar';

interface IProps {
  isModalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setScheduleConfirmed: Dispatch<SetStateAction<boolean>>;
}

/**
 * Builds and controls the form management for Onboard8 of the Onboarding Wizard
 */
const Onboard8: FC<IProps> = ({
  isModalOpen,
  setModalOpen,
  setScheduleConfirmed,
}): ReactElement => (
  <div className="onboard8-wrapper">
    <Modal
      onClose={() => setModalOpen(false)}
      className="confirmation-modal"
      open={isModalOpen}
      closeIcon
    >
      <ModalContent className="confirmation-modal-content">
        <div>
          Please make sure you have scheduled a meeting with a South Side Weekly
          Staff Member. If you couldn’t find a day that works for you, please
          reach out to a Staff Member at amitplaystrumpet@ssw.com.
        </div>
        <div className="button-wrapper">
          <Button
            onClick={() => setScheduleConfirmed(true)}
            className="modal-button"
          >
            Complete Sign-Up
          </Button>
        </div>
      </ModalContent>
    </Modal>
    <WizardSvg page="onboard8" />
    <div className="onboard8-content">
      <div className="page-text">
        <WizardStar />
        Please schedule an Onboarding Session with a Staff Member.
      </div>
      <Button
        className="calendly-btn"
        onClick={() =>
          openPopupWidget({ url: 'https://calendly.com/sawhney4/60min' })
        }
      >
        Schedule meeting
      </Button>
    </div>
  </div>
);

export default Onboard8;
