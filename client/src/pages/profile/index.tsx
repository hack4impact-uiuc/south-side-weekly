import React, { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IUser } from 'ssw-common';
import {
  Button,
  Container,
  Checkbox,
  Divider,
  Grid,
  Header as HeaderTag,
  Image,
  Input,
  Dropdown,
} from 'semantic-ui-react';

import {
  isError,
  getUser,
  updateUser,
  getCurrentUser,
  getUserPermissionsByID,
} from '../../api';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { pages } from '../../utils/enums';
import Masthead from '../../assets/masthead.svg';
import {
  allInterests,
  allTeams,
  allGenders,
  allPronouns,
  allRoles,
  allRaces,
  emptyUser,
} from '../../utils/constants';
import {
  convertToCapitalized,
  convertToClassName,
  getUserProfilePic,
  parseArrayToSemanticDropdownOptions,
  parseSemanticMultiSelectTypes,
  updateUserField,
} from '../../utils/helpers';

import SocialsInput from './SocialsInput';
import './styles.css';
import { IDropdownOptions, IPermissions, ParamTypes } from './types';

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
    races: allRaces,
  });
  const [permissions, setPermissions] = useState<IPermissions>({
    view: [],
    edit: [],
  });

  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      const res = await getUser(userId);
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

    const loadCurrentUserPermissions = async (): Promise<void> => {
      const res = await getUserPermissionsByID(userId);

      if (!isError(res)) {
        setPermissions(res.data.result);
      }
    };

    loadUser();
    loadCurrentUser();
    loadCurrentUserPermissions();
  }, [userId]);

  /**
   * Adds a dropdown option that was inputted by the user
   *
   * @param dropdown the dropdown to update
   * @param addedItem the new item to add
   * @param standardOptions the predefined options for the dropdown
   */
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

  // Starts edit mode for a profile page
  const startEditMode = (): void => {
    setIsEditMode(true);
    setTempUser({ ...user });
  };

  // Ends edit mode for a profile page
  const cancelEditMode = (): void => {
    setIsEditMode(false);
    setUser(tempUser);
  };

  // Calls the API to save the modified user
  const saveUser = async (): Promise<void> => {
    const res = await updateUser({ ...user }, userId);

    if (!isError(res)) {
      setIsEditMode(false);
    }
  };

  /**
   * Adds an interest to a user's interest
   *
   * @param interest the interest to add
   */
  const addInterest = (interest: string): void => {
    const interests = [...user.interests] as [string];
    const currentIndex = interests.indexOf(interest);
    if (currentIndex >= 0) {
      interests.splice(currentIndex, 1);
    } else {
      interests.push(interest);
    }
    setUser(updateUserField(user, 'interests', interests));
  };

  /**
   * Adds a team to a user's currentTeams
   *
   * @param team the team to add
   */
  const addTeam = (team: string): void => {
    const teams = [...user.currentTeams] as [string];
    const currentIndex = teams.indexOf(team);
    if (currentIndex >= 0) {
      teams.splice(currentIndex, 1);
    } else {
      teams.push(team);
    }
    setUser(updateUserField(user, 'currentTeams', teams));
  };

  /**
   * Parses a camel cased string into Title-style format
   *
   * exampleName --> Example Name
   *
   * @param str the string to parse
   * @returns the formatted string
   */
  const parseCamelCase = (str: string): string => {
    const split = str.replace(/([a-z])([A-Z])/g, '$1 $2');
    return split.charAt(0).toUpperCase() + split.slice(1);
  };

  /**
   * Generically updates a user's string array field
   *
   * @param arr the array to set the user's convert array to
   * @param field the field of the user
   */
  const addArrayElement = (
    arr: string[],
    field: 'genders' | 'pronouns' | 'races',
  ): void =>
    setUser(
      updateUserField(
        user,
        field,
        parseSemanticMultiSelectTypes(arr!) as [string],
      ),
    );

  /**
   * Adds a gender to a user's genders
   *
   * @param gender the gender to add
   */
  const addGender = (gender: string[]): void =>
    addArrayElement(gender, 'genders');

  /**
   * Adds a pronoun to a user's pronouns
   *
   * @param pronoun the pronoun to add
   */
  const addPronoun = (pronoun: string[]): void =>
    addArrayElement(pronoun, 'pronouns');

  /**
   * Adds a race to a user's races
   *
   * @param race the race to add
   */
  const addRace = (race: string[]): void => addArrayElement(race, 'races');

  /**
   * Determines if a field is viewable to current user
   *
   * @param field the field to check
   * @returns true if field is viewable, else false
   */
  const isViewable = (field: keyof IUser): boolean =>
    permissions.view.includes(field);

  return (
    <>
      <Sidebar currentPage={pages.PROFILE} />
      <Header />
      <div style={{ marginLeft: '15%', marginTop: '3%' }}>
        <Grid stackable>
          <Grid.Row columns={4}>
            <Grid.Column className="profile-pic-col">
              {(userId === currentUser._id || currentUser.role === 'ADMIN') && (
                <Button
                  size="medium"
                  className="edit-profile-btn"
                  onClick={startEditMode}
                  content="Edit Profile"
                />
              )}

              <Image size="small" circular src={getUserProfilePic(user)} />

              {user.masthead && (
                <Image className="masthead" size="small" src={Masthead} />
              )}

              {isEditMode && (
                <Button.Group>
                  <Button
                    className="edit-mode-btn save"
                    content="Save Changes"
                    onClick={saveUser}
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
              <HeaderTag as="h2">Basic Information</HeaderTag>
              <Container>
                {permissions.view.includes('firstName') && (
                  <div className="input-field">
                    <span>{`${parseCamelCase('firstName')}:`}</span>
                    <Input
                      value={user.firstName}
                      transparent
                      readOnly={
                        !isEditMode || !permissions.edit.includes('firstName')
                      }
                      onChange={(e, { value }) =>
                        setUser(updateUserField(user, 'firstName', value))
                      }
                    />
                  </div>
                )}

                {permissions.view.includes('lastName') && (
                  <div className="input-field">
                    <span>{`${parseCamelCase('lastName')}:`}</span>
                    <Input
                      value={user.lastName}
                      transparent
                      readOnly={
                        !isEditMode || !permissions.edit.includes('lastName')
                      }
                      onChange={(e, { value }) =>
                        setUser(updateUserField(user, 'lastName', value))
                      }
                    />
                  </div>
                )}

                {permissions.view.includes('preferredName') && (
                  <div className="input-field">
                    <span>{`${parseCamelCase('preferredName')}:`}</span>
                    <Input
                      value={user.preferredName}
                      transparent
                      readOnly={
                        !isEditMode ||
                        !permissions.edit.includes('preferredName')
                      }
                      onChange={(e, { value }) =>
                        setUser(updateUserField(user, 'preferredName', value))
                      }
                    />
                  </div>
                )}

                {permissions.view.includes('genders') && (
                  <>
                    {isEditMode && permissions.edit.includes('genders') ? (
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
                          onChange={(e, { value }) =>
                            addGender(value as string[])
                          }
                        />
                      </div>
                    ) : (
                      <div className="input-field">
                        <span>{`${parseCamelCase('genders')}:`}</span>
                        <Input
                          value={user.genders.join(', ')}
                          transparent
                          readOnly
                        />
                      </div>
                    )}
                  </>
                )}

                {permissions.view.includes('pronouns') && (
                  <>
                    {isEditMode && permissions.edit.includes('pronouns') ? (
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
                          onChange={(e, { value }) =>
                            addPronoun(value as string[])
                          }
                        />
                      </div>
                    ) : (
                      <div className="input-field">
                        <span>{`${parseCamelCase('pronouns')}:`}</span>
                        <Input value={user.pronouns.join(', ')} transparent />
                      </div>
                    )}
                  </>
                )}

                {permissions.view.includes('races') && (
                  <>
                    {isEditMode && permissions.edit.includes('races') ? (
                      <div className="input-field">
                        <span>{parseCamelCase('races')}</span>
                        <Dropdown
                          className="dropdown-field"
                          options={parseArrayToSemanticDropdownOptions(
                            dropdownOptions['races'].concat(user.races),
                          )}
                          search
                          selection
                          floating
                          multiple
                          allowAdditions
                          value={user.races}
                          onAddItem={(e, { value }) =>
                            updateDropdownOptions(
                              'races',
                              value!.toString(),
                              allRaces,
                            )
                          }
                          onChange={(e, { value }) =>
                            addRace(value as string[])
                          }
                        />
                      </div>
                    ) : (
                      <div className="input-field">
                        <span>{`${parseCamelCase('races')}:`}</span>
                        <Input value={user.races.join(', ')} transparent />
                      </div>
                    )}
                  </>
                )}

                {permissions.view.includes('role') && (
                  <>
                    {isEditMode && permissions.edit.includes('role') ? (
                      <div className="input-field">
                        <span>{parseCamelCase('role')}</span>
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
                        />
                      </div>
                    )}
                  </>
                )}

                {permissions.view.includes('dateJoined') && (
                  <>
                    {isEditMode && permissions.edit.includes('dateJoined') ? (
                      <div className="input-field">
                        <span>{parseCamelCase('dateJoined')}</span>
                        <Input
                          value={
                            new Date(user.dateJoined)
                              .toISOString()
                              .split('T')[0]
                          }
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
                        />
                      </div>
                    )}
                  </>
                )}
              </Container>
            </Grid.Column>

            {permissions.view.includes('interests') && (
              <Grid.Column textAlign="center" width={3}>
                <HeaderTag as="h2">My Interests</HeaderTag>
                {isEditMode && permissions.edit.includes('interests') ? (
                  <Container>
                    {allInterests.map((interest, index) => (
                      <div key={index} className="checkbox-group">
                        <Checkbox
                          className="checkbox"
                          value={interest}
                          label={convertToCapitalized(interest)}
                          checked={user.interests.includes(interest)}
                          onChange={(e, data) => {
                            addInterest(`${data.value!}`);
                          }}
                        />
                      </div>
                    ))}
                  </Container>
                ) : (
                  user.interests.sort().map((interest, index) => (
                    <div
                      className={`field-label ${convertToClassName(interest)}`}
                      key={index}
                    >
                      {convertToCapitalized(interest)}
                    </div>
                  ))
                )}
              </Grid.Column>
            )}

            {permissions.view.includes('currentTeams') && (
              <Grid.Column textAlign="center" width={3}>
                <HeaderTag as="h2">My Teams</HeaderTag>
                {isEditMode && permissions.edit.includes('currentTeams') ? (
                  <Container>
                    <div className="checkbox-group">
                      {allTeams.map((team, index) => (
                        <Checkbox
                          key={index}
                          className="checkbox"
                          value={team}
                          label={convertToCapitalized(team)}
                          checked={user.currentTeams.includes(team)}
                          onChange={(e, data) => addTeam(`${data.value!}`)}
                        />
                      ))}
                    </div>
                  </Container>
                ) : (
                  user.currentTeams.sort().map((team, index) => (
                    <div
                      className={`field-label ${convertToClassName(team)}`}
                      key={index}
                    >
                      {convertToCapitalized(team)}
                    </div>
                  ))
                )}
              </Grid.Column>
            )}
          </Grid.Row>
          <Divider />
          <Grid.Row centered columns={3}>
            <Grid.Column textAlign="left" width={6}>
              <HeaderTag as="h2">Socials/Contact</HeaderTag>
              <SocialsInput
                readOnly={!isEditMode || !permissions.edit.includes('email')}
                onChange={(e, { value }) =>
                  setUser(updateUserField(user, 'email', value))
                }
                icon="mail"
                value={user.email}
                viewable={isViewable('email')}
              />

              <SocialsInput
                readOnly={!isEditMode || !permissions.edit.includes('phone')}
                onChange={(e, { value }) =>
                  setUser(updateUserField(user, 'phone', value))
                }
                icon="phone"
                value={user.phone}
                viewable={isViewable('phone')}
              />
            </Grid.Column>
            <Grid.Column width={2} />
            <Grid.Column textAlign="left" width={6}>
              <SocialsInput
                icon="linkedin"
                value={user.linkedIn}
                readOnly={!isEditMode}
                onChange={(e, { value }) =>
                  setUser(updateUserField(user, 'linkedIn', value))
                }
                viewable={isViewable('linkedIn')}
              />
              <SocialsInput
                icon="globe"
                value={user.portfolio}
                readOnly={!isEditMode}
                onChange={(e, { value }) =>
                  setUser(updateUserField(user, 'portfolio', value))
                }
                viewable={isViewable('portfolio')}
              />
              <SocialsInput
                icon="twitter"
                value={user.twitter}
                readOnly={!isEditMode}
                onChange={(e, { value }) =>
                  setUser(updateUserField(user, 'twitter', value))
                }
                viewable={isViewable('twitter')}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </>
  );
};

export default Profile;
