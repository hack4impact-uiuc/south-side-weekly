import React, { FC, ReactElement } from 'react';

import './styles.css';

interface IProps {
  value: string;
}

/**
 *
 * @param {string} value the text in the title element
 */
const WizardListTitle: FC<IProps> = ({ value }): ReactElement => (
  <div className="list-title-wrapper">
    <div className="list-title">{value}</div>
  </div>
);

export default WizardListTitle;
