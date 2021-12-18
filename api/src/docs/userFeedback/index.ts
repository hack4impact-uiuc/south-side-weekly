import {
  getUserFeedbackById,
  getUserFeedbacks,
  getFeedbackForUser,
} from './get';
import { createUserFeedback } from './post';
import { updateUserFeedback } from './put';
import { deleteUserFeedback } from './delete';

export const userFeedbackPaths = {
  '/userFeedback': {
    ...getUserFeedbacks,
  },
  '/userFeedback/:id': {
    ...getUserFeedbackById,
    ...createUserFeedback,
    ...updateUserFeedback,
    ...deleteUserFeedback,
  },
  '/userFeedback/user/:id': {
    ...getFeedbackForUser,
  },
};
