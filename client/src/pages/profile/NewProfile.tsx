import React, { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IUser } from 'ssw-common';
import {
  Button,
  Container,
  Checkbox,
  Divider,
  Grid,
  Image,
  Input,
  Dropdown,
} from 'semantic-ui-react';

import { isError, loadUser, saveUser } from '../../utils/apiWrapper';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { pages } from '../../utils/enums';
import {
  parseArrayToSemanticDropdownOptions,
  parseSemanticMultiSelectTypes,
} from '../../utils/helpers';

import SocialsInput from './SocialsInput';
import BasicInfoInput from './BasicInfoInput';
import './Profile.css';

const emptyUser: IUser = {
  _id: '',
  firstName: '',
  lastName: '',
  preferredName: '',
  email: '',
  phone: '',
  oauthID: '',
  genders: [''],
  pronouns: [''],
  dateJoined: '',
  masthead: false,
  onboarding: '',
  profilePic: '',
  portfolio: '',
  linkedIn: '',
  twitter: '',
  claimedPitches: [''],
  submittedPitches: [''],
  currentTeams: [''],
  role: '',
  races: [''],
  interests: [''],
};

const Profile = (): ReactElement => {
  interface ParamTypes {
    userId: string;
  }

  const basicInfoFields: (keyof IUser)[] = [
    'firstName',
    'lastName',
    'preferredName',
    'genders',
    'pronouns',
    'role',
    'dateJoined',
  ];

  const interestFields = [
    'POLITICS',
    'EDUCATION',
    'HOUSING',
    'LIT',
    'MUSIC',
    'VISUAL ARTS',
    'STAGE AND SCREEN',
    'FOOD AND LAND',
    'NATURE',
    'TRANSPORTATION',
    'HEALTH',
    'CANNABIS',
    'IMMIGRATION',
    'IMMIGRATION',
    'FUN',
  ];

  const teamFields = [
    'EDITING',
    'WRITING',
    'VISUALS',
    'PHOTOGRAPHY',
    'ILLUSTRATION',
    'FACT-CHECKING',
  ];

  const genderOptions = ['Man', 'Woman', 'Nonbinary', 'Other'];
  const pronounOptions = ['He/his', 'She/her', 'They/them', 'Ze/hir', 'Other'];
  const roleOptions = ['ADMIN', 'STAFF', 'CONTRIBUTOR'];

  interface IDropdownOptions {
    [key: string]: string[];
  }

  const dropdownOptions: IDropdownOptions = {
    genders: genderOptions,
    pronouns: pronounOptions,
    role: roleOptions,
  };

  const { userId } = useParams<ParamTypes>();
  const [user, setUser] = useState<IUser>(emptyUser);
  const [tempUser, setTempUser] = useState<IUser>(emptyUser);
  const [isEditMode, setIsEditMode] = useState(false);

  // const [permissions, setPermissions] = useState();

  const getDropDownOptions = (
    genders: string[],
    pronouns: string[],
  ): IDropdownOptions => {
    dropdownOptions['genders'] = genderOptions.concat(
      genders.filter((item) => genderOptions.indexOf(item) < 0),
    );
    dropdownOptions['pronouns'] = pronounOptions.concat(
      pronouns.filter((item) => pronounOptions.indexOf(item) < 0),
    );

    return dropdownOptions;
  };

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const res = await loadUser(userId);
      if (!isError(res)) {
        const user = res.data.result;
        setUser(user);
      }
    };

    getUser();
  }, [userId]);

  const isISODate = (value: string): boolean => !isNaN(Date.parse(value));

  const formatFieldDisplay = (value: string): string => {
    if (value === 'null' || value === 'undefined') {
      return '';
    } else if (isISODate(value)) {
      return formatDate(value);
    }

    return value;
  };

  const formatDate = (date: string): string => date.split('T')[0];

  const updateUserField = <T extends keyof IUser>(
    key: T,
    value: IUser[T],
  ): void => {
    const userCopy = { ...user };
    userCopy[key] = value;
    setUser(userCopy);
  };

  const startEditMode = (): void => {
    setIsEditMode(true);
    setTempUser(user);
  };

  const cancelEditMode = (): void => {
    setIsEditMode(false);
    setUser(tempUser);
  };

  const updateUser = async (): Promise<void> => {
    const res = await saveUser({ ...user }, userId);

    if (!isError(res)) {
      setIsEditMode(false);
    }
  };

  const convertToClassName = (str: string): string =>
    str.toLowerCase().split(' ').join('-');

  const editInterests = (interest: string): void => {
    const userCopy = { ...user };
    const currentIndex = user.interests.indexOf(interest);
    if (currentIndex >= 0) {
      user.interests.splice(currentIndex, 1);
    } else {
      userCopy.interests.push(interest);
    }
    setUser(userCopy);
  };

  const editTeams = (team: string): void => {
    const userCopy = { ...user };
    const currentIndex = user.currentTeams.indexOf(team);
    if (currentIndex >= 0) {
      user.currentTeams.splice(currentIndex, 1);
    } else if (user.currentTeams.length >= 2) {
      return;
    } else {
      userCopy.currentTeams.push(team);
    }
    setUser(userCopy);
  };

  return (
    <>
      <Sidebar currentPage={pages.PROFILE} />
      <Header />
      <div style={{ marginLeft: '15%', marginTop: '5%' }}>
        <Grid>
          <Grid.Row columns={4}>
            <Grid.Column
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Button
                size="medium"
                className="edit-profile-btn"
                onClick={startEditMode}
                content="Edit Profile"
              />
              <Image size="small" circular src={user.profilePic} />
              {isEditMode && (
                <Button.Group>
                  <Button
                    className="edit-mode-btn save"
                    content="Save Changes"
                    onClick={updateUser}
                    size="medium"
                  />
                  <Button
                    className="edit-mode-btn cancel"
                    content="Cancel Changes"
                    onClick={cancelEditMode}
                    size="medium"
                  />
                </Button.Group>
              )}
            </Grid.Column>

            <Grid.Column stretched width={5}>
              <h2>Basic information</h2>
              <Container style={{ marginBottom: '5px' }}>
                {basicInfoFields.map((field, index) => {
                  if (Array.isArray(user[field])) {
                    return (
                      <>
                        {!isEditMode ? (
                          <BasicInfoInput
                            key={index}
                            label={field}
                            value={(user[field] as string[]).join(', ')}
                            isEditMode={isEditMode}
                            updateUserField={updateUserField}
                          />
                        ) : (
                          <div key={index} className="input-field">
                            <span>{field}</span>
                            <Dropdown
                              className="dropdown-field"
                              options={parseArrayToSemanticDropdownOptions(
                                getDropDownOptions(user.genders, user.pronouns)[
                                  `${field}`
                                ],
                              )}
                              search
                              selection
                              floating
                              multiple
                              allowAdditions
                              value={user[field] as string[]}
                              onAddItem={(e, { value }) => {
                                dropdownOptions[`${field}`].push(`${value}`);
                              }}
                              onChange={(e, { value }) =>
                                updateUserField(
                                  field,
                                  parseSemanticMultiSelectTypes(value!) as [
                                    string,
                                  ],
                                )
                              }
                            />
                          </div>
                        )}
                      </>
                    );
                  } else if (field === 'role') {
                    return !isEditMode ? (
                      <BasicInfoInput
                        key={index}
                        label={field}
                        value={formatFieldDisplay(`${user[field]}`)}
                        isEditMode={isEditMode}
                        updateUserField={updateUserField}
                      />
                    ) : (
                      <>
                        {user.role === 'ADMIN' ? (
                          <div key={index} className="input-field">
                            <span>{field}</span>
                            <Dropdown
                              className="dropdown-field"
                              options={parseArrayToSemanticDropdownOptions(
                                dropdownOptions[`${field}`],
                              )}
                              onChange={(e, { value }) =>
                                updateUserField('role', `${value}`)
                              }
                              selection
                              floating
                              value={user.role}
                            />
                          </div>
                        ) : (
                          <BasicInfoInput
                            key={index}
                            label={field}
                            value={formatFieldDisplay(`${user[field]}`)}
                            isEditMode={isEditMode}
                            updateUserField={updateUserField}
                          />
                        )}
                      </>
                    );
                  } else if (field === 'dateJoined') {
                    return !isEditMode ? (
                      <BasicInfoInput
                        key={index}
                        label={field}
                        value={formatFieldDisplay(`${user[field]}`)}
                        isEditMode={isEditMode}
                        updateUserField={updateUserField}
                      />
                    ) : (
                      <div className="input-field">
                        <span>{field}</span>
                        <Input
                          value={formatDate(`${user.dateJoined}`)}
                          readOnly={!isEditMode}
                          transparent
                          onChange={(e) =>
                            updateUserField(
                              field,
                              new Date(e.currentTarget.value).toISOString(),
                            )
                          }
                          type="date"
                        />
                      </div>
                    );
                  }
                  return (
                    <BasicInfoInput
                      key={index}
                      label={field}
                      value={formatFieldDisplay(`${user[field]}`)}
                      isEditMode={isEditMode}
                      updateUserField={updateUserField}
                    />
                  );
                })}
              </Container>
            </Grid.Column>
            <Grid.Column textAlign="center" width={3}>
              <h2>My Interests</h2>
              {!isEditMode ? (
                user.interests.map((interest, index) => (
                  <div
                    className={`field-label ${convertToClassName(interest)}`}
                    key={index}
                  >
                    {interest}
                  </div>
                ))
              ) : (
                <Container style={{ paddingLeft: '20%' }}>
                  {interestFields.map((interest, index) => (
                    <div key={index} style={{ textAlign: 'left' }}>
                      <Checkbox
                        value={interest}
                        label={interest}
                        checked={user.interests.includes(interest)}
                        onChange={(e, data) => editInterests(`${data.value!}`)}
                      />
                    </div>
                  ))}
                </Container>
              )}
            </Grid.Column>
            <Grid.Column textAlign="center" width={3}>
              <h2>My Roles</h2>
              {!isEditMode ? (
                user.currentTeams.map((team, index) => (
                  <div
                    className={`field-label ${convertToClassName(team)}`}
                    key={index}
                  >
                    {team}
                  </div>
                ))
              ) : (
                <>
                  {user.role === 'ADMIN' ? (
                    <Container style={{ paddingLeft: '20%' }}>
                      {teamFields.map((team, index) => (
                        <div key={index} style={{ textAlign: 'left' }}>
                          <Checkbox
                            value={team}
                            label={team}
                            checked={user.currentTeams.includes(team)}
                            onChange={(e, data) => editTeams(`${data.value!}`)}
                          />
                        </div>
                      ))}
                    </Container>
                  ) : (
                    <>
                      {user.currentTeams.map((team, index) => (
                        <div
                          className={`field-label ${convertToClassName(team)}`}
                          key={index}
                        >
                          {team}
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row columns={2}>
            <Grid.Column textAlign="left" floated="left" width={6}>
              <h2>Socials/Contact</h2>
              <SocialsInput
                isEditMode={isEditMode}
                updateUserField={updateUserField}
                icon="mail"
                label="email"
                value={user.email}
              />
              <SocialsInput
                isEditMode={isEditMode}
                updateUserField={updateUserField}
                icon="phone"
                label="phone"
                value={user.phone}
              />
            </Grid.Column>
            <Grid.Column floated="left" width={6}>
              <SocialsInput
                icon="linkedin"
                label="linkedIn"
                value={user.linkedIn}
                isEditMode={isEditMode}
                updateUserField={updateUserField}
              />
              <SocialsInput
                icon="globe"
                label="portfolio"
                value={user.portfolio}
                isEditMode={isEditMode}
                updateUserField={updateUserField}
              />
              <SocialsInput
                icon="twitter"
                label="twitter"
                value={user.twitter}
                isEditMode={isEditMode}
                updateUserField={updateUserField}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </>
  );
};

export default Profile;
