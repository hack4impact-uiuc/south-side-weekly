import React, { useEffect, useState, ReactElement, useMemo } from 'react';
import { IPitch } from 'ssw-common';
import { Dropdown, Search } from 'semantic-ui-react';

import { pages } from '../../utils/enums';
import {
  parseArrayToSemanticDropdownOptions,
  parseSemanticMultiSelectTypes,
} from '../../utils/helpers';
import Sidebar from '../../components/Sidebar';
import { getUnclaimedPitches, isError } from '../../utils/apiWrapper';
import PitchGrid from '../../components/PitchDoc/PitchGrid';
import SubmitPitchModal from '../../components/PitchDoc/SubmitPitchModal';
import Logo from '../../assets/ssw-form-header.png';

import '../../css/pitchDoc/PitchDoc.css';

interface IFilterKeys {
  role: string;
  date: string;
  interests: string[];
  status: string;
}

const initialFilterKeys: IFilterKeys = {
  role: '',
  date: '',
  interests: [],
  status: '',
};

function PitchDoc(): ReactElement {
  const [unclaimedPitches, setUnclaimedPitches] = useState<IPitch[]>([]);
  const [filterKeys, setFilterKeys] = useState<IFilterKeys>(initialFilterKeys);

  const roleOptions = useMemo(
    () =>
      parseArrayToSemanticDropdownOptions([
        'Contributor',
        'Staff',
        'Admin',
        'Tbd',
      ]),
    [],
  );

  const dateOptions = useMemo(
    () =>
      parseArrayToSemanticDropdownOptions([
        'Earliest to Latest',
        'Latest to Earliest',
      ]),
    [],
  );

  const interestOptions = useMemo(
    () =>
      parseArrayToSemanticDropdownOptions([
        'Cannabis',
        'Food & Land',
        'Fun',
        'Health',
        'Housing',
        'Immigration',
        'Lit',
        'Music',
        'Nature',
        'Politics',
        'Stage and Screen',
        'Transportation',
        'Visual Arts',
      ]),
    [],
  );

  const claimOptios = useMemo(
    () => parseArrayToSemanticDropdownOptions(['Unclaimed', 'Claimed']),
    [],
  );

  const getAllUnclaimedPitches = async (): Promise<void> => {
    const resp = await getUnclaimedPitches();

    if (!isError(resp) && resp.data) {
      setUnclaimedPitches(resp.data.result);
    }
  };

  useEffect(() => {
    getAllUnclaimedPitches();
  }, []);

  /**
   * Updates the filter key state.
   *
   * @param key the filter key to update
   * @param newValue the new value to set the filter key's value to
   */
  const updateFilterKeys = (
    key: keyof IFilterKeys,
    newValue: string | string[],
  ): void => {
    const keys: IFilterKeys = { ...filterKeys };

    switch (key) {
      case 'role':
      case 'date':
      case 'status':
        keys[key] = `${newValue}`;
        break;
      case 'interests':
        if (Array.isArray(newValue)) {
          keys[key] = newValue;
        }
        break;
      default:
        console.error('Invalid filter key');
        break;
    }

    setFilterKeys({ ...keys });
  };

  return (
    <>
      <Sidebar currentPage={pages.PITCHES} />
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
            <div className="filters">
              <h2>Filter by: </h2>
              <Dropdown
                className="custom-dropdown"
                text="Roles"
                options={roleOptions}
                scrolling
                clearable
                selectOnBlur={false}
                selectOnNavigation={false}
                onChange={(e, { value }) =>
                  updateFilterKeys('role', `${value}`)
                }
              />
              <Dropdown
                className="custom-dropdown"
                text="Date Joined"
                options={dateOptions}
                scrolling
                clearable
                selectOnNavigation={false}
                selectOnBlur={false}
                onChange={(e, { value }) =>
                  updateFilterKeys('date', `${value}`)
                }
              />
              <Dropdown
                className="custom-dropdown"
                text="Topics of Interest"
                options={interestOptions}
                scrolling
                multiple
                clearable
                selectOnNavigation={false}
                selectOnBlur={false}
                onChange={(e, { value }) =>
                  updateFilterKeys(
                    'interests',
                    parseSemanticMultiSelectTypes(value!),
                  )
                }
              />
              <Dropdown
                className="custom-dropdown"
                text="Claim Status"
                options={claimOptios}
                scrolling
                multiple
                clearable
                selectOnNavigation={false}
                selectOnBlur={false}
                onChange={(e, { value }) =>
                  updateFilterKeys('status', `${value}`)
                }
              />
            </div>
          </div>
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
