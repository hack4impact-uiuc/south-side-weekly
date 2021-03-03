import React, { FC, ReactElement, Dispatch, SetStateAction } from 'react';
import { Input } from 'semantic-ui-react';

import BasicInfoSvg from '../../assets/basic-info.svg';
import Required from '../../assets/required.svg';

import '../../css/wizard/Onboard1.css';

interface IProps {
  firstName: string;
  lastName: string;
  preferredName: string;
  phoneNumber: string;
  setFirstName: Dispatch<SetStateAction<string>>;
  setLastName: Dispatch<SetStateAction<string>>;
  setPreferredName: Dispatch<SetStateAction<string>>;
  setPhoneNumber: Dispatch<SetStateAction<string>>;
}

const OnBoard1: FC<IProps> = ({
  firstName,
  lastName,
  preferredName,
  phoneNumber,
  setFirstName,
  setLastName,
  setPreferredName,
  setPhoneNumber,
}): ReactElement => (
  <div className="basic-info-wrapper">
    <img className="basic-info-image" alt="info-graphic" src={BasicInfoSvg} />
    <div className="btn-wrapper">
      <div className="input-wrapper">
        <img alt="required" className="required-icon" src={Required} />
        <div className="input">
          <div className="label">First Name</div>
          <Input
            defaultValue={firstName}
            onChange={(e) => setFirstName(e.currentTarget.value)}
            id="first-name"
            focus
            transparent
            className="input-field"
          />
        </div>
      </div>
      <div className="input-wrapper">
        <img alt="required" className="required-icon" src={Required} />
        <div className="input">
          <div className="label">Last Name</div>
          <Input
            defaultValue={lastName}
            onChange={(e) => setLastName(e.currentTarget.value)}
            id="last-name"
            focus
            transparent
            className="input-field"
          />
        </div>
      </div>
      <div className="input-wrapper">
        <div className="input">
          <div className="label">Preferred Name</div>
          <Input
            defaultValue={preferredName}
            onChange={(e) => setPreferredName(e.currentTarget.value)}
            id="preferred-name"
            focus
            transparent
            className="input-field"
          />
        </div>
      </div>
      <div className="input-wrapper">
        <img alt="required" className="required-icon" src={Required} />
        <div className="input">
          <div className="label">Phone Number</div>
          <Input
            defaultValue={phoneNumber}
            onChange={(e) => setPhoneNumber(e.currentTarget.value)}
            id="phone-number"
            focus
            transparent
            className="input-field"
          />
        </div>
      </div>
    </div>
  </div>
);

export default OnBoard1;
