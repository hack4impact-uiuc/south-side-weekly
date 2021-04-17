import React, { ReactElement, useState } from 'react';

import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import PitchCard from '../../components/PitchCard';
import { pages } from '../../utils/enums';

import '../../css/Homepage.css';

function Homepage(): ReactElement {
  const [toggle, setToggle] = useState(true);
  const claimedPitches = [
    {
      title: 'Title of Pitch',
      description:
        'Here lies the two sentence summary of this pitch. It will only be two sentences and no more.',
      status: 'Writing',
      category: 'Education',
    },
    {
      title: 'Here is a Super Super Long Title of Pitch',
      description: 'This is two sentences. I swear.',
      status: 'Editing',
      category: 'Visual Arts',
    },
    {
      title: 'Title',
      description: 'This is two sentences. I swear.',
      status: 'Editing',
      category: 'Visual Arts',
    },
    {
      title:
        'Title of Pitch that is so so so long that it probably goes onto a couple lines or maybe even a few',
      description:
        'Here lies the two sentence summary of this pitch and also it just happens to be really unnecessarily long. It will only be two sentences and no more, but it could be a run-on sentence and that could be bad.',
      status: 'Writing',
      category: 'Education',
    },
    {
      title: 'Here is a Super Super Long Title of Pitch',
      description: 'This is two sentences. I swear.',
      status: 'Editing',
      category: 'Visual Arts',
    },
    {
      title: 'Title',
      description: 'This is two sentences. I swear.',
      status: 'Editing',
      category: 'Visual Arts',
    },
  ];

  const submittedPitches = [
    {
      title: 'Title of Pitch',
      description:
        'Here lies the two sentence summary of this pitch. It will only be two sentences and no more.',
      status: 'Writing',
      category: 'Education',
    },
    {
      title: 'Here is a Super Super Long Title of Pitch',
      description: 'This is two sentences. I swear.',
      status: 'Editing',
      category: 'Visual Arts',
    },
    {
      title: 'Title',
      description: 'This is two sentences. I swear.',
      status: 'Editing',
      category: 'Visual Arts',
    },
    {
      title: 'Here is a Super Super Long Title of Pitch',
      description: 'This is two sentences. I swear.',
      status: 'Editing',
      category: 'Visual Arts',
    },
    {
      title: 'Title',
      description: 'This is two sentences. I swear.',
      status: 'Editing',
      category: 'Visual Arts',
    },
  ];

  const togglePitches = (): void => {
    setToggle(!toggle);
    const claimed = document.getElementById('claimed-tab');
    if (claimed) {
      claimed.classList.toggle('active-tab');
    }

    const submitted = document.getElementById('submitted-tab');
    if (submitted) {
      submitted.classList.toggle('active-tab');
    }
  };

  return (
    <>
      <Sidebar currentPage={pages.HOME} />
      <Header />
      <div className="body">
        <div className="header">
          <h2 className="sub-heading">Welcome back, Mustafa!</h2>
        </div>
        <div className="tabs">
          <button
            id="claimed-tab"
            className="tab active-tab"
            onClick={togglePitches}
          >
            Claimed
          </button>
          <button id="submitted-tab" className="tab" onClick={togglePitches}>
            Submitted
          </button>
        </div>
        {toggle ? (
          <div className="section">
            <div className="section-title">
              <h3>Claimed Pitches</h3>
            </div>
            <div className="section-grid">
              {claimedPitches.map((elem, idx) => (
                <PitchCard
                  key={idx}
                  title={elem.title}
                  description={elem.description}
                  status={elem.status}
                  category={elem.category}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="section">
            <div className="section-title">
              <h3>Submitted Pitches</h3>
            </div>
            <div className="section-grid">
              {submittedPitches.map((elem, idx) => (
                <PitchCard
                  key={idx}
                  title={elem.title}
                  description={elem.description}
                  status={elem.status}
                  category={elem.category}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Homepage;
