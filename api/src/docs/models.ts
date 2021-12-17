import { userSchema } from './schemas/user';

export const models = {
  components: {
    schemas: {
      User: userSchema,
      Pitch: {},
      Team: {},
      Interest: {},
      Issue: {},
      Resource: {},
      PitchFeedback: {},
      UserFeedback: {},
    },
  },
};
