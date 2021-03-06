import React, { ReactElement, useEffect, useState } from 'react';

import { getSampleResponse, isError } from '../utils/apiWrapper';

import PitchDoc from './PitchDoc';

import '../css/Home.css';

function Home(): ReactElement {
  const [text, setText] = useState('You did not run local API!');

  useEffect(() => {
    const populateText = async (): Promise<void> => {
      const resp = await getSampleResponse();
      console.log(resp);

      if (!isError(resp)) {
        setText(resp.data.message);
      }
    };

    populateText();
  }, []);

  return (
    <>
      {/* Temporary until Onboarding Wizard / real home page is merged so I can look at PitchDoc */}
      <PitchDoc></PitchDoc>
      {/* <h1>MERN Template</h1>
      <p>
        Below will tell you if the API is running.
        <br />
        {text}
      </p> */}
    </>
  );
}

export default Home;
