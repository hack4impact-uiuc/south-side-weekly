import React, { useEffect, useState, ReactElement } from 'react';
import { IPitch } from 'ssw-common';

import { getUnclaimedPitches, isError } from '../../utils/apiWrapper';
import PitchGrid from '../../components/PitchDoc/PitchGrid';
import ProfileSidebar from '../../components/PitchDoc/SideMenu';
import Logo from '../../assets/ssw-form-header.png';

import '../../css/pitchDoc/PitchDoc.css';

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
      <ProfileSidebar></ProfileSidebar>
      <div className="content">
        <div className="logo-header">
          <img className="logo" alt="SSW Logo" src={Logo} />
        </div>
        <PitchGrid pitches={unclaimedPitches} />
      </div>
    </div>
  );
}

export default PitchDoc;
