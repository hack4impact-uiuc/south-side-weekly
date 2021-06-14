import React, { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IUser } from 'ssw-common';
import { Button, Container, Divider, Grid, Image } from 'semantic-ui-react';

import { isError, loadUser } from '../../utils/apiWrapper';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { pages } from '../../utils/enums';

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
  dateJoined: new Date(),
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

  const { userId } = useParams<ParamTypes>();
  const [user, setUser] = useState<IUser>(emptyUser);
  const [isEditMode, setIsEditMode] = useState(false);
  // const [permissions, setPermissions] = useState();

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

  const isISODate = (value: string): boolean => {
    try {
      Date.parse(value);
      return true;
    } catch (err) {
      return false;
    }
  };

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

  return (
    <>
      <Sidebar currentPage={pages.PROFILE} />
      <Header />
      <div style={{ marginLeft: '15%', marginTop: '5%' }}>
        <Grid>
          <Grid.Row columns={4}>
            <Grid.Column>
              <Button onClick={() => setIsEditMode(true)}>Edit</Button>
              <Image size="small" circular src={user.profilePic} />
            </Grid.Column>

            <Grid.Column width={5}>
              <h2>Basic information</h2>
              <Container style={{ marginBottom: '5px' }}>
                {basicInfoFields.map((field, index) => {
                  if (Array.isArray(user[field])) {
                    return (
                      <BasicInfoInput
                        key={index}
                        label={field}
                        value={(user[field] as string[]).join(',')}
                        isEditMode={isEditMode}
                        updateUserField={updateUserField}
                      />
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
              <h2>My interests</h2>
            </Grid.Column>
            <Grid.Column textAlign="center" width={3}>
              <h2>My Roles</h2>
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
