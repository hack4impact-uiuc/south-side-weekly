import createError from 'http-errors';
import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import apiRoutes from './api';
import { errorHandler } from './middleware';

const app = express();

app.use(helmet());
app.use(cors());

app.use(logger('dev'));

app.use(express.json({ limit: '2.1mb' }));
app.use(express.urlencoded({ limit: '2.1mb', extended: false }));

// Mongo setup
require('./utils/mongo-setup');

// Routes
app.use('/api', apiRoutes);
app.get('/', (req: Request, res: Response) => res.json('API working!'));
app.get('/favicon.ico', (req: Request, res: Response) => res.status(204));

app.use(function (req: Request, res: Response, next) {
  next(createError(404));
});

app.use(errorHandler);

module.exports = app;
