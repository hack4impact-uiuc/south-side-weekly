import React, { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getSampleResponse, isError } from '../utils/apiWrapper';

import '../css/Home.css';

function Home(): ReactElement {
  const [text, setText] = useState('You did not run local API!');

  useEffect(() => {
    const populateText = async (): Promise<void> => {
      const resp = await getSampleResponse();
      console.log(resp);

      if (!isError(resp)) setText(resp.data.message);
    };

    populateText();
  }, []);

  return (
    <div style={{ border: 'solid black' }}>
      <h1>MERN Template</h1>
      <p>
        Below will tell you if the API is running.
        <br />
        {text}
        <Link to="/join">Join</Link>
      </p>
    </div>
  );
}

export default Home;
