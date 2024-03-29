import React, { FC, ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { User } from 'ssw-common';
import cn from 'classnames';
import toast from 'react-hot-toast';

import { useAuth } from '../../contexts';
import UserPicture from '../ui/UserPicture';
import { apiCall, isError } from '../../api';
import { AuthView } from '../wrapper/AuthView';

interface TriggerProps {
  user: Pick<User, 'fullname' | 'profilePic'>;
}

const Trigger: FC<TriggerProps> = ({ user }): ReactElement => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    {/* <div style={{ marginRight: 10 }}>
      <p>{`Welcome, ${user.fullname}`}</p>
    </div> */}
    <UserPicture user={user} />
  </div>
);

const logout = async (): Promise<void> => {
  const res = await apiCall({
    url: '/auth/logout',
    method: 'PUT',
  });

  if (!isError(res)) {
    window.location.reload();
  } else {
    toast.error('Error logging out');
  }
};

const ProfileSelect: FC<DropdownProps> = ({ ...rest }): ReactElement => {
  const { user } = useAuth();
  const history = useHistory();

  const handleClick = async (value: string): Promise<void> => {
    if (value === 'profile') {
      history.push(`/profile/${user!._id}`);
    } else if (value === 'logout') {
      await logout();
    }
  };

  return (
    <Dropdown
      {...rest}
      simple
      className={cn('profile-dropdown', rest.className)}
      closeOnChange
      item
      trigger={<Trigger user={user!} />}
    >
      <Dropdown.Menu>
        <AuthView view="isOnboarded">
          <Dropdown.Item
            value="profile"
            text="View Profile"
            icon="address card"
            onClick={(e, { value }) => handleClick(value as string)}
          />
        </AuthView>
        <Dropdown.Item
          value="logout"
          text="Logout"
          icon="log out"
          onClick={(e, { value }) => handleClick(value as string)}
        />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileSelect;
