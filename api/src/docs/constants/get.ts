import { buildPath } from '../utils';
import * as SSW_CONSTANTS from '../../utils/enums';

export const getConstants = buildPath({
  method: 'GET',
  model: 'Constants',
  opId: 'getConstants',
  description: 'Gets the constants',
  ignoreRespones: ['400', '404'],
  responses: [
    {
      code: '200',
      description: 'Success',
      schema: {
        type: 'object',
        properties: {
          ...SSW_CONSTANTS,
        },
      },
    },
  ],
});
