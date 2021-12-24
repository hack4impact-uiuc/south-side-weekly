import React, { FC, ReactElement } from 'react';
import { CardProps } from 'semantic-ui-react';
import { IPitch } from 'ssw-common';
import cn from 'classnames';

import './styles.scss';
import { FieldTag } from '../../tags/FieldTag/FieldTag';

interface PitchProps extends CardProps {
  pitch: IPitch;
}

const Pitch: FC<PitchProps> = ({ pitch, ...rest }): ReactElement => (
  <div className={cn('kanban-pitch', rest.className)}>
    <p className="pitch-title">{pitch.title}</p>
    <div className="pitch-info">
      <FieldTag size="small" content={pitch.editStatus} />
      <p className="pitch-text">
        Due{' '}
        {pitch.deadline
          ? new Date(pitch.deadline).toLocaleDateString()
          : new Date().toLocaleDateString()}
      </p>
    </div>
  </div>
);

export default Pitch;
