import { Schema } from 'swagger-jsdoc';

export const EXAMPLE_MONGO_ID = '61bc193cc8ab66161a9d1a82';

export const buildSchema = (
  body: Record<string, unknown>,
  required: string[],
): Schema => ({
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      description: 'The auto-generated MongoDB id of the model.',
      exampe: EXAMPLE_MONGO_ID,
    },
    ...body,
  },
  required,
});
