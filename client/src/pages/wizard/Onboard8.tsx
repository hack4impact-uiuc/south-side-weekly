import React, { ReactElement, Dispatch, SetStateAction, FC } from 'react';
import { Button, Modal, ModalContent } from 'semantic-ui-react';
import { openPopupWidget } from 'react-calendly';

import '../../css/wizard/Onboard8.css';
import Onboard8SVG from '../../assets/onboard8.svg';
import RequiredSVG from '../../assets/required.svg';
import CloseSVG from '../../assets/close.svg';

interface IProps {
  isModalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setScheduleConfirmed: Dispatch<SetStateAction<boolean>>;
  handlePageNext(): void;
}

/**
 * Builds and controls the form management for Onboard8 of the Onboarding Wizard
 */
const Onboard8: FC<IProps> = ({
  isModalOpen,
  setModalOpen,
  setScheduleConfirmed,
  handlePageNext,
}): ReactElement => {
  const handleScheduleConfirmation = (): void => {
    setScheduleConfirmed(true);
    setModalOpen(false);
    handlePageNext();
  };

  return (
    <div className="onboard8-wrapper">
      <Modal
        onClose={() => setModalOpen(false)}
        className="confirmation-modal"
        open={isModalOpen}
      >
        <ModalContent className="confirmation-modal-content">
          <Button
            onClick={() => setModalOpen(false)}
            className="close-icon"
            icon
          >
            <img src={CloseSVG} alt="X" />
          </Button>
          <div>
            Please make sure you have scheduled a meeting with a Southside
            Weekly Staff Member. If you couldn’t find a day that works for you,
            please reach out to a Staff Member at amitplaystrumpet@ssw.com.
          </div>
          <div className="button-wrapper">
            <Button
              onClick={handleScheduleConfirmation}
              className="modal-button"
            >
              Submit
            </Button>
          </div>
        </ModalContent>
      </Modal>
      <img className="page-svg" alt="Oboard 8" src={Onboard8SVG} />
      <div className="onboard8-content">
        <div className="page-text">
          Please schedule an Onboarding Session with a Staff Member.
          <img className="required-icon" alt="required" src={RequiredSVG} />
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
};

export default Onboard8;
