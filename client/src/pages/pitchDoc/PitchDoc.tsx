import React, { useEffect, useState, ReactElement } from 'react';
import { IPitch } from 'ssw-common';
import { Button, Search } from 'semantic-ui-react';

import { pages } from '../../utils/enums';
import Sidebar from '../../components/Sidebar';
import {
  getUnclaimedPitches,
  getCurrentUser,
  isError,
} from '../../utils/apiWrapper';
import PitchGrid from '../../components/PitchDoc/PitchGrid';
import SubmitPitchModal from '../../components/PitchDoc/SubmitPitchModal';
import Logo from '../../assets/ssw-form-header.png';

import '../../css/pitchDoc/PitchDoc.css';

function PitchDoc(): ReactElement {
  const [unclaimedPitches, setUnclaimedPitches] = useState<IPitch[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const res = await getCurrentUser();

      if (!isError(res) && res.data.result.role === 'ADMIN') {
        setIsAdmin(true);
      }
    };

    getUser();
  }, []);

  const getAllUnclaimedPitches = async (): Promise<void> => {
    const resp = await getUnclaimedPitches();

    if (!isError(resp) && resp.data) {
      setUnclaimedPitches(resp.data.result);
    }
  };

  useEffect(() => {
    getAllUnclaimedPitches();
  }, []);

  return (
    <>
      <Sidebar currentPage={pages.PITCHES} />
      <div className="logo-header">
        <img className="logo" alt="SSW Logo" src={Logo} />
      </div>

      <div className="content-wrapper">
        <div className="top-section">
          <div className="pitchdoc-title">
            {isAdmin ? 'Pitch Approval' : 'The Pitch Doc'}
          </div>

          {isAdmin ? (
            <div className="buttons-section">
              <Button className="admin-pitch-btn">Unclaimed Pitches</Button>
              <Button className="admin-pitch-btn">
                Pitches Pending Approval
              </Button>
              <Button className="admin-pitch-btn">
                Claims Pending Approval
              </Button>
            </div>
          ) : (
            ''
          )}

          <div className="submit-search-section">
            <SubmitPitchModal />
            <Search className="search-bar"> </Search>
          </div>

          <div className="container">
            <div className="filter-section">
              <div className="filter-text"> Filter/Sort By: </div>
            </div>
          </div>

          {isAdmin ? <div>Approve Pitches:</div> : ''}
        </div>

        <div className="pitch-grid">
          <PitchGrid
            pitches={unclaimedPitches}
            getAllUnclaimedPitches={getAllUnclaimedPitches}
          />
        </div>
      </div>
    </>
  );
}

export default PitchDoc;
