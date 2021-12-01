import React, { FC, ReactElement, useEffect, useState } from 'react';
import { CardProps, Segment, Placeholder } from 'semantic-ui-react';
import { IPitch } from 'ssw-common';
import cn from 'classnames';

import { getPitchById, isError } from '../../../api';

import './styles.scss';

interface PitchProps extends CardProps {
  pitchId: string;
}

const Pitch: FC<PitchProps> = ({ pitchId, ...rest }): ReactElement => {
  const [pitch, setPitch] = useState<IPitch>();

  useEffect(() => {
    const fetchPitch = async (): Promise<void> => {
      const res = await getPitchById(pitchId);

      if (!isError(res)) {
        setPitch(res.data.result);
      }
    };

    fetchPitch();
  }, [pitchId]);

  if (!pitch) {
    return (
      <Segment raised>
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line length="medium" />
            <Placeholder.Line length="short" />
          </Placeholder.Paragraph>
        </Placeholder>
      </Segment>
    );
  }

  return (
    <div className={cn('kanban-pitch', rest.className)}>{pitch.title}</div>
  );
};

export default Pitch;
