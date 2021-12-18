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
  schema?: Schema;
}

interface PathBuilder {
  method: HTTP_METHOD;
  model: Models;
  opId: string;
  description: string;
  params?: Pick<Parameter, 'name' | 'description'>[];
  body?: BodyBuilder;
  ignoreRespones?: string[];
  responses?: ResponseBuilder[];
}

export const buildPath = (config: PathBuilder): PathItem => {
  const {
    method,
    model,
    opId,
    description,
    params = [],
    body = {},
    ignoreRespones = [],
    responses = [],
  } = config;

  const baseResponses = [
    { code: '200', description: 'Success', model: model },
    { code: '400', description: 'Bad Request' },
    { code: '401', description: 'Unauthorized' },
    { code: '404', description: 'Not Found' },
    { code: '500', description: 'Internal Server Error' },
  ];
  const unIgnoredResponses = baseResponses.filter(
    (res) => !ignoreRespones.includes(res.code),
  );

  const allResponses = [...unIgnoredResponses, ...(responses || [])];

  const path: PathItem = {
    [method.toLowerCase()]: {
      tags: [model],
      description: description,
      operationId: opId,
      parameters: params.map(buildParameter),
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
  const { code, description, model, schema } = response;

  const res = {
    [code]: {
      description,
      content: (model || schema) && {
        'application/json': {
          schema: model
            ? {
                $ref: extractRefPath(model),
              }
            : schema,
        },
      },
    },
  };

  return res;
};
