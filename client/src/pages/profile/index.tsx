import React, { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IPitch, IUser } from 'ssw-common';
import { Button, Divider, Grid, GridColumn, Image } from 'semantic-ui-react';

import { FieldTag, UserPicture } from '../../components';
import {
  isError,
  getUser,
  getAggregatedUser,
  getUserPermissionsByID,
} from '../../api';
import Masthead from '../../assets/masthead.svg';
import { emptyPitch, emptyUser } from '../../utils/constants';
import {
  getFormattedDate,
  getUserFullName,
  titleCase,
} from '../../utils/helpers';
import { useAuth, useInterests, useTeams } from '../../contexts';
import Contributions from '../../components/Tables/Contributions';

import SocialsInput from './SocialsInput';
import './styles.scss';
import { IPermissions, ParamTypes } from './types';

const Profile = (): ReactElement => {
  const { userId } = useParams<ParamTypes>();
  const [user, setUser] = useState<IUser>(emptyUser);
  const [pitches, setPitches] = useState<Partial<IPitch>[]>([emptyPitch]);
  const auth = useAuth();
  const { teams } = useTeams();
  const { getInterestById } = useInterests();
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

    const loadCurrentUserPermissions = async (): Promise<void> => {
      const res = await getUserPermissionsByID(userId);

      if (!isError(res)) {
        setPermissions(res.data.result);
      }
    };
    const getPitches = async (): Promise<void> => {
      const res = await getAggregatedUser(userId);

      if (!isError(res)) {
        // pitches the user created
        const submittedPitches = res.data.result.aggregated.submittedPitches;

        // pitches the user claimed a team for
        const claimedPitches = res.data.result.aggregated.claimedPitches;

        const pitches = submittedPitches
          .concat(claimedPitches)
          .filter((pitch) => pitch !== null);
        setPitches(pitches);
      }
    };

    loadUser();
    loadCurrentUserPermissions();
    getPitches();

    return () => {
      setUser(emptyUser);
      setPermissions({
        view: [],
        edit: [],
      });
    };
  }, [userId]);

  /**
   * Determines if a field is viewable to current user
   *
   * @param field the field to check
   * @returns true if field is viewable, else false
   */
  const isViewable = (field: keyof IUser, value: string): boolean =>
    includesPermission(field) && value !== null && value !== '';
  const includesPermission = (field: keyof IUser): boolean =>
    permissions.view.includes(field);

  return (
    <div className="profile-page">
      <Grid padded stackable>
        <Grid.Row columns={5}>
          <Grid.Column className="profile-pic-col" text-align="left" width={4}>
            <div className="user-pic">
              <UserPicture size="tiny" user={user} />
            </div>
            <div className="name-pronouns">
              {user.preferredName !== '' && user.preferredName ? (
                <h2 className="name">{`${titleCase(
                  user.preferredName,
                )} (${titleCase(getUserFullName(user))})`}</h2>
              ) : (
                <h2>{titleCase(getUserFullName(user))}</h2>
              )}
              {user.pronouns.map((pronoun, index) => (
                <FieldTag
                  key={index}
                  name={pronoun.toLowerCase()}
                  content="pronouns"
                />
              ))}
              <div className="user-role">
                <FieldTag content={user.role} />
              </div>
              {/* <div className="rating">
                
                <Rating icon="star" defaultRating={3} maxRating={5} />
                <p className="number-ratings">(16)</p>
              </div> */}
              <div>
                {(userId === auth.user._id || auth.isAdmin) && (
                  <Button
                    size="medium"
                    className="edit-profile-btn"
                    content="Edit Profile"
                  />
                )}
              </div>
            </div>

            {user.masthead && (
              <Image className="masthead" size="small" src={Masthead} />
            )}
          </Grid.Column>
          <Grid.Column width={3}>
            <SocialsInput
              disabled={!user.email}
              icon="mail"
              value={user.email}
              viewable={isViewable('email', user.email)}
            />
            <div className="social-input">
              <SocialsInput
                disabled={!user.phone}
                icon="phone"
                value={user.phone}
                viewable={isViewable('phone', user.phone)}
              />
              <SocialsInput
                icon="linkedin"
                value={user.linkedIn}
                disabled={!user.linkedIn}
                viewable={isViewable('linkedIn', user.linkedIn)}
              />
              <SocialsInput
                icon="globe"
                value={user.portfolio}
                disabled={user.portfolio !== null}
                viewable={isViewable('portfolio', user.portfolio)}
              />
              <SocialsInput
                icon="twitter"
                value={user.twitter}
                disabled={user.twitter !== null}
                viewable={isViewable('twitter', user.twitter)}
              />
              <p className="registration">
                Registered on {getFormattedDate(new Date(user.dateJoined))}
              </p>
            </div>
          </Grid.Column>

          {includesPermission('teams') && (
            <Grid.Column textAlign="left" width={2}>
              <div>
                <h4>Teams</h4>
              </div>
              {user.teams.sort().map((teamId, index) => (
                <div key={index} className="tag-spacing">
                  <FieldTag
                    size="medium"
                    name={teams.find((team) => team._id === teamId)?.name}
                    hexcode={teams.find((team) => team._id === teamId)?.color}
                  />
                </div>
              ))}
            </Grid.Column>
          )}

          {includesPermission('interests') && (
            <Grid.Column textAlign="left" width={2}>
              <div>
                <h4>Topic Interests</h4>
              </div>
              {user.interests.sort().map((interest, index) => {
                const fullInterst = getInterestById(interest);
                return (
                  <div key={index} className="tag-spacing">
                    <FieldTag
                      size="medium"
                      name={fullInterst?.name}
                      hexcode={fullInterst?.color}
                    />
                  </div>
                );
              })}
            </Grid.Column>
          )}
          {includesPermission('neighborhood') && (
            <Grid.Column width={2}>
              <h4>Neighborhood</h4>
              <p>{user.neighborhood}</p>
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
      <Divider />
      {userId === auth.user._id ? (
        <h2>Your Contributions</h2>
      ) : (
        <h2>
          {`${
            user.preferredName !== '' && user.preferredName
              ? titleCase(user.preferredName)
              : titleCase(user.firstName)
          }'s` + ` Contributions`}
        </h2>
      )}
      <Contributions pitches={pitches} user={user} />

      <Grid columns={2} className="experience">
        {includesPermission('involvementResponse') && (
          <GridColumn>
            <h4>How and why user wants to get involved</h4>
            <p>{user.involvementResponse}</p>
          </GridColumn>
        )}
        {includesPermission('journalismResponse') && (
          <GridColumn>
            <h4>User's past experience</h4>
            <p>{user.journalismResponse}</p>
          </GridColumn>
        )}
      </Grid>
    </div>
  );
};

export default Profile;
