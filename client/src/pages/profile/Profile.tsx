import React, { ReactElement, useState, useEffect } from 'react';
import { Input, Button, Dropdown, Label } from 'semantic-ui-react';
import axios, { AxiosResponse } from 'axios';
//import {loadProfile} from '../../utils/apiWrapper'
import { BASE_URL } from '../../utils/apiWrapper'

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

const exampleUser = {
  firstName: 'Mustafa',
  lastName: 'Ali',
  preferredName: 'Mustafa',
  email: 'mustafas.designs@gmail.com',
  phone: '630-935-0063',
  genders: ['Man'],
  pronouns: ['He/his'],
  dateJoined: '02/27/21',
  masthead: true,
  portfolio: 'mustafa-designs.com',
  linkedIn: 'linkedin.com/in/mustafasyedali',
  twitter: '@mustardseedali',
  role: 'Contributor',
  currentTeams: ['Photography', 'Visuals', 'Layout'],
  interests: ['Fun', 'Cannabis', 'Visual Arts', 'Music'],
};

function Profile(): ReactElement {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [preferredName, setPreferredName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [genders, setGenders] = useState<Array<string>>([]);
  const [pronouns, setPronouns] = useState<Array<string>>([]);
  const [dateJoined, setDateJoined] = useState<string>('');
  const [masthead, setMasthead] = useState<boolean>(false);
  const [portfolio, setPortfolio] = useState<string>('');
  const [linkedIn, setLinkedIn] = useState<string>('');
  const [twitter, setTwitter] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [currentTeams, setCurrentTeams] = useState<Array<string>>([]);
  const [interests, setInterests] = useState<Array<string>>([]);
  const [edit, setEdit] = useState<boolean>(false);
  const teamColors: { [key: string]: string } = {
    Data: '#EF8B8B',
    Editing: '#A5C4F2',
    Factchecking: '#CFE7C4',
    Illustration: '#BAB9E9',
    Layout: '#F9B893',
    Photography: '#D8ACE8',
    Radio: '#F1D8B0',
    Visuals: '#BFEBE0',
    Writing: '#A9D3E5',
  };
  const interestColors: { [key: string]: string } = {
    Cannabis: '#CFE7C4',
    Education: '#A9D3E5',
    'Food and Land': '#BFEBE0',
    Fun: '#F9B893',
    Health: '#F9B893',
    Housing: '#EF8B8B',
    Immigration: '#D8ACE8',
    Literature: '#A5C4F2',
    Music: '#BFEBE0',
    Nature: '#CFE7C4',
    Politics: '#A5C4F2',
    'Stage and Screen': '#D8ACE8',
    Transportation: '#F1D8B0',
    'Visual Arts': '#BAB9E9',
  };
  const interestsButtons = [
    { value: 'Cannabis', color: '#CFE7C4' },
    { value: 'Education', color: '#A9D3E5' },
    { value: 'Food and Land', color: '#BFEBE0' },
    { value: 'Fun', color: '#F9B893' },
    { value: 'Health', color: '#F9B893' },
    { value: 'Housing', color: '#EF8B8B' },
    { value: 'Immigration', color: '#D8ACE8' },
    { value: 'Literature', color: '#A5C4F2' },
    { value: 'Music', color: '#BFEBE0' },
    { value: 'Nature', color: '#CFE7C4' },
    { value: 'Politics', color: '#A5C4F2' },
    { value: 'Stage and Screen', color: '#D8ACE8' },
    { value: 'Transportation', color: '#F1D8B0' },
    { value: 'Visual Arts', color: '#BAB9E9' },
  ];
  const genderOptions = [
    { key: 'Man', color: '#EF8B8B', text: 'Man', value: 'Man' },
    { key: 'Woman', color: '#CFE7C4', text: 'Woman', value: 'Woman' },
    {
      key: 'Nonbinary',
      color: '#F9B893',
      text: 'Nonbinary',
      value: 'Nonbinary',
    },
    { key: 'Other', color: '#BFEBE0', text: 'Other', value: 'Other' },
  ];

  const pronounOptions = [
    { key: 'He/his', color: '#EF8B8B', text: 'He/his', value: 'He/his' },
    { key: 'She/her', color: '#CFE7C4', text: 'She/her', value: 'She/her' },
    {
      key: 'They/them',
      color: '#F9B893',
      text: 'They/them',
      value: 'They/them',
    },
    { key: 'Ze/hir', color: '#F1D8B0', text: 'Ze/hir', value: 'Ze/hir' },
    { key: 'Other', color: '#BFEBE0', text: 'Other', value: 'Other' },
  ];

  function loadUser(): void {
    setFirstName(exampleUser.firstName);
    setLastName(exampleUser.lastName);
    setFullName(`${exampleUser.firstName} ${exampleUser.lastName}`);
    setPreferredName(exampleUser.preferredName);
    setPhoneNumber(exampleUser.phone);
    setGenders(exampleUser.genders);
    setPronouns(exampleUser.pronouns);
    setDateJoined(exampleUser.dateJoined);
    //setMasthead(exampleUser.masthead);
    setPortfolio(exampleUser.portfolio);
    setLinkedIn(exampleUser.linkedIn);
    setTwitter(exampleUser.twitter);
    //setCurrentTeams(exampleUser.currentTeams);
    setInterests(exampleUser.interests);
  }

  function enableEdit(): void {
    setEdit(true);
  }
  const profileData = {
      firstName: firstName !== '' ? firstName : null,
      lastName: lastName !== '' ? lastName : null,
      preferredName: preferredName !== '' ? preferredName : null,
      email: email !== '' ? email : null,
      phone: phoneNumber !== '' ? phoneNumber : null,
      genders: genders !== [] ? genders : null,
      pronouns: pronouns !== [] ? pronouns : null,
      dateJoined: dateJoined !== '' ? dateJoined : null,
      masthead: masthead,
      portfolio: portfolio !== '' ? portfolio : null,
      linkedIn: linkedIn !== '' ? linkedIn : null,
      twitter: twitter !== '' ? twitter : null,
      role: role !== '' ? role : null,
      currentTeams: currentTeams !== [] ? currentTeams : null,
      interests: interests !== [] ? interests : null,
  }

  const user_id = "6031a866c70ec705736a79e5"
  async function loadProfile() {
    const userUrl = `${BASE_URL}/users/${user_id}`;
    try {
      const res = await axios.get(userUrl, {
        headers: {
          'Content-Type': 'application/JSON'
        }})
        const user = res.data.result;
        console.log(user);
        setFirstName(user.firstName === null ? "" : user.firstName);
        setLastName(user.lastName === null ? "" : user.lastName);
        setFullName(`${user.firstName === null ? "" : user.firstName} ${user.lastName === null ? "" : user.lastName}`);
        setPreferredName(user.preferredName === null ? "" : user.preferredName);
        setEmail(user.email === null ? "" : user.email);
        setPhoneNumber(user.phone === null ? "" : user.phone);
        setGenders(user.genders === null ? [] : user.genders);
        setPronouns(user.pronouns === null ? [] : user.pronouns);
        setDateJoined(user.dateJoined === null ? "" : user.dateJoined);
        setMasthead(user.masthead === null ? false : user.masthead);
        setPortfolio(user.portfolio === null ? "" : user.portfolio);
        setLinkedIn(user.linkedIn === null ? "" : user.linkedIn);
        setTwitter(user.twitter === null ? "" : user.twitter);
        setRole(user.role === null ? "" : user.role)
        setCurrentTeams(user.currentTeams === null ? [] : user.currentTeams);
        setInterests(user.interests === null ? [] : user.interests);
    } catch (err) {
        console.error(err);
    }
  }

  async function saveProfile() {
    const userUrl = `${BASE_URL}/users/${user_id}`;
    try { 
      const res = await axios.put(userUrl, profileData, {
        headers: {
          'Content-Type': 'application/JSON'
        }})
      console.log(res.data);
    } catch (err) {
        console.error(err);
    }
    setEdit(false);
  }

  
  function saveEdit(): void {
    nameSplitter(fullName);
    exampleUser.firstName = firstName;
    exampleUser.lastName = lastName;
    exampleUser.preferredName = preferredName;
    exampleUser.phone = phoneNumber;
    exampleUser.genders = genders;
    exampleUser.pronouns = pronouns;
    exampleUser.dateJoined = dateJoined;
    exampleUser.portfolio = portfolio;
    exampleUser.linkedIn = linkedIn;
    exampleUser.twitter = twitter;
    exampleUser.interests = interests;
    setEdit(false);
  }

  function cancelEdit(): void {
    loadProfile();
    setEdit(false);
  }

  function nameSplitter(fullName: string): void {
    const splitName = fullName.split(' ');
    setFirstName(splitName[0]);
    if (splitName[1] !== undefined) {
      setLastName(splitName[1]);
    } else {
      setLastName('');
    }
  }

  function extractGenderString(data: any): void {
    setGenders(data);
  }
  function extractPronounString(data: any): void {
    setPronouns(data);
  }

  function checkFilled(value: string): boolean {
    const notFoundIdx = -1;
    return !(interests.indexOf(value) === notFoundIdx);
  }

  function setFilled(value: string): void {
    const notFoundIdx = -1;
    if (interests.indexOf(value) === notFoundIdx) {
      const addedElements = interests.concat(value);
      setInterests(addedElements);
    } else {
      const removedElements = interests.filter((element) => element !== value);
      setInterests(removedElements);
    }
  }
  
  useEffect(() => {
    /* console.log("hello");
    loadUser();
    const response = loadProfile();
    console.log(response); */
    loadProfile();

  }, []);

  return (
    <>
      <Sidebar />
      <div className="pfp-page">
        <div className="logo-header">
          <img className="logo" alt="SSW Logo" src={Logo} />
        </div>
        <div className="pfp-page-content">
          <div className="top-section-wrapper">
            <div className="pf-section">
              <div className="edit-button-wrapper">
                <Button
                  content="Edit Profile"
                  className="edit-profile-button"
                  onClick={enableEdit}
                />
              </div>
              <div className="pf-image-wrapper">
                <img src={Pfp} alt="pfp" className="pf-image"></img>
                {masthead && (
                  <div className="masthead-section">
                    <img
                      src={Banner}
                      className="masthead-banner"
                      alt="banner"
                    ></img>
                    <img
                      src={Masthead}
                      className="masthead-logo"
                      alt="masthead"
                    />
                    <div className="masthead-text">Masthead</div>
                  </div>
                )}
              </div>

              <div className="save-edit-section">
                {edit && (
                  <Button
                    content="Save Changes"
                    className="save-changes-button"
                    onClick={saveProfile}
                  />
                )}
                {edit && (
                  <Button
                    content="Cancel Changes"
                    className="cancel-changes-button"
                    onClick={cancelEdit}
                  />
                )}
              </div>
            </div>

            <div className="basic-input-section">
              <div className="list-title">Basic Information</div>
              <div className="input-wrapper">
                <span className="info-label">Name:</span>
                {/*<Label horizontal circular>Name</Label>*/}
                <Input
                  className="input-field"
                  transparent
                  value={fullName}
                  readOnly={!edit}
                  onChange={(e) => setFullName(e.currentTarget.value)}
                />
              </div>

              <div className="input-wrapper">
                <span className="info-label">Preferred Name:</span>
                {/*<Label horizontal circular>Name</Label>*/}
                <Input
                  className="input-field"
                  transparent
                  value={preferredName}
                  readOnly={!edit}
                  onChange={(e) => setPreferredName(e.currentTarget.value)}
                />
              </div>

              <div className="input-wrapper" id="gender">
                <span className="info-label">Gender:</span>
                {/*<Label horizontal circular>Name</Label>*/}
                {!edit && (
                  <Input
                    className="input-field"
                    transparent
                    value={genders.join(', ')}
                    readOnly={!edit}
                  />
                )}
                {edit && (
                  <Dropdown
                    multiple
                    selection
                    options={genderOptions}
                    className="dropdown-field"
                    onChange={(e, data) => extractGenderString(data.value!)}
                    defaultValue={genders}
                  />
                )}
              </div>

              <div className="input-wrapper" id="pronoun">
                <span className="info-label">Pronouns:</span>
                {/*<Label horizontal circular>Name</Label>*/}
                {!edit && (
                  <Input
                    className="input-field"
                    transparent
                    value={pronouns.join(', ')}
                    readOnly={!edit}
                  />
                )}
                {edit && (
                  <Dropdown
                    multiple
                    selection
                    options={pronounOptions}
                    className="dropdown-field"
                    onChange={(e, data) => extractPronounString(data.value!)}
                    defaultValue={pronouns}
                  />
                )}
              </div>

              <div className="input-wrapper">
                <span className="info-label">Position:</span>
                {/*<Label horizontal circular>Name</Label>*/}
                <Input
                  className="input-field"
                  transparent
                  value={role}
                  readOnly="true"
                  disabled={edit}
                />
              </div>

              <div className="input-wrapper">
                <span className="info-label">Date Joined:</span>
                {/*<Label horizontal circular>Name</Label>*/}
                <Input
                  className="input-field"
                  transparent
                  value={dateJoined}
                  readOnly={!edit}
                  onChange={(e) => setDateJoined(e.currentTarget.value)}
                />
              </div>
            </div>

            <div className="topics-section">
              <div className="list-section">
                <div className="list-title">My Topics</div>

                {/*<Button className="role-topic-button" content="Cannabis" style={{backgroundColor: teamColors[exampleUser.currentTeams[0]]}}/>
              <Button className="role-topic-button" content="Fun" />*/}

                {!edit && (
                  <div className="interests-section-scroll">
                    {interests.map((button, idx) => (
                      <Label
                        key={idx}
                        className="role-topic-label"
                        content={button}
                        style={{ backgroundColor: interestColors[button] }}
                      />
                    ))}
                  </div>
                )}

                {edit && (
                  <div className="interests-section-scroll">
                    {interestsButtons.map((button, idx) => (
                      <Button
                        key={idx}
                        className="role-topic-button"
                        content={button.value}
                        style={{
                          backgroundColor: checkFilled(button.value)
                            ? button.color
                            : 'white',
                          border: `2px solid ${button.color}`,
                        }}
                        onClick={() => setFilled(button.value)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="roles-section">
              <div className="list-section">
                <div className="list-title">My Roles</div>
                <div className="interests-section-scroll">
                  {currentTeams.map((button, idx) => (
                    <Label
                      key={idx}
                      className="role-topic-label"
                      content={button}
                      style={{ backgroundColor: teamColors[button] }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr />
          <div className="bottom-section-wrapper">
            <div className="left-col">
              <div className="list-title">Socials/Contact</div>
              <div className="input-wrapper">
                <div>
                  <img className="icon" src={Mail} alt="mail" />
                </div>
                {/*<Label horizontal circular>Name</Label>*/}
                <Input
                  className="input-field"
                  transparent
                  value={email}
                  readOnly
                  disabled={edit}
                />
              </div>

              <div className="input-wrapper">
                <div>
                  <img className="icon" src={Phone} alt="mail" />
                </div>
                <Input
                  className="input-field"
                  transparent
                  value={phoneNumber}
                  readOnly={!edit}
                  onChange={(e) => setPhoneNumber(e.currentTarget.value)}

                  //fluid
                />
              </div>
            </div>
            <div className="right-col">
              <div className="input-wrapper">
                <div>
                  <img className="icon" src={Linkedin} alt="linkedin" />
                </div>
                {/*<Label horizontal circular>Name</Label>*/}
                <Input
                  className="input-field"
                  transparent
                  value={linkedIn}
                  readOnly={!edit}
                  onChange={(e) => setLinkedIn(e.currentTarget.value)}
                />
              </div>

              <div className="input-wrapper">
                <div>
                  <img className="icon" src={Globe} alt="globe" />
                </div>
                {/*<Label horizontal circular>Name</Label>*/}
                <Input
                  className="input-field"
                  transparent
                  value={portfolio}
                  readOnly={!edit}
                  onChange={(e) => setPortfolio(e.currentTarget.value)}
                />
              </div>

              <div className="input-wrapper">
                <div>
                  <img className="icon" src={Twitter} alt="twitter" />
                </div>
                {/*<Label horizontal circular>Name</Label>*/}
                <Input
                  className="input-field"
                  transparent
                  value={twitter}
                  readOnly={!edit}
                  onChange={(e) => setTwitter(e.currentTarget.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
