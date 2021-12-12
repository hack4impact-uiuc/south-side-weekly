import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { ParsedQs } from 'qs';

import { sendFail, sendSuccess, sendUnauthorized } from '../utils/helpers';

const CALLBACK_ROUTE = '/api/auth/google/callback';
const LOGIN_SUCCESS_REDIRECT = process.env.FE_URI ? process.env.FE_URI : '/';

interface IQuery {
  state?: any;
}

export const getCurrentUser = (req: Request, res: Response): Promise<void> => {
  if (req.user) {
    sendSuccess(res, 'Logged in.', req.user);
    return;
  }

  sendUnauthorized(res);
};

export const getLoginStatus = (req: Request, res: Response): Promise<void> => {
  if (req.isAuthenticated) {
    sendSuccess(res, 'Logged in.');
    return;
  }
  sendUnauthorized(res);
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { failureRedirect = '/login' } = req.query;

  const callbackUrl = `${req.protocol}://${req.get('host')}${CALLBACK_ROUTE}`;

  interface IState {
    callbackUrl: string;
    successRedirect: string | ParsedQs | string[] | ParsedQs[];
    failureRedirect: string | ParsedQs | string[] | ParsedQs[];
  }

  const state: IState = {
    callbackUrl,
    successRedirect: LOGIN_SUCCESS_REDIRECT,
    failureRedirect,
  };

  const auth = passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: Buffer.from(JSON.stringify(state)).toString('base64'),
  });

  auth(req, res, next);
};

type RedirectURIReq = Request<unknown, unknown, unknown, IQuery>;

export const redirectURI = async (
  req: RedirectURIReq,
  res: Response,
): Promise<void> => {
  try {
    const { state } = req.query;
    const { callbackUrl } = JSON.parse(Buffer.from(state, 'base64').toString());

    if (typeof callbackUrl === 'string') {
      // Reconstruct the URL and redirect
      res.redirect(`${callbackUrl}?${req._parsedUrl.query}`);
      return;
    }
    // There was no base
    res.redirect(CALLBACK_ROUTE);
  } catch (e) {
    sendFail(res, 'There was an issue redirecting');
  }
};

type GoogleCallbackReq = RedirectURIReq;

export const receiveGoogleCallback = async (
  req: GoogleCallbackReq,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { state } = req.query;
  const { successRedirect, failureRedirect } = JSON.parse(
    Buffer.from(state, 'base64').toString(),
  );

  const auth = passport.authenticate('google', {
    successRedirect,
    failureRedirect,
  });

  auth(req, res, next);
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  if (req.session) {
    req.session = null;
    req.logout();

    sendSuccess(res, 'Logged out.');
    return;
  }

  res.status(403).json({
    message: `Not logged in.`,
    success: false,
  });
};
