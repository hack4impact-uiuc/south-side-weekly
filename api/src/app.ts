import createError from 'http-errors';
import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import cookieSession from 'cookie-session';
import passport from 'passport';
import apiRoutes from './api';
import { errorHandler } from './middleware';

const app = express();

app.use(helmet());
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: /localhost:\d{4}/, credentials: true }));
}

app.use(logger('dev'));

app.use(express.json({ limit: '2.1mb' }));
app.use(express.urlencoded({ limit: '2.1mb', extended: false }));

// Session support
const sessionConfig = {
  secure: false,
  keys: [process.env.SESS_SECRET],
};
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  sessionConfig.secure = true;
}
app.use(cookieSession(sessionConfig));

// Mongo setup
require('./setup/mongo-setup');

// Passport setup
require('./setup/passport-setup');
app.use(passport.initialize());
app.use(passport.session());

// Cron jobs
require('./cron/onboarding-status');

// Routes
app.use('/api', apiRoutes);
app.get('/', (req: Request, res: Response) => res.json('API working!'));
app.get('/ssw-favicon.ico', (req: Request, res: Response) => res.status(204));

app.use(function (req: Request, res: Response, next) {
  next(createError(404));
});

app.use(errorHandler);

module.exports = app;
