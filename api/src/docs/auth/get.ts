import { userBody } from '../schemas/user';
import { buildPath } from '../utils';

export const getCurrentUser = buildPath({
  method: 'GET',
  model: 'Auth',
  opId: 'getCurrentUser',
  description: 'Gets the current user',
  responses: [
    {
      code: '200',
      description: 'Success',
      schema: {
        type: 'object',
        properties: {
          ...userBody,
        },
      },
    },
  ],
  ignoreRespones: ['200', '401', '500'],
});

export const getLoggedIn = buildPath({
  method: 'GET',
  model: 'Auth',
  opId: 'getLoggedIn',
  description: 'Gets whether the user is logged in',
  responses: [
    {
      code: '200',
      description: 'Success',
      schema: null,
    },
  ],
});

export const login = buildPath({
  method: 'GET',
  model: 'Auth',
  opId: 'getLogin',
  description: 'Logs in a user. Sets the cookies with passport.',
  responses: [
    {
      code: '200',
      description: 'Success',
      schema: null,
    },
  ],

  ignoreRespones: ['401', '404', '400'],
});

export const redirectURI = buildPath({
  method: 'GET',
  model: 'Auth',
  opId: 'redirectURI',
  description:
    'Redirects the user to the URI they were trying to access and sets the cookies on that endpoint.',
  responses: [
    {
      code: '200',
      description: 'Success',
      schema: null,
    },
  ],

  ignoreRespones: ['401', '404', '400'],
});

export const receiveGoogleCallback = buildPath({
  method: 'GET',
  model: 'Auth',
  opId: 'receiveGoogleCallback',
  description: 'Receives the callback from Google and logs the user in.',
  responses: [
    {
      code: '200',
      description: 'Success',
      schema: null,
    },
  ],
  ignoreRespones: ['401', '404', '400'],
});

export const logout = buildPath({
  method: 'GET',
  model: 'Auth',
  opId: 'logout',
  description: 'Logs the user out.',
  responses: [
    {
      code: '200',
      description: 'Success',
      schema: null,
    },
  ],
  ignoreRespones: ['401', '404', '400'],
});
