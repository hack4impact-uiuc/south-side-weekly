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
import { startCase } from 'lodash';

import {
  isError,
  getUser,
  updateUser,
  getUserPermissionsByID,
} from '../../api';
import { FieldTag, UserPicture } from '../../components';
import Masthead from '../../assets/masthead.svg';
import {
  allGenders,
  allPronouns,
  allRoles,
  allRaces,
  emptyUser,
} from '../../utils/constants';
import { parseOptions, updateUserField, titleCase } from '../../utils/helpers';
import { useAuth, useInterests, useTeams } from '../../contexts';

import SocialsInput from './SocialsInput';
import StringAttribute from './BasicInfoInput/StringAttribute';
import ArrayAttribute from './BasicInfoInput/ArrayAttribute';
import SelectAttribute from './BasicInfoInput/SelectAttribute';
import DateAttribute from './BasicInfoInput/DateAttribute';
import './styles.scss';
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

  const auth = useAuth();
  const { teams } = useTeams();
  const { interests, getInterestById } = useInterests();

  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      const res = await getUser(userId);
      if (!isError(res)) {
        const user = res.data.result;
        setUser(user);
      }
    };

    const loadCurrentUserPermissions = async (): Promise<void> => {
      const res = await getUserPermissionsByID(userId);

      if (!isError(res)) {
        setPermissions(res.data.result);
      }
    };

    loadUser();
    loadCurrentUserPermissions();

    return () => {
      setUser(emptyUser);
      setPermissions({
        view: [],
        edit: [],
      });
    };
  }, [userId]);

  /**
   * Adds a dropdown option that was input by the user
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
    const interests = [...user.interests];
    const currentIndex = interests.indexOf(interest);
    if (currentIndex >= 0) {
      interests.splice(currentIndex, 1);
    } else {
      interests.push(interest);
    }
    setUser(updateUserField(user, 'interests', interests));
  };

  /**
   * Adds a team to a user's teams
   *
   * @param team the team to add
   */
  const addTeam = (team: string): void => {
    const teams = user.teams;
    const currentIndex = teams.indexOf(team);
    if (currentIndex >= 0) {
      teams.splice(currentIndex, 1);
    } else if (teams.length >= 2) {
      return;
    } else {
      teams.push(team);
    }
    setUser(updateUserField(user, 'teams', teams));
  };

  /**
   * Generically updates a user's string array field
   *
   * @param arr the array to set the user's convert array to
   * @param field the field of the user
   */
  const addArrayElement = (arr: string[], field: MultiDropdowns): void =>
    setUser(updateUserField(user, field, arr));

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
    parseOptions(dropdownOptions[dropdown].concat(user[dropdown]));

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
    <div>
      <Grid padded stackable>
        <Grid.Row columns={4}>
          <Grid.Column className="profile-pic-col">
            {(userId === auth.user._id || auth.isAdmin) && (
              <Button
                size="medium"
                className="edit-profile-btn"
                onClick={startEditMode}
                content="Edit Profile"
              />
            )}

            <UserPicture size="small" user={user} />

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
                  label={titleCase(attribute)}
                  value={user[attribute] as string}
                  onChange={(e, { value }) => editUser(attribute, value)}
                  disabled={!isEditable(attribute)}
                  viewable={isViewable(attribute)}
                />
              ))}

              {arrayAttributes.map((attribute, index) => (
                <ArrayAttribute
                  key={index}
                  label={titleCase(attribute)}
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
                label={titleCase('role')}
                value={titleCase(user.role)}
                options={parseOptions(allRoles)}
                onChange={(e, { value }) => editUser('role', `${value}`)}
                viewable={isViewable('role')}
                editable={isEditable('role')}
              />

              <DateAttribute
                label={startCase('dateJoined')}
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
                  {interests.map((interest, index) => (
                    <div key={index} className="checkbox-group">
                      <Checkbox
                        className="checkbox"
                        value={interest._id}
                        label={titleCase(interest.name)}
                        checked={user.interests.includes(interest._id)}
                        onChange={(e, { value }) => {
                          addInterest(`${value}`);
                        }}
                      />
                    </div>
                  ))}
                </Container>
              ) : (
                user.interests.sort().map((interest, index) => {
                  const fullInterst = getInterestById(interest);

                  return (
                    <FieldTag
                      size="medium"
                      key={index}
                      className="field-label"
                      name={fullInterst?.name}
                      hexcode={fullInterst?.color}
                    />
                  );
                })
              )}
            </Grid.Column>
          )}

          {isViewable('teams') && (
            <Grid.Column textAlign="center" width={3}>
              <HeaderTag as="h2">My Teams</HeaderTag>
              {isEditable('teams') ? (
                <div className="checkbox-group">
                  {teams.map((team, index) => (
                    <Checkbox
                      key={index}
                      className="checkbox"
                      value={team.name}
                      label={titleCase(team.name)}
                      checked={user.teams.includes(team._id)}
                      onChange={() => addTeam(team._id)}
                    />
                  ))}
                </div>
              ) : (
                user.teams
                  .sort()
                  .map((teamId, index) => (
                    <FieldTag
                      size="medium"
                      key={index}
                      className="field-label"
                      name={teams.find((team) => team._id === teamId)?.name}
                      hexcode={teams.find((team) => team._id === teamId)?.color}
                    />
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
  );
};

export default Profile;
