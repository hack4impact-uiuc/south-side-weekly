import express from 'express';
import users from './users';
import auth from './auth';
import { requireContributorStatus, requireStaffStatus, requireAdminStatus } from '../auth/authmiddleware';

const router = express.Router();

router.use('/users', requireStaffStatus, users);
router.use('/auth', auth);

export default router;
