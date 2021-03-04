import express from 'express';
import users from './users';
import auth from './auth';
import { requireContributorStatus } from '../auth/authmiddleware';

const router = express.Router();

router.use('/users', requireContributorStatus, users);
router.use('/auth', auth);

export default router;
