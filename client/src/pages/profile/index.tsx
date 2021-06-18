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

import {
  isError,
  loadUser,
  saveUser,
  getCurrentUser,
} from '../../utils/apiWrapper';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { pages } from '../../utils/enums';
import DefaultProfile from '../../assets/default_profile.png';
import Masthead from '../../assets/masthead.svg';
import {
  allInterests,
  allTeams,
  allGenders,
  allPronouns,
  allRoles,
  emptyUser,
} from '../../utils/constants';
import {
  convertToCapitalized,
  convertToClassName,
  parseArrayToSemanticDropdownOptions,
  parseSemanticMultiSelectTypes,
  updateUserField,
} from '../../utils/helpers';

import SocialsInput from './SocialsInput';
import './styles.css';
import { IDropdownOptions, ParamTypes } from './types';

const Profile = (): ReactElement => {
  const { userId } = useParams<ParamTypes>();
  const [user, setUser] = useState<IUser>(emptyUser);
  const [currentUser, setCurrentUser] = useState<IUser>(emptyUser);
  const [tempUser, setTempUser] = useState<IUser>(emptyUser);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState<IDropdownOptions>({
    genders: allGenders,
    pronouns: allPronouns,
    role: allRoles,
  });

  // const [permissions, setPermissions] = useState();

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const res = await loadUser(userId);
      if (!isError(res)) {
        const user = res.data.result;
        setUser(user);
      }
    };

    const loadCurrentUser = async (): Promise<void> => {
      const res = await getCurrentUser();

      if (!isError(res)) {
        setCurrentUser(res.data.result);
      }
    };

    getUser();
    loadCurrentUser();
  }, [userId]);

  const updateDropdownOptions = (
    dropdown: string,
    addedItem: string,
    standardOptions: string[],
  ): void => {
    const currentOptions = dropdownOptions[dropdown];
    currentOptions.push(addedItem);

    dropdownOptions[dropdown] = standardOptions.concat(
      currentOptions.filter((item) => standardOptions.indexOf(item) < 0),
    );

    setDropdownOptions({ ...dropdownOptions });
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

  const editInterests = (interest: string): void => {
    const userCopy = { ...user };
    const currentIndex = user.interests.indexOf(interest);
    if (currentIndex >= 0) {
      userCopy.interests.splice(currentIndex, 1);
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

  const parseCamelCase = (str: string): string => {
    const split = str.replace(/([a-z])([A-Z])/g, '$1 $2');
    return split.charAt(0).toUpperCase() + split.slice(1);
  };

  const addGender = (value: string[]): void =>
    setUser(
      updateUserField(
        user,
        'genders',
        parseSemanticMultiSelectTypes(value!) as [string],
      ),
    );

  const addPronoun = (value: string[]): void =>
    setUser(
      updateUserField(
        user,
        'pronouns',
        parseSemanticMultiSelectTypes(value!) as [string],
      ),
    );

  return (
    <>
      <Sidebar currentPage={pages.PROFILE} />
      <Header />
      <div style={{ marginLeft: '15%', marginTop: '5%' }}>
        <Grid stackable>
          <Grid.Row columns={4}>
            <Grid.Column
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              {(userId === currentUser._id || currentUser.role === 'ADMIN') && (
                <Button
                  size="medium"
                  className="edit-profile-btn"
                  onClick={startEditMode}
                  content="Edit Profile"
                />
              )}

              <Image
                size="small"
                circular
                src={
                  user.profilePic !== '' && user.profilePic !== null
                    ? user.profilePic
                    : DefaultProfile
                }
              />
              {user.masthead && (
                <Image
                  style={{ marginTop: '-25px' }}
                  size="small"
                  src={Masthead}
                />
              )}
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
            <Grid.Column width={5}>
              <h2>Basic information</h2>
              <Container style={{ marginBottom: '5px' }}>
                <div className="input-field">
                  <span>{`${parseCamelCase('firstName')}:`}</span>
                  <Input
                    value={user.firstName}
                    transparent
                    readOnly={!isEditMode}
                    onChange={(e, { value }) =>
                      setUser(updateUserField(user, 'firstName', value))
                    }
                  />
                </div>
                <div className="input-field">
                  <span>{`${parseCamelCase('lastName')}:`}</span>
                  <Input
                    value={user.lastName}
                    transparent
                    readOnly={!isEditMode}
                    onChange={(e, { value }) =>
                      setUser(updateUserField(user, 'lastName', value))
                    }
                  />
                </div>
                <div className="input-field">
                  <span>{`${parseCamelCase('preferredName')}:`}</span>
                  <Input
                    value={user.preferredName}
                    transparent
                    readOnly={!isEditMode}
                    onChange={(e, { value }) =>
                      setUser(updateUserField(user, 'preferredName', value))
                    }
                  />
                </div>
                {isEditMode ? (
                  <div className="input-field">
                    <span>{parseCamelCase('genders')}</span>
                    <Dropdown
                      className="dropdown-field"
                      options={parseArrayToSemanticDropdownOptions(
                        dropdownOptions['genders'].concat(user.genders),
                      )}
                      search
                      selection
                      floating
                      multiple
                      allowAdditions
                      value={user.genders}
                      onAddItem={(e, { value }) =>
                        updateDropdownOptions(
                          'genders',
                          value!.toString(),
                          allGenders,
                        )
                      }
                      onChange={(e, { value }) => addGender(value as string[])}
                    />
                  </div>
                ) : (
                  <div className="input-field">
                    <span>{`${parseCamelCase('genders')}:`}</span>
                    <Input
                      value={user.genders.join(', ')}
                      transparent
                      readOnly={!isEditMode}
                    />
                  </div>
                )}
                {isEditMode ? (
                  <div className="input-field">
                    <span>{parseCamelCase('pronouns')}</span>
                    <Dropdown
                      className="dropdown-field"
                      options={parseArrayToSemanticDropdownOptions(
                        dropdownOptions['pronouns'].concat(user.pronouns),
                      )}
                      search
                      selection
                      floating
                      multiple
                      allowAdditions
                      value={user.pronouns}
                      onAddItem={(e, { value }) =>
                        updateDropdownOptions(
                          'pronouns',
                          value!.toString(),
                          allPronouns,
                        )
                      }
                      onChange={(e, { value }) => addPronoun(value as string[])}
                    />
                  </div>
                ) : (
                  <div className="input-field">
                    <span>{`${parseCamelCase('pronouns')}:`}</span>
                    <Input
                      value={user.pronouns.join(', ')}
                      transparent
                      readOnly={!isEditMode}
                    />
                  </div>
                )}
                {isEditMode && currentUser.role === 'ADMIN' ? (
                  <div className="input-field">
                    <span>{parseCamelCase('pronouns')}</span>
                    <Dropdown
                      className="dropdown-field"
                      options={parseArrayToSemanticDropdownOptions(
                        dropdownOptions['role'],
                      )}
                      onChange={(e, { value }) =>
                        setUser(updateUserField(user, 'role', `${value}`))
                      }
                      selection
                      floating
                      value={user.role}
                    />
                  </div>
                ) : (
                  <div className="input-field">
                    <span>{`${parseCamelCase('role')}:`}</span>
                    <Input
                      value={convertToCapitalized(user.role)}
                      transparent
                      readOnly={!isEditMode}
                    />
                  </div>
                )}
                {isEditMode ? (
                  <div className="input-field">
                    <span>{parseCamelCase('dateJoined')}</span>
                    <Input
                      value={
                        new Date(user.dateJoined).toISOString().split('T')[0]
                      }
                      readOnly={!isEditMode}
                      transparent
                      onChange={(e) =>
                        setUser(
                          updateUserField(
                            user,
                            'dateJoined',
                            new Date(e.currentTarget.value),
                          ),
                        )
                      }
                      type="date"
                      max={new Date(Date.now()).toISOString().split('T')[0]}
                    />
                  </div>
                ) : (
                  <div className="input-field">
                    <span>{`${parseCamelCase('dateJoined')}:`}</span>
                    <Input
                      value={new Date(user.dateJoined).toLocaleDateString(
                        'en-US',
                        { timeZone: 'UTC' },
                      )}
                      transparent
                      readOnly={!isEditMode}
                    />
                  </div>
                )}
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
                    {convertToCapitalized(interest)}
                  </div>
                ))
              ) : (
                <Container style={{ paddingLeft: '20%' }}>
                  {allInterests.map((interest, index) => (
                    <div key={index} style={{ textAlign: 'left' }}>
                      <Checkbox
                        value={interest}
                        label={convertToCapitalized(interest)}
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
              {!isEditMode || currentUser.role !== 'ADMIN' ? (
                user.currentTeams.map((team, index) => (
                  <div
                    className={`field-label ${convertToClassName(team)}`}
                    key={index}
                  >
                    {convertToCapitalized(team)}
                  </div>
                ))
              ) : (
                <Container style={{ paddingLeft: '20%' }}>
                  {allTeams.map((team, index) => (
                    <div key={index} style={{ textAlign: 'left' }}>
                      <Checkbox
                        value={team}
                        label={convertToCapitalized(team)}
                        checked={user.currentTeams.includes(team)}
                        onChange={(e, data) => editTeams(`${data.value!}`)}
                      />
                    </div>
                  ))}
                </Container>
              )}
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row columns={2}>
            <Grid.Column textAlign="left" floated="left" width={6}>
              <h2>Socials/Contact</h2>
              <SocialsInput
                readOnly={!isEditMode}
                onChange={(e, { value }) =>
                  setUser(updateUserField(user, 'email', value))
                }
                icon="mail"
                value={user.email}
              />
              <SocialsInput
                readOnly={!isEditMode}
                onChange={(e, { value }) =>
                  setUser(updateUserField(user, 'phone', value))
                }
                icon="phone"
                value={user.phone}
              />
            </Grid.Column>
            <Grid.Column floated="left" width={6}>
              <SocialsInput
                icon="linkedin"
                value={user.linkedIn}
                readOnly={!isEditMode}
                onChange={(e, { value }) =>
                  setUser(updateUserField(user, 'linkedIn', value))
                }
              />
              <SocialsInput
                icon="globe"
                value={user.portfolio}
                readOnly={!isEditMode}
                onChange={(e, { value }) =>
                  setUser(updateUserField(user, 'portfolio', value))
                }
              />
              <SocialsInput
                icon="twitter"
                value={user.twitter}
                readOnly={!isEditMode}
                onChange={(e, { value }) =>
                  setUser(updateUserField(user, 'twitter', value))
                }
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </>
  );
};

export default Profile;
