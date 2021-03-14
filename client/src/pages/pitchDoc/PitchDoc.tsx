import React, { useEffect, useState, ReactElement } from 'react';
import { IPitch } from 'ssw-common';

import { getUnclaimedPitches, isError } from '../../utils/apiWrapper';
import PitchGrid from '../../components/PitchDoc/PitchGrid';
import Logo from '../../assets/ssw-form-header.png';

function PitchDoc(): ReactElement {
  const [unclaimedPitches, setUnclaimedPitches] = useState<IPitch[]>([]);

  useEffect(() => {
    const getAllUnclaimedPitches = async (): Promise<void> => {
      const resp = await getUnclaimedPitches();

      if (!isError(resp) && resp.data) {
        setUnclaimedPitches(resp.data.result);
        console.log(resp.data.result);
      }
    };

    getAllUnclaimedPitches();
  }, []);

  return (
    <div>
      <div className="logo-header">
        <img className="logo" alt="SSW Logo" src={Logo} />
      </div>
      <PitchGrid pitches={unclaimedPitches} />
    </div>
  );
}

export default PitchDoc;
