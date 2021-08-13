import React, { FC, ReactElement } from 'react';
import { Modal, ModalProps } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';

const Loading: FC<ModalProps> = ({ ...rest }): ReactElement => (
  <Modal size="mini" {...rest}>
    <Modal.Content>
      <Loader type="MutatingDots" height={100} width={100} />
    </Modal.Content>
  </Modal>
);

export default Loading;
