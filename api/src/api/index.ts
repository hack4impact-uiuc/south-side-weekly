import express from 'express';
import users from './users';
import pitch from './pitch';
import resources from './resources';

const router = express.Router();

router.use('/users', users);
router.use('/pitch', pitch);
router.use('/resources', resources);

export default router;
