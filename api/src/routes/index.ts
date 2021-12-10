import { Router } from 'express';

import userRoutes from './userRoutes';
import teamRoutes from './teamRoutes';
import interestRoutes from './interestRoutes';
import authRoutes from './authRoutes';
import resourceRoutes from './resourceRoutes';
import issueRoutes from './issueRoutes';
import userFeedbackRoutes from './userFeedbackRoutes';
import pitchFeedbackRoutes from './pitchFeedbackRoutes';
import pitchRoutes from './pitchRoutes';

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
