import { isEqual, startsWith, toLower, toString } from 'lodash';
import React, { ReactElement, useEffect, useState } from 'react';

import './styles.scss';

const PitchDoc = (): ReactElement => {
  const [approved, setApproved] = useState<IPitch[]>([]);

  return <div className="pitch-doc-wrapper"></div>;
};

export default PitchDoc;
