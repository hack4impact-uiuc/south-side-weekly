import React, { ReactElement } from 'react';
import { Input, Label, Button} from 'semantic-ui-react';

import Sidebar from '../../components/Sidebar';
import Logo from '../../assets/ssw-form-header.png'
import Mail from '../../assets/mail.svg'
import Phone from '../../assets/phone.svg'
import Linkedin from '../../assets/linkedin.svg'
import Globe from '../../assets/globe.png'
import Twitter from '../../assets/twitter.svg'
import Pfp from '../../assets/pfp.svg'

import '../../css/Profile.css';

function Profile(): ReactElement {
  
  return (
  <>
    {/*<Sidebar />*/}
    <div className="logo-header">
      <img className="logo" alt="SSW Logo" src={Logo} />
    </div>
    <div className="section">
      

      <div className="pfp-section">
        <Button
          content="Edit Profile"
        />
        <img src={Pfp} alt="pfp" className="pfp"></img>
      </div>

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

      <hr/>

      <div className="social-input-section">
        <div className="section-title">
          <h3>Socials/Contact</h3>
        </div>
        <div className="social-item-wrapper">
            
          
          <div className="input-wrapper">
          <div>
              <img className="icon" src={Mail} alt="mail"/>
            </div>
              {/*<Label horizontal circular>Name</Label>*/}
              <Input
                className="input-field"
                transparent
              />
          </div>
        </div>

        <div className="social-item-wrapper">
          
          <div className="input-wrapper">
          <div>
            <img className="icon" src={Phone} alt="mail"/>
          </div>
              <Input
                className="input-field"
                transparent
                //fluid
              />
          </div>
        </div>

        <div className="input-wrapper">
        <div>
            <img className="icon" src={Linkedin} alt="mail"/>
          </div>
            <span className="label">Gender:</span>
            {/*<Label horizontal circular>Name</Label>*/}
            <Input
              className="input-field"
              transparent
              //fluid
            />
        </div>

        <div className="input-wrapper">
        <div>
            <img className="icon" src={Globe} alt="mail"/>
          </div>
            <span className="label">Position:</span>
            {/*<Label horizontal circular>Name</Label>*/}
            <Input
              className="input-field"
              transparent
              //fluid
            />
        </div>

        <div className="input-wrapper">
        <div>
            <img className="icon" src={Twitter} alt="mail"/>
          </div>
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
