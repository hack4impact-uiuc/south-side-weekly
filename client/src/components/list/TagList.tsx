import React, { FC, ReactElement } from 'react';
import { Interest, Team } from 'ssw-common';
import { LabelProps } from 'semantic-ui-react';

import { FieldTag } from '../tag/FieldTag';

interface TagListProps extends LabelProps {
  tags: Team[] | Interest[];
}

export const TagList: FC<TagListProps> = ({
  tags,
  size = 'small',
  ...rest
}): ReactElement => (
  <>
    {tags.map((tag) => (
      <FieldTag
        {...rest}
        size={size}
        key={tag._id}
        name={tag.name}
        hexcode={tag.color}
      />
    ))}
  </>
);
