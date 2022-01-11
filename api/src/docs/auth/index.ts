import {
  login,
  logout,
  getCurrentUser,
  getLoggedIn,
  receiveGoogleCallback,
  redirectURI,
} from './get';

export const authPaths = {
  '/auth/login': {
    ...login,
  },
  '/auth/currentUser': {
    ...getCurrentUser,
  },
  '/auth/loggedin': {
    ...getLoggedIn,
  },
  '/auth/google/callback': {
    ...receiveGoogleCallback,
  },
  '/auth/logout': {
    ...logout,
  },
  '/auth/redirectURI': {
    ...redirectURI,
  },
};
