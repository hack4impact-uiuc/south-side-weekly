import { Router } from 'express';

import userRoutes from './user';
import teamRoutes from './team';
import interestRoutes from './interest';
import authRoutes from './auth';
import resourceRoutes from './resource';
import issueRoutes from './issue';
import userFeedbackRoutes from './userFeedback';
import pitchFeedbackRoutes from './pitchFeedback';
import pitchRoutes from './pitch';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/pitches', pitchRoutes);
router.use('/resources', resourceRoutes);
router.use('/issues', issueRoutes);
router.use('/teams', teamRoutes);
router.use('/interests', interestRoutes);
router.use('/userFeedback', userFeedbackRoutes);
router.use('/pitchFeedback', pitchFeedbackRoutes);

export default router;
