import express from 'express';
import users from './users';
import pitch from './pitch';

const router = express.Router();

router.use('/users', users);
router.use('/pitch', pitch);

export default router;
