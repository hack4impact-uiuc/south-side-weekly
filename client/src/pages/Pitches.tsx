import React, { ReactElement, useState, useEffect } from 'react';

import SSWTitle from '../assets/ssw-form-header.png';
import Sidebar from '../components/Sidebar';

const Pitches = (): ReactElement => {
  const [temp, setTemp] = useState<string>('DEFAULT_TEMP');

  useEffect(() => {
    if (temp === 'DEFAULT_TEMP') {
      setTemp('PASS LINT');
    }
  }, [temp]);

  return (
    <>
      <Sidebar />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <img style={{ width: '40%' }} src={SSWTitle} alt="South Side Weekly" />
      </div>
      <div className="pitches-wrapper"></div>
    </>
  );
};

export default Pitches;
