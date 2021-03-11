import React, { ReactElement } from 'react';
import { Input, Label} from 'semantic-ui-react';

import Sidebar from '../../components/Sidebar';
import Logo from '../../assets/ssw-form-header.png'
import Mail from '../../assets/mail.png'
import Phone from '../../assets/phone.png'
import Linkedin from '../../assets/linkedin.png'
import Globe from '../../assets/globe.png'
import Twitter from '../../assets/twitter.png'

import '../../css/Profile.css';

function Profile(): ReactElement {
  
  return (
  <>
    {/*<Sidebar />*/}
    <div className="logo-header">
      <img className="logo" alt="SSW Logo" src={Logo} />
    </div>
    <div className="section">
      

      <div className="basic-input-section">
        <div className="section-title">
          <h3>Basic Information</h3>
        </div>
        <div className="input-wrapper">
            <span className="label">Name:</span>
            {/*<Label horizontal circular>Name</Label>*/}
            <Input
              className="input-field"
              transparent
            />
        </div>

        <div className="input-wrapper">
            <span className="label">Preferred Name:</span>
            {/*<Label horizontal circular>Name</Label>*/}
            <Input
              className="input-field"
              transparent
              //fluid
            />
        </div>

        <div className="input-wrapper">
            <span className="label">Gender:</span>
            {/*<Label horizontal circular>Name</Label>*/}
            <Input
              className="input-field"
              transparent
              //fluid
            />
        </div>

        <div className="input-wrapper">
            <span className="label">Pronouns:</span>
            {/*<Label horizontal circular>Name</Label>*/}
            <Input
              className="input-field"
              transparent
              //fluid
            />
        </div>

        <div className="input-wrapper">
            <span className="label">Position:</span>
            {/*<Label horizontal circular>Name</Label>*/}
            <Input
              className="input-field"
              transparent
              //fluid
            />
        </div>

        <div className="input-wrapper">
            <span className="label">Date Joined:</span>
            {/*<Label horizontal circular>Name</Label>*/}
            <Input
              className="input-field"
              transparent
              //fluid
            />
        </div>
      </div>

      <div className="social-input-section">
        <div className="section-title">
          <h3>Socials/Contact</h3>
        </div>
        <div className="social-item-wrapper">
          
          <div className="input-wrapper">
              {/*<Label horizontal circular>Name</Label>*/}
              <Input
                className="input-field"
                transparent
              />
          </div>
        </div>

        <div className="social-item-wrapper">
          <div className="icon">
            <img src={Mail} alt="mail"/>
          </div>
          <div className="input-wrapper">
              <Input
                className="input-field"
                transparent
                //fluid
              />
          </div>
        </div>

        <div className="input-wrapper">
            <span className="label">Gender:</span>
            {/*<Label horizontal circular>Name</Label>*/}
            <Input
              className="input-field"
              transparent
              //fluid
            />
        </div>

        <div className="input-wrapper">
            <span className="label">Pronouns:</span>
            {/*<Label horizontal circular>Name</Label>*/}
            <Input
              className="input-field"
              transparent
              //fluid
            />
        </div>

        <div className="input-wrapper">
            <span className="label">Position:</span>
            {/*<Label horizontal circular>Name</Label>*/}
            <Input
              className="input-field"
              transparent
              //fluid
            />
        </div>

        <div className="input-wrapper">
            <span className="label">Date Joined:</span>
            {/*<Label horizontal circular>Name</Label>*/}
            <Input
              className="input-field"
              transparent
              //fluid
            />
        </div>
      </div>

    </div>
  </>
  );
}

export default Profile;
