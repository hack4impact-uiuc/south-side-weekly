import React, { ReactElement } from 'react';

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
  return (
    <div className="card">
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
  );
}

export default PitchCard;
