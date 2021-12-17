import {
  PathItem,
  Parameter,
  Responses,
  RequestBody,
  Schema,
} from 'swagger-jsdoc';
import { Models } from '../populators/types';

export type HTTP_METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE';
export interface ResponseBuilder {
  code: string;
  description: string;
  model?: Models;
}

export const buildPath = (
  method: HTTP_METHOD,
  model: Models,
  opId: string,
  pathDescription: string,
  paramDescriptions: Pick<Parameter, 'name' | 'description'>[] = [],
  body: BodyBuilder = {},
  unusedRespones: string[] = [],
  responses?: ResponseBuilder[],
): PathItem => {
  const baseResponses = [
    { code: '200', description: 'Success', model: model },
    { code: '400', description: 'Bad Request' },
    { code: '401', description: 'Unauthorized' },
    { code: '404', description: 'Not Found' },
    { code: '500', description: 'Internal Server Error' },
  ].filter((res) => !unusedRespones.includes(res.code));

  const allResponses = [...baseResponses, ...(responses || [])];

  const path: PathItem = {
    [method.toLowerCase()]: {
      tags: [model],
      description: pathDescription,
      operationId: opId,
      parameters: paramDescriptions.map(buildParameter),
      requestBody: buildRequestBody(body),
      // reduce an array of responses into an object with each code as a key
      responses: allResponses.reduce(
        (acc, response) => ({
          ...acc,
          ...buildResponse(response),
        }),
        {},
      ),
    },
  };

  return path;
};

interface BodyBuilder {
  description?: string;
  schema?: Schema;
}

export const buildRequestBody = (body: BodyBuilder): RequestBody => {
  if (!body.description && !body.schema) {
    return undefined;
  }

  return {
    description: body.description ?? '',
    content: {
      'application/json': {
        schema: body.schema ?? {},
      },
    },
  };
};

export const buildParameter = (param: Parameter): Parameter => {
  const { name, description } = param;

  return {
    name,
    in: 'path',
    description,
    required: true,
  };
};

export const extractRefPath = (model: Models): string =>
  `#/components/schemas/${model}`;

export const buildResponse = (response: ResponseBuilder): Responses => {
  const { code, description, model } = response;

  const res = {
    [code]: {
      description,
      content: model && {
        'application/json': {
          schema: {
            $ref: extractRefPath(model),
          },
        },
      },
    },
  };

  return res;
};
