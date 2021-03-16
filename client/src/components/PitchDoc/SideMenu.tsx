import React, { ReactElement } from 'react';
import { Menu, Icon, Image } from 'semantic-ui-react';

import PitchIcon from '../../assets/pitch-icon.svg';
import ResourceIcon from '../../assets/resource-icon.svg';

// Temporary profile pic of Mustafa
const profilePicPath =
  'https://ca.slack-edge.com/T6VL1BSEA-U01M1TTQ1TQ-09478f1b309f-512';

function SideMenu(): ReactElement {
  return (
    <div>
      <Menu icon="labeled" vertical>
        <Menu.Item name="profile picture">
          <Image src={profilePicPath} size="tiny" circular />
        </Menu.Item>

        <Menu.Item name="home">
          <Icon name="home" />
        </Menu.Item>

        <Menu.Item name="user">
          <Icon name="user" />
        </Menu.Item>

        <Menu.Item name="pitches">
          <img src={PitchIcon} alt="Pitch Icon" />
        </Menu.Item>

        <Menu.Item name="resources">
          <img src={ResourceIcon} alt="Pitch Icon" />
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default SideMenu;
