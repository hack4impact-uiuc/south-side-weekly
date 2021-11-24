import React, { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IPitch, IUser} from 'ssw-common';
import {
  Button,
  Divider,
  Grid,
  GridColumn,
  Image,
  Rating,
  Container,
} from 'semantic-ui-react';

import { FieldTag, UserPicture } from '../../components';
import {
  isError,
  getUser,
  getUserPermissionsByID,
  getAggregatedUser,
} from '../../api';
import Masthead from '../../assets/masthead.svg';
import { emptyPitch, emptyUser } from '../../utils/constants';
import { getFormattedDate, getUserFullName } from '../../utils/helpers';
import { useAuth, useInterests, useTeams } from '../../contexts';
import Contributions from '../../components/Tables/Contributions';

import SocialsInput from './SocialsInput';
import './styles.scss';
import { ParamTypes } from './types';

const Profile = (): ReactElement => {
  const { userId } = useParams<ParamTypes>();
  const [user, setUser] = useState<IUser>(emptyUser);
  const [pitches, setPitches] = useState<Partial<IPitch>[]>([emptyPitch]);
  const auth = useAuth();
  const { teams } = useTeams();
  const { getInterestById } = useInterests();
 
  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      const res = await getUser(userId);
      if (!isError(res)) {
        const user = res.data.result;
        setUser(user);
      }
    };

    const getPitches = async (): Promise<void> => {
      const res = await getAggregatedUser(userId);
      if (!isError(res)) {
        console.log(res.data.result.aggregated.claimedPitches);
        const submittedPitches = res.data.result.aggregated.submittedPitches;
        const claimedPitches = res.data.result.aggregated.claimedPitches;
        const pitches = submittedPitches
          .concat(claimedPitches)
          .filter((pitch) => pitch !== null);
        setPitches(pitches);
      }
    };

    getPitches();
    loadUser();

    return () => {
      setUser(emptyUser);
    
    };
  }, [userId]);

  return (
    <div className="profile-page">
      <Grid padded stackable>
        <Grid.Row columns={5}>
          <Grid.Column className="profile-pic-col" text-align="left" width={4}>
            <div className="user-pic">
              {' '}
              <UserPicture size="tiny" user={user} />
            </div>
            <div className="name-pronouns">
              <h2 className="name">{`${user.preferredName} (${getUserFullName(
                user,
              )})`}</h2>
              {user.pronouns.map((pronoun, index) => (
                <FieldTag
                  key={index}
                  name={pronoun.toLowerCase()}
                  content="pronouns"
                />
              ))}
              <div className="user-role">
                <FieldTag content={auth.user.role} />
              </div>
              <div className="rating">
                {/* TODO: update when rating is added to model*/}
                <Rating icon="star" defaultRating={3} maxRating={5} />
                <p className="number-ratings">(16)</p>
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
          <Grid.Column width={3}>
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
              <p className="registration">
                Registered on {getFormattedDate(new Date(user.dateJoined))}
              </p>
            </div>
          </Grid.Column>

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
          <Grid.Column width={2}>
            <h4>Neighborhood</h4>
            <p>{user.neighborhood}</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Divider />
      <h2>Your Contributions</h2>
      <Contributions pitches={pitches} />
      <Grid columns={2} className="experience">
        <GridColumn>
          <h4>How and why user wants to get involved</h4>
          <p>{user.involvementResponse}</p>
        </GridColumn>
        <GridColumn>
          <h4>User's past experience</h4>
          <p>{user.journalismResponse}</p>
        </GridColumn>
      </Grid>
      <div>
        <h2 className="feedback-header">Feedback on You</h2>
        {/* TODO: fix once rating is added to model */}
        <Container className="feedback-container">
          <Grid>
            <GridColumn width={5}>
              <h4>Jason Schumer left feedback</h4>
              <p>11/2/2021</p>
            </GridColumn>
            <GridColumn width={10}>
              <Rating size="huge" icon="star" defaultRating={3} maxRating={5} />
              <p>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
                commodo ligula eget dolor. Aenean massa strong. Cum sociis
                natoque penatibus et magnis dis parturient montes, nascetur
                ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu,
                pretium quis, sem. Nulla consequat massa quis enim. Donec pede
                justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim
                justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam
                dictum felis eu pede link mollis pretium. Integer tincidunt.
                Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate
                eleifend tellus. Aenean leo ligula, porttitor eu, consequat
                vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in,
                viverra quis, feugiat a, tellus. Phasellus viverra nulla ut
                metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam
                ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
              </p>
            </GridColumn>
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default Profile;
