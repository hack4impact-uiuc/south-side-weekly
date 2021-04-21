import React, { ReactElement, useState, useEffect } from 'react';
import { Message, Input, Button, Dropdown, Label } from 'semantic-ui-react';

import { isError, loadUser, saveUser } from '../../utils/apiWrapper';
import { teamEnum, interestsEnum, pages } from '../../utils/enums';
import Sidebar from '../../components/Sidebar';
import Mail from '../../assets/mail.svg';
import Phone from '../../assets/phone.svg';
import Linkedin from '../../assets/linkedin.svg';
import Globe from '../../assets/globe.svg';
import Twitter from '../../assets/twitter.svg';
import Pfp from '../../assets/pfp.svg';
import Masthead from '../../assets/masthead.svg';
import Banner from '../../assets/banner.svg';
import Header from '../../components/Header';

import '../../css/Profile.css';

function Profile(): ReactElement {
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
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const userId = "6031a866c70ec705736a79e5";

  const currentTeamsButtons = [
    { display: 'Editing', value: teamEnum.EDITING, color: '#A5C4F2' },
    {
      display: 'Fact-checking',
      value: teamEnum.FACT_CHECKING,
      color: '#CFE7C4',
    },
    { display: 'Illustration', value: teamEnum.ILLUSTRATION, color: '#BAB9E9' },
    { display: 'Photography', value: teamEnum.PHOTOGRAPHY, color: '#D8ACE8' },
    { display: 'Visuals', value: teamEnum.VISUALS, color: '#BFEBE0' },
    { display: 'Writing', value: teamEnum.WRITING, color: '#A9D3E5' },
  ];

  const interestsButtons = [
    { display: 'Cannabis', value: interestsEnum.CANNABIS, color: '#CFE7C4' },
    { display: 'Education', value: interestsEnum.EDUCATION, color: '#A9D3E5' },
    {
      display: 'Food and Land',
      value: interestsEnum.FOOD_AND_LAND,
      color: '#BFEBE0',
    },
    { display: 'Fun', value: interestsEnum.FUN, color: '#F9B893' },
    { display: 'Health', value: interestsEnum.HEALTH, color: '#F9B893' },
    { display: 'Housing', value: interestsEnum.HOUSING, color: '#EF8B8B' },
    {
      display: 'Immigration',
      value: interestsEnum.IMMIGRATION,
      color: '#D8ACE8',
    },
    { display: 'Literature', value: interestsEnum.LIT, color: '#A5C4F2' },
    { display: 'Music', value: interestsEnum.MUSIC, color: '#BFEBE0' },
    { display: 'Nature', value: interestsEnum.NATURE, color: '#CFE7C4' },
    { display: 'Politics', value: interestsEnum.POLITICS, color: '#A5C4F2' },
    {
      display: 'Stage and Screen',
      value: interestsEnum.STAGE_AND_SCREEN,
      color: '#D8ACE8',
    },
    {
      display: 'Transportation',
      value: interestsEnum.TRANSPORTATION,
      color: '#F1D8B0',
    },
    {
      display: 'Visual Arts',
      value: interestsEnum.VISUAL_ARTS,
      color: '#BAB9E9',
    },
  ];

  const roleOptions: { [key: string]: string } = {
    CONTRIBUTOR: 'Contributor',
    STAFF: 'Staff',
    ADMIN: 'Admin',
    TBD: 'TBD',
  };

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

  function enableEdit(): void {
    setEdit(true);
  }
  const profileData = {
    firstName: fullName.split(' ')[0] !== '' ? fullName.split(' ')[0] : null,
    lastName: fullName.split(' ')[1] !== '' ? fullName.split(' ')[1] : null,
    preferredName: preferredName !== '' ? preferredName : null,
    email: email !== '' ? email : null,
    phone: phoneNumber !== '' ? phoneNumber : null,
    genders: genders !== [] ? genders : null,
    pronouns: pronouns !== [] ? pronouns : null,
    dateJoined: dateJoined !== '' ? new Date(dateJoined) : null,
    masthead: masthead,
    portfolio: portfolio !== '' ? portfolio : null,
    linkedIn: linkedIn !== '' ? linkedIn : null,
    twitter: twitter !== '' ? twitter : null,
    role: role !== '' ? role : null,
    currentTeams: currentTeams !== [] ? currentTeams : null,
    interests: interests !== [] ? interests : null,
  };

  function cancelEdit(): void {
    getProfile();
    setEdit(false);
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

  async function getProfile(): Promise<void> {
    const res = await loadUser(userId);
    if (isError(res)) {
      setError(true);
      setErrorMessage(res.type);
    } else {
      setError(false);
      const user = res.data.result;
      setFullName(
        `${user.firstName === null ? '' : user.firstName} ${
          user.lastName === null ? '' : user.lastName
        }`,
      );
      setPreferredName(user.preferredName === null ? '' : user.preferredName);
      setEmail(user.email === null ? '' : user.email);
      setPhoneNumber(user.phone === null ? '' : user.phone);
      setGenders(user.genders === null ? [] : user.genders);
      setPronouns(user.pronouns === null ? [] : user.pronouns);
      const date = new Date(user.dateJoined);
      setDateJoined(
        user.dateJoined === null ? '' : date.toISOString().split('T')[0],
      );
      setMasthead(user.masthead === null ? false : user.masthead);
      setPortfolio(user.portfolio === null ? '' : user.portfolio);
      setLinkedIn(user.linkedIn === null ? '' : user.linkedIn);
      setTwitter(user.twitter === null ? '' : user.twitter);
      setRole(user.role === null ? '' : user.role);
      setCurrentTeams(user.currentTeams === null ? [] : user.currentTeams);
      setInterests(user.interests === null ? [] : user.interests);
    }
  }

  async function updateProfile(): Promise<void> {
    const res = await saveUser(profileData, userId);
    if (isError(res)) {
      setError(true);
      setErrorMessage(res.type);
    } else {
      setError(false);
      setEdit(false);
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <Sidebar currentPage={pages.PROFILE} />

      <div className="pfp-page">
        <Header />
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
                    onClick={updateProfile}
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

                <Input
                  className="input-field"
                  transparent
                  value={roleOptions[role]}
                  readOnly="true"
                  disabled={edit}
                />
              </div>

              <div className="input-wrapper">
                <span className="info-label">Date Joined:</span>

                <Input
                  className="input-field"
                  transparent
                  value={dateJoined}
                  readOnly={!edit}
                  onChange={(e) => setDateJoined(e.currentTarget.value)}
                  type="date"
                />
              </div>
            </div>

            <div className="topics-section">
              <div className="list-section">
                <div className="list-title">My Topics</div>

                {!edit && (
                  <div className="interests-section-scroll">
                    {interestsButtons
                      .filter((label) => interests.includes(label.value))
                      .map((label, idx) => (
                        <Label
                          key={idx}
                          className="role-topic-label"
                          content={label.display}
                          style={{ backgroundColor: label.color }}
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
                        content={button.display}
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
                  {currentTeamsButtons
                    .filter((label) => currentTeams.includes(label.value))
                    .map((label, idx) => (
                      <Label
                        key={idx}
                        className="role-topic-label"
                        content={label.display}
                        style={{ backgroundColor: label.color }}
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
                {!edit && (
                  <a className="link" href={`mailto: ${email}`}>
                    {email}
                  </a>
                )}
                {edit && (
                  <Input
                    className="input-field"
                    transparent
                    value={email}
                    readOnly
                    disabled={edit}
                  />
                )}
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
                />
              </div>
            </div>
            <div className="right-col">
              <div className="input-wrapper">
                <div>
                  <img className="icon" src={Linkedin} alt="linkedin" />
                </div>
                {!edit && (
                  <a className="link" href={`//${linkedIn}`}>
                    {linkedIn}
                  </a>
                )}
                {edit && (
                  <Input
                    className="input-field"
                    transparent
                    value={linkedIn}
                    readOnly={!edit}
                    onChange={(e) => setLinkedIn(e.currentTarget.value)}
                  />
                )}
              </div>

              <div className="input-wrapper">
                <div>
                  <img className="icon" src={Globe} alt="globe" />
                </div>
                {!edit && (
                  <a className="link" href={`//${portfolio}`}>
                    {portfolio}
                  </a>
                )}
                {edit && (
                  <Input
                    className="input-field"
                    transparent
                    value={portfolio}
                    readOnly={!edit}
                    onChange={(e) => setPortfolio(e.currentTarget.value)}
                  />
                )}
              </div>

              <div className="input-wrapper">
                <div>
                  <img className="icon" src={Twitter} alt="twitter" />
                </div>
                {!edit && (
                  <a className="link" href={`//${twitter}`}>
                    {twitter}
                  </a>
                )}
                {edit && (
                  <Input
                    className="input-field"
                    transparent
                    value={twitter}
                    readOnly={!edit}
                    onChange={(e) => setTwitter(e.currentTarget.value)}
                  />
                )}
              </div>
            </div>
            {error && (
              <Message className="message-wrapper" negative>
                <Message.Header>{errorMessage}</Message.Header>
              </Message>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
