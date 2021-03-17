import React, { ReactElement } from 'react';
import { Input, Label, Button } from 'semantic-ui-react';

import Sidebar from '../../components/Sidebar';
import Logo from '../../assets/ssw-form-header.png';
import Mail from '../../assets/mail.svg';
import Phone from '../../assets/phone.svg';
import Linkedin from '../../assets/linkedin.svg';
import Globe from '../../assets/globe.svg';
import Twitter from '../../assets/twitter.svg';
import Pfp from '../../assets/pfp.svg';
import Masthead from '../../assets/masthead.svg';
import Banner from '../../assets/banner.svg';

import '../../css/Profile.css';

function Profile(): ReactElement {
  const currentTeamsButtons = [
    { value: 'Data', color: '#EF8B8B' },
    { value: 'Editing', color: '#A5C4F2' },
    { value: 'Fact-checking', color: '#CFE7C4' },
    { value: 'Illustration', color: '#BAB9E9' },
    { value: 'Layout', color: '#F9B893' },
    { value: 'Photography', color: '#D8ACE8' },
    { value: 'Radio', color: '#F1D8B0' },
    { value: 'Visuals', color: '#BFEBE0' },
    { value: 'Writing', color: '#A9D3E5' },
  ];

  const currentTeams = [{}];

  return (
    <>
      <Sidebar />
      <div className="logo-header">
        <img className="logo" alt="SSW Logo" src={Logo} />
      </div>

      <div className="pfp-section">
        <div className="edit-button">
          <Button content="Edit Profile" className="edit-profile-button" />
        </div>
        <div className="pfp">
          <img src={Pfp} alt="pfp" className="pfp"></img>
        </div>
        <div className="masthead-section">
          <img src={Banner} className="masthead-banner" alt="banner"></img>
          <img src={Masthead} className="masthead-logo" alt="masthead" />
          <div className="masthead-text">Masthead</div>
        </div>
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
            value="Mustafa Syed Ali"
            readOnly={true}
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

      <hr />

      <div className="social-input-section">
        <div className="section-title">
          <h3>Socials/Contact</h3>
        </div>
          <div className="input-wrapper">
            <div>
              <img className="icon" src={Mail} alt="mail" />
            </div>
            {/*<Label horizontal circular>Name</Label>*/}
            <Input className="input-field" transparent />
          </div>

          <div className="input-wrapper">
            <div>
              <img className="icon" src={Phone} alt="mail" />
            </div>
            <Input
              className="input-field"
              transparent
              //fluid
            />
          </div>

        <div className="input-wrapper">
          <div>
            <img className="icon" src={Linkedin} alt="mail" />
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
            <img className="icon" src={Globe} alt="mail" />
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
            <img className="icon" src={Twitter} alt="mail" />
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

      <div className="topics-section">
        <div className="section">
          <div className="list-title">My Topics</div>
          <Button className="role-topic-button" content="Cannabis" />
          <Button className="role-topic-button" content="Fun" />
        </div>

        <div className="section">
          <div className="list-title">My Roles</div>
          <Button className="role-topic-button" content="Cannabis" />
          <Button className="role-topic-button" content="Fun" />
        </div>
      </div>
    </>
  );
}

export default Profile;
