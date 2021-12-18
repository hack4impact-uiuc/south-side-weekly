import { config } from './config';
import { interestPaths } from './interests';
import { components } from './components';
import { servers } from './servers';
import { tags } from './tags';
import { teamPaths } from './teams';
import { userPaths } from './users';

const paths = {
  paths: {
    ...userPaths,
    ...teamPaths,
    ...interestPaths,
  },
};

const docs = {
  ...config,
  ...servers,
  ...components,
  ...tags,
  ...paths,
};

export { docs };
