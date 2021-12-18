import { config } from './config';
import { interestPaths } from './interests';
import { components } from './components';
import { servers } from './servers';
import { tags } from './tags';
import { teamPaths } from './teams';
import { userPaths } from './users';
import { pitchFeedbackPaths } from './pitchFeedback';
import { resourcePaths } from './resources';
import { userFeedbackPaths } from './userFeedback';
import { issuePaths } from './issues';
import { pitchPaths } from './pitches';
import { authPaths } from './auth';
import { constantsPaths } from './constants';

const paths = {
  paths: {
    ...userPaths,
    ...teamPaths,
    ...interestPaths,
    ...pitchFeedbackPaths,
    ...resourcePaths,
    ...userFeedbackPaths,
    ...issuePaths,
    ...pitchPaths,
    ...authPaths,
    ...constantsPaths,
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
