import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import passport from 'passport';
import { ParsedQs } from 'qs';
import { sessionizeUser } from '../utils/helpers';
import { errorWrap } from '../middleware';

const CALLBACK_ROUTE = '/api/auth/google/callback';

interface IQuery {
  state: any;
}

interface IState {
  callbackUrl: string;
  successRedirect: string | ParsedQs | string[] | ParsedQs[];
  failureRedirect: string | ParsedQs | string[] | ParsedQs[];
}

router.get(
  '/currentuser',
  errorWrap(async (req: Request, res: Response) => {
    if (req.user) {
      res.status(200).json({
        message: `Logged in.`,
        success: true,
        result: sessionizeUser(req.user),
      });
    } else {
      res.status(401).json({
        message: `Not authenticated.`,
        success: false,
      });
    }
  }),
);

router.get(
  '/loggedin',
  errorWrap(async (req: Request, res: Response) => {
    if (req.isAuthenticated) {
      res.status(200).json({
        message: `Logged in.`,
        success: true,
      });
    } else {
      res.status(401).json({
        message: `Not authenticated.`,
        success: false,
      });
    }
  }),
);

router.get('/login', (req: Request, res: Response, next: NextFunction) => {
  const { successRedirect = '/', failureRedirect = '/login' } = req.query;

  const callbackUrl = `${req.protocol}://${req.get('host')}${CALLBACK_ROUTE}`;

  const state: IState = {
    callbackUrl,
    successRedirect,
    failureRedirect,
  };

  const auth = passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: Buffer.from(JSON.stringify(state)).toString('base64'),
  });
  auth(req, res, next);
});

router.get(
  '/google/callback',
  (
    req: Request<unknown, unknown, unknown, IQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    const { state } = req.query;
    const { successRedirect, failureRedirect } = JSON.parse(
      Buffer.from(state, 'base64').toString(),
    );

    const auth = passport.authenticate('google', {
      successRedirect,
      failureRedirect,
    });
    auth(req, res, next);
  },
);

router.post(
  '/logout',
  errorWrap(async (req: Request, res: Response) => {
    if (req.session) {
      req.session = null;
      req.logout();
      res.status(200).json({
        message: `Logged out.`,
        success: true,
      });
    } else {
      res.status(403).json({
        message: `Not logged in.`,
        success: false,
      });
    }
  }),
);

export default router;
