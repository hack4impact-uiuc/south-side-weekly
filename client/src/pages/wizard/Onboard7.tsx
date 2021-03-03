import React, { Dispatch, FC, ReactElement, SetStateAction } from 'react';
import { Input } from 'semantic-ui-react';

import Onboard7SVG from '../../assets/onboard7.svg';

import '../../css/wizard/Onboard7.css';

interface IProps {
  portfolio: string;
  linkedIn: string;
  twitter: string;
  setPortfolio: Dispatch<SetStateAction<string>>;
  setLinkedIn: Dispatch<SetStateAction<string>>;
  setTwitter: Dispatch<SetStateAction<string>>;
}

const Onboard7: FC<IProps> = ({
  portfolio,
  linkedIn,
  twitter,
  setPortfolio,
  setLinkedIn,
  setTwitter,
}): ReactElement => (
  <div className="onboard7-wrapper">
    <img className="page-svg" alt="onboard7" src={Onboard7SVG} />
    <div className="onboard7-content">
      <div className="input-wrapper">
        <div className="label">Portfolio Link</div>
        <Input
          defaultValue={portfolio}
          onChange={(e) => setPortfolio(e.currentTarget.value)}
          focus
          transparent
          className="input"
        />
      </div>
      <div className="input-wrapper">
        <div className="label">LinkedIn Link</div>
        <Input
          defaultValue={linkedIn}
          onChange={(e) => setLinkedIn(e.currentTarget.value)}
          focus
          transparent
          className="input"
        />
      </div>
      <div className="input-wrapper">
        <div className="label">Twitter Link</div>
        <Input
          defaultValue={twitter}
          onChange={(e) => setTwitter(e.currentTarget.value)}
          focus
          transparent
          className="input"
        />
      </div>
    </div>
  </div>
);

export default Onboard7;
