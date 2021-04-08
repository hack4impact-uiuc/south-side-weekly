import React, { FC, ReactElement, Dispatch, SetStateAction } from 'react';
import { Form } from 'semantic-ui-react';

import BasicInfoSvg from '../../assets/basic-info.svg';
import WizardStar from '../../components/WizardStar';

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

/**
 * Builds and controls the form management for Onboard1 of the Onboarding Wizard
 *
 * @param {string} firstName the first name of the user being onboarded
 * @param {string} lastName the last name of the user being onboarded
 * @param {string} preferredName the preferred name of the user being onboarded
 * @param {string} phoneNumber the phone number of the user being onboarded
 * @param {Dispatch<SetStateAction<string>>} setFirstName React setter function to update first name
 * @param {Dispatch<SetStateAction<string>>} setLastName React setter function to update last name
 * @param {Dispatch<SetStateAction<string>>} setPreferredName React setter function to update preferred name
 * @param {Dispatch<SetStateAction<string>>} setPhoneNumber React setter function to update user phone number
 */
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
    <Form className="basic-info-form" size="huge">
      <div className="btn-wrapper">
        <div className="input-wrapper">
          <div className="label">First Name</div>
          <WizardStar />
          <div className="input">
            <Form.Input
              required
              defaultValue={firstName}
              onChange={(e) => setFirstName(e.currentTarget.value)}
              id="first-name"
              focus
              transparent
              className="input-field"
              error={firstName === ''}
            />
          </div>
        </div>
        <div className="input-wrapper">
          <div className="label">Last Name</div>
          <WizardStar />
          <div className="input">
            <Form.Input
              required
              defaultValue={lastName}
              onChange={(e) => setLastName(e.currentTarget.value)}
              id="last-name"
              focus
              transparent
              className="input-field"
              error={lastName === ''}
            />
          </div>
        </div>
        <div className="input-wrapper">
          <div className="label">Preferred Name</div>
          <div className="input">
            <Form.Input
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
          <div className="label">Phone Number</div>
          <WizardStar />
          <div className="input">
            <Form.Input
              required
              defaultValue={phoneNumber}
              onChange={(e) => setPhoneNumber(e.currentTarget.value)}
              id="phone-number"
              focus
              transparent
              className="input-field"
              error={phoneNumber === ''}
            />
          </div>
        </div>
      </div>
    </Form>
  </div>
);

export default OnBoard1;
