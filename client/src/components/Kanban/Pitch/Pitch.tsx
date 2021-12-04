import React, { FC, ReactElement } from 'react';
import { CardProps } from 'semantic-ui-react';
import { IPitch } from 'ssw-common';
import cn from 'classnames';

import './styles.scss';

interface PitchProps extends CardProps {
  pitch: IPitch;
}

const Pitch: FC<PitchProps> = ({ pitch, ...rest }): ReactElement => (
  <div className={cn('kanban-pitch', rest.className)}>
    <p className="pitch-title">{pitch.title}</p>
    <p>Due {pitch.deadline || '01/01/2022'}</p>
  </div>
);

export default Pitch;
