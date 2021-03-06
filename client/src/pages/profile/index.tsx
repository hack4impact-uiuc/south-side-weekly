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
  DropdownItemProps,
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
  getUserProfilePic,
  parseArrayToSemanticDropdownOptions,
  parseSemanticMultiSelectTypes,
  updateUserField,
} from '../../utils/helpers';
import {
  convertToCapitalized,
  convertToClassName,
  parseCamelCase,
} from '../../utils/formatters';

import SocialsInput from './SocialsInput';
import StringAttribute from './BasicInfoInput/StringAttribute';
import ArrayAttribute from './BasicInfoInput/ArrayAttribute';
import SelectAttribute from './BasicInfoInput/SelectAttribute';
import DateAttribute from './BasicInfoInput/DateAttribute';
import './styles.css';
import {
  IDropdownOptions,
  IPermissions,
  ParamTypes,
  MultiDropdowns,
} from './types';

const stringAttributes: (keyof IUser)[] = [
  'firstName',
  'lastName',
  'preferredName',
];
const arrayAttributes: MultiDropdowns[] = ['genders', 'pronouns', 'races'];

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
    } else if (teams.length >= 2) {
      return;
    } else {
      teams.push(team);
    }
    setUser(updateUserField(user, 'currentTeams', teams));
  };

  /**
   * Generically updates a user's string array field
   *
   * @param arr the array to set the user's convert array to
   * @param field the field of the user
   */
  const addArrayElement = (arr: string[], field: MultiDropdowns): void =>
    setUser(
      updateUserField(
        user,
        field,
        parseSemanticMultiSelectTypes(arr!) as [string],
      ),
    );

  /**
   * Determines if a field is viewable to current user
   *
   * @param field the field to check
   * @returns true if field is viewable, else false
   */
  const isViewable = (field: keyof IUser): boolean =>
    permissions.view.includes(field);

  /**
   * Determines if a field is editable to the current user
   *
   * @param field the field to check
   * @returns true if field is editable, else false
   */
  const isEditable = (field: keyof IUser): boolean =>
    permissions.edit.includes(field) && isEditMode;

  /**
   * Edits and updates the local user state varialble
   *
   * @param field the field of the user to edit
   * @param value the value corresponding to that field
   */
  const editUser = <T extends keyof IUser>(field: T, value: IUser[T]): void =>
    setUser(updateUserField(user, field, value));

  /**
   * Gets the cumulative options for a dropdown including
   * user's current options
   *
   * @param dropdown the dropdown to get
   * @returns the parsed semantic UI dropdown options
   */
  const getMultiDropdownOptions = (
    dropdown: MultiDropdowns,
  ): DropdownItemProps[] =>
    parseArrayToSemanticDropdownOptions(
      dropdownOptions[dropdown].concat(user[dropdown]),
    );

  /**
   * Adds an option to a dropdown
   *
   * @param dropdown the dropdown to add the option to
   * @param value the value to add
   */
  const addDropdownOption = (dropdown: MultiDropdowns, value: string): void => {
    let allOptions;

    if (dropdown === 'genders') {
      allOptions = allGenders;
    } else if (dropdown === 'pronouns') {
      allOptions = allPronouns;
    } else {
      allOptions = allRaces;
    }

    updateDropdownOptions(dropdown, value, allOptions);
  };

  return (
    <>
      <Sidebar currentPage={pages.PROFILE} />
      <Header />
      <div style={{ marginLeft: '15%', marginTop: '3%' }}>
        <Grid padded stackable>
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
                <div style={{ display: 'inline-block', textAlign: 'center' }}>
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
                </div>
              )}
            </Grid.Column>
            <Grid.Column width={5}>
              <HeaderTag as="h2">Basic Information</HeaderTag>
              <Container>
                {stringAttributes.map((attribute, index) => (
                  <StringAttribute
                    key={index}
                    label={parseCamelCase(attribute)}
                    value={user[attribute] as string}
                    onChange={(e, { value }) => editUser(attribute, value)}
                    disabled={!isEditable(attribute)}
                    viewable={isViewable(attribute)}
                  />
                ))}

                {arrayAttributes.map((attribute, index) => (
                  <ArrayAttribute
                    key={index}
                    label={parseCamelCase(attribute)}
                    value={user[attribute]}
                    options={getMultiDropdownOptions(attribute)}
                    onAddItem={(e, { value }) =>
                      addDropdownOption(attribute, `${value}`)
                    }
                    onChange={(e, { value }) =>
                      addArrayElement(value as string[], attribute)
                    }
                    viewable={isViewable(attribute)}
                    editable={isEditable(attribute)}
                  />
                ))}

                <SelectAttribute
                  label={parseCamelCase('role')}
                  value={convertToCapitalized(user.role)}
                  options={parseArrayToSemanticDropdownOptions(
                    dropdownOptions['role'],
                  )}
                  onChange={(e, { value }) => editUser('role', `${value}`)}
                  viewable={isViewable('role')}
                  editable={isEditable('role')}
                />

                <DateAttribute
                  label={parseCamelCase('dateJoined')}
                  value={user.dateJoined}
                  onChange={(e, { value }) =>
                    editUser('dateJoined', new Date(value))
                  }
                  viewable={isViewable('dateJoined')}
                  editable={isEditable('dateJoined')}
                />
              </Container>
            </Grid.Column>

            {isViewable('interests') && (
              <Grid.Column textAlign="center" width={3}>
                <HeaderTag as="h2">My Interests</HeaderTag>
                {isEditable('interests') ? (
                  <Container>
                    {allInterests.map((interest, index) => (
                      <div key={index} className="checkbox-group">
                        <Checkbox
                          className="checkbox"
                          value={interest}
                          label={convertToCapitalized(interest)}
                          checked={user.interests.includes(interest)}
                          onChange={(e, { value }) => {
                            addInterest(`${value}`);
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

            {isViewable('currentTeams') && (
              <Grid.Column textAlign="center" width={3}>
                <HeaderTag as="h2">My Teams</HeaderTag>
                {isEditable('currentTeams') ? (
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
                disabled={!isEditable('email')}
                onChange={(e, { value }) => editUser('email', value)}
                icon="mail"
                value={user.email}
                viewable={isViewable('email')}
              />

              <SocialsInput
                disabled={!isEditable('phone')}
                onChange={(e, { value }) => editUser('phone', value)}
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
                disabled={!isEditable('linkedIn')}
                onChange={(e, { value }) => editUser('linkedIn', value)}
                viewable={isViewable('linkedIn')}
              />
              <SocialsInput
                icon="globe"
                value={user.portfolio}
                disabled={!isEditable('portfolio')}
                onChange={(e, { value }) => editUser('portfolio', value)}
                viewable={isViewable('portfolio')}
              />
              <SocialsInput
                icon="twitter"
                value={user.twitter}
                disabled={!isEditable('twitter')}
                onChange={(e, { value }) => editUser('twitter', value)}
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
