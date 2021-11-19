import React, { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IUser } from 'ssw-common';
import {
  Button,
  Divider,
  Grid,
  Image,
} from 'semantic-ui-react';

import {
  isError,
  getUser,
  getUserPermissionsByID,
} from '../../api';
import { FieldTag, UserPicture } from '../../components';
import Masthead from '../../assets/masthead.svg';
import {
  emptyUser,
} from '../../utils/constants';
import {
  titleCase,
  getUserFullName,
} from '../../utils/helpers';
import { useAuth, useInterests, useTeams } from '../../contexts';

import SocialsInput from './SocialsInput';
import './styles.scss';
import {
  IPermissions,
  ParamTypes,
} from './types';

const Profile = (): ReactElement => {
  const { userId } = useParams<ParamTypes>();
  const [user, setUser] = useState<IUser>(emptyUser);
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
 
  return (
    <div className="profile-page">
      <Grid padded stackable>
        <Grid.Row columns={5}>
          <Grid.Column className="profile-pic-col" text-align="left" width={3}>
            <div className="user-pic">
              {' '}
              <UserPicture size="tiny" user={user} />
            </div>
            <div className="name-pronouns">
              <h2 className="name">{getUserFullName(user)}</h2>
              {user.pronouns.map((pronoun, index) => (
                <FieldTag key ={index} name={pronoun.toLowerCase()}/>
              ))}
              <div>
              <FieldTag name={titleCase(auth.user.role.toLowerCase())} />
              </div>
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
          <Grid.Column>
          <SocialsInput
              disabled={user.email !== null}
              icon="mail"
              value={user.email}
              viewable={user.email !== null}
            />
            <div className="social-input">
             <SocialsInput
              disabled={user.phone !== null}
              icon="phone"
              value={user.phone}
              viewable={user.phone !== null}
            />
             <SocialsInput
              icon="linkedin"
              value={user.linkedIn}
              disabled={user.linkedIn !== null}
              viewable={user.linkedIn !== null}
            />
            <SocialsInput
              icon="globe"
              value={user.portfolio}
              disabled={user.portfolio !== null}
              viewable={user.portfolio !== null}
            />
            <SocialsInput
              icon="twitter"
              value={user.twitter}
              disabled={user.twitter !== null}
              viewable={user.twitter !== null}
            />
            </div>
            </Grid.Column>
            

          <Grid.Column textAlign="left">
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

          <Grid.Column textAlign="left">
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
          <Grid.Column>
            <h4>Neighborhood</h4>
            <p>{user.neighborhood}</p>
          </Grid.Column>
        </Grid.Row>
        </Grid>
        <Divider />
        <h2 className="table-header">Your Contributions</h2>
    </div>
  );
};

export default Profile;
