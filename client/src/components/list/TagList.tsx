import React, { FC, ReactElement } from 'react';
import { Interest, InterestFields, Team, TeamFields } from 'ssw-common';
import { LabelProps } from 'semantic-ui-react';

import { FieldTag } from '../tag/FieldTag';

interface TagListProps extends LabelProps {
  tags: TeamFields[] | InterestFields[] | Team[] | Interest[];
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
