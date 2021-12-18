import { interestSchema } from './schemas/interest';
import { issueSchema } from './schemas/issue';
import { pitchSchema } from './schemas/pitch';
import { pitchFeedbackSchema } from './schemas/pitchFeedback';
import { resourceSchema } from './schemas/resource';
import { teamSchema } from './schemas/team';
import { userSchema } from './schemas/user';
import { userFeedbackSchema } from './schemas/userFeedback';

export const components = {
  components: {
    schemas: {
      User: userSchema,
      Pitch: pitchSchema,
      Team: teamSchema,
      Interest: interestSchema,
      Issue: issueSchema,
      Resource: resourceSchema,
      PitchFeedback: pitchFeedbackSchema,
      UserFeedback: userFeedbackSchema,
    },
  },
};
