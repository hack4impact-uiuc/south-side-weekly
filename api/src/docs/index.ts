import { config } from './config';
import { models } from './models';
import { servers } from './servers';
import { tags } from './tags';
import { userPaths } from './users';

const docs = {
  ...config,
  ...servers,
  ...models,
  ...tags,
  ...userPaths,
};

export { docs };
