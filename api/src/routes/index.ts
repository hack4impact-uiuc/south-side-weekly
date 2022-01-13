import { Router } from 'express';

import userRoutes from './user.routes';
import teamRoutes from './team.routes';
import interestRoutes from './interest.routes';
import authRoutes from './auth.routes';
import resourceRoutes from './resource.routes';
import issueRoutes from './issue.routes';
import userFeedbackRoutes from './userFeedback.routes';
import pitchFeedbackRoutes from './pitchFeedback.routes';
import pitchRoutes from './pitch.routes';
import constantsRoutes from './constants.routes';
import docsRoutes from './docs.routes';

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
router.use('/constants', constantsRoutes);
router.use('/docs', docsRoutes);

export default router;
