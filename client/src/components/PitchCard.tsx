import React, { ReactElement, useState } from 'react';

import '../css/PitchCard.css';

type PitchCardProps = {
  title: string;
  description: string;
  status: string;
  category: string;
};

function PitchCard({
  title,
  description,
  status,
  category,
}: PitchCardProps): ReactElement {
  const [modal, setModal] = useState(false);
  const toggleModal = (): void => {
    const modalElement = document.getElementById('card-modal');
    if (modalElement) {
      if (modal) {
        modalElement.style.display = 'none';
      } else {
        modalElement.style.display = 'block';
      }
    }
    setModal(!modal);
  };
  return (
    <>
      <div
        className="card"
        role="button"
        onClick={toggleModal}
        onKeyPress={toggleModal}
        tabIndex={0}
      >
        <div className="content">
          <div className="title">
            <h4>{title}</h4>
          </div>
          <div className="description">
            <p>{description}</p>
          </div>
        </div>
        <div className="flags">
          <div className="status flag">{status}</div>
          <div className="category flag">{category}</div>
        </div>
      </div>
      <div id="card-modal" className="card-modal">
        <div className="card-modal-content">
          <span
            className="close"
            role="button"
            onClick={toggleModal}
            onKeyPress={toggleModal}
            tabIndex={0}
          >
            &times;
          </span>
          {title}
        </div>
      </div>
    </>
  );
}

export default PitchCard;
