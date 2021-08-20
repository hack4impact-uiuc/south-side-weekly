import React, { FC, ReactElement } from 'react';

import './styles.scss';

interface IProps {
  value: string;
}

/**
 *
 * @param {string} value the text in the title element
 */
const WizardListTitle: FC<IProps> = ({ value }): ReactElement => (
  <div className="list-title">{value}</div>
);

export default WizardListTitle;
