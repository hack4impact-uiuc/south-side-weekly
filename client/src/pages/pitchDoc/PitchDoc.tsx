import React, { ReactElement, useEffect, useState } from 'react';

import { getUnclaimedPitches, isError } from '../../utils/apiWrapper';

function PitchDoc(): ReactElement {
  const [unclaimedPitches, setUnclaimedPitches] = useState({});

  useEffect(() => {
    const showUnclaimedPitches = async (): Promise<void> => {
      const resp = await getUnclaimedPitches();
      console.log(resp);

      if (!isError(resp)) {
        setUnclaimedPitches(resp.data.message);
      }
    };

    showUnclaimedPitches();
  }, []);

  return (
    <>
      <h1>Pitch Doc</h1>
      <p>
        hi
        <br />
      </p>
    </>
  );
}

export default PitchDoc;
