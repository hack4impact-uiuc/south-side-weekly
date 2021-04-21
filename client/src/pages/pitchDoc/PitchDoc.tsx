import React, { useEffect, useState, ReactElement } from 'react';
import { IPitch } from 'ssw-common';
import { Grid, Search } from 'semantic-ui-react';

import { getUnclaimedPitches, isError } from '../../utils/apiWrapper';
import PitchGrid from '../../components/PitchDoc/PitchGrid';
import ProfileSidebar from '../../components/PitchDoc/Sidebar';
import SubmitPitchModal from '../../components/PitchDoc/SubmitPitchModal';
import Logo from '../../assets/ssw-form-header.png';

import '../../css/pitchDoc/PitchDoc.css';
import PitchCard from '../../components/PitchDoc/PitchCard';

function PitchDoc(): ReactElement {
  const [unclaimedPitches, setUnclaimedPitches] = useState<IPitch[]>([]);

  const getAllUnclaimedPitches = async (): Promise<void> => {
    const resp = await getUnclaimedPitches();

    if (!isError(resp) && resp.data) {
      setUnclaimedPitches(resp.data.result);
      console.log(resp.data.result);
    }
  };
  
  useEffect(() => {
    getAllUnclaimedPitches();
  }, []);  

  return (
    <>
      <ProfileSidebar></ProfileSidebar>
      <div className="logo-header">
        <img className="logo" alt="SSW Logo" src={Logo} />
      </div>

      <div className="content-wrapper">
        <div className="top-section">
          <div className="pitchdoc-title">The Pitch Doc</div>
          <div className="submit-search-section">
            <SubmitPitchModal />
            <Search className="search-bar"> </Search>
          </div>

          <div className="container">
            <div className="filter-section">
              <div className="filter-text"> Filter/Sort By: </div>
              {/* <Dropdown placeholder='Roles' /> */}
            </div>
          </div>
        </div>

        <div className="pitch-grid">
          <PitchGrid pitches={unclaimedPitches} getAllUnclaimedPitches={getAllUnclaimedPitches} />
        </div>
      </div>
    </>
  );
}

export default PitchDoc;
