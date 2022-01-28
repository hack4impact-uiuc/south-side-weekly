import React, { FC, ReactElement } from 'react';
import { Card, CardProps } from 'semantic-ui-react';
import { Pitch } from 'ssw-common';
import cn from 'classnames';
import { useHistory } from 'react-router-dom';

import { FieldTag } from '../tag/FieldTag';

import './KanbanCard.scss';

interface PitchProps extends CardProps {
  pitch: Pitch;
}

const KanbanCard: FC<PitchProps> = ({ pitch, ...rest }): ReactElement => {
  const history = useHistory();

  return (
    <Card
      onClick={() => history.push(`pitch/${pitch._id}`)}
      className={cn('kanban-pitch', rest.className)}
    >
      <p className="pitch-title">{pitch.title}</p>
      <div className="pitch-info">
        <FieldTag
          size="small"
          name={pitch.editStatus}
          content={pitch.editStatus}
        />
        <p className="pitch-text">
          Due{' '}
          {pitch.deadline
            ? new Date(pitch.deadline).toLocaleDateString()
            : new Date().toLocaleDateString()}
        </p>
      </div>
    </Card>
  );
};

export default KanbanCard;
