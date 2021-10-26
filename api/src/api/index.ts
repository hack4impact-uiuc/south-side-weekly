import express from 'express';
import users from './users';
import pitch from './pitch';
import auth from './auth';
import resources from './resources';
import interests from './interest';

const router = express.Router();

router.use('/users', users);
router.use('/pitch', pitch);
router.use('/auth', auth);
router.use('/resources', resources);
router.use('/interest', interests);

export default router;
