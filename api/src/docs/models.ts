import { interestSchema } from './schemas/interest';
import { resourceSchema } from './schemas/resource';
import { teamSchema } from './schemas/team';
import { userSchema } from './schemas/user';

export const models = {
  components: {
    schemas: {
      User: userSchema,
      Pitch: {},
      Team: teamSchema,
      Interest: interestSchema,
      Issue: {},
      Resource: resourceSchema,
      PitchFeedback: {},
      UserFeedback: {},
    },
  },
};
