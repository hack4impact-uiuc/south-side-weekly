import React, { FC, ReactElement } from 'react';
import { Modal, ModalProps } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';

import './styles.scss';

const Loading: FC<ModalProps> = ({ ...rest }): ReactElement => (
  <Modal dimmer="blurring" className="loading-modal" size="mini" {...rest}>
    <Modal.Content>
      <div className="spinner">
        <Loader color="white" type="Bars" height={150} width={150} />
      </div>
    </Modal.Content>
  </Modal>
);

export default Loading;
