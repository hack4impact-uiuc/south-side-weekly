import express from 'express';
import users from './users';
import pitch from './pitch';
import auth from './auth';

const router = express.Router();

router.use('/users', users);
router.use('/pitch', pitch);
router.use('/auth', auth);

export default router;
