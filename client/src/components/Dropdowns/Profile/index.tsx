import React, { FC, ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { IUser } from 'ssw-common';

import { useAuth } from '../../../contexts';
import { classNames } from '../../../utils/helpers';
import ApprovedView from '../../Auth/ApprovedView';
import UserPicture from '../../UserPicture';

interface TriggerProps {
  user: IUser;
}

const Trigger: FC<TriggerProps> = ({ user }): ReactElement => (
  <>
    <div className="welcome-text">
      {`Welcome, ${user.preferredName || user.firstName}`}
    </div>
    <UserPicture user={user} />
  </>
);

const ProfileDropdown: FC<DropdownProps> = ({ ...rest }): ReactElement => {
  const { user, logout } = useAuth();
  const history = useHistory();

  const handleClick = (value: string): void => {
    if (value === 'profile') {
      history.push(`/profile/${user._id}`);
    } else if (value === 'logout') {
      logout();
    }
  };

  return (
    <Dropdown
      simple
      className={classNames('profile-dropdown', rest.className)}
      closeOnChange
      item
      trigger={<Trigger user={user} />}
      {...rest}
    >
      <Dropdown.Menu>
        <ApprovedView>
          <Dropdown.Item
            value="profile"
            text="View Profile"
            icon="address card"
            onClick={(e, { value }) => handleClick(value as string)}
          />
        </ApprovedView>
        <Dropdown.Item
          value="logout"
          text="Logout"
          icon="power"
          onClick={(e, { value }) => handleClick(value as string)}
        />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;
