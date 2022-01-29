import { Router } from 'express';

import { NotificationController } from '../controllers';
import { errorWrap } from '../middleware';
import { requireStaff } from '../middleware/auth';

const router = Router();

router.post(
  '/sendUserApproved',
  requireStaff,
  errorWrap(NotificationController.sendUserApprovedNotification),
);

router.post(
  '/sendUserRejected',
  requireStaff,
  errorWrap(NotificationController.sendUserRejectedNotification),
);

router.post(
  '/sendClaimRequestApproved',
  requireStaff,
  errorWrap(NotificationController.sendClaimRequestApprovedNotification),
);

router.post(
  '/sendClaimRequestDeclined',
  requireStaff,
  errorWrap(NotificationController.sendClaimRequestDeclinedNotification),
);

router.post(
  '/sendPitchApproved',
  requireStaff,
  errorWrap(NotificationController.sendPitchApprovedNotification),
);

router.post(
  '/sendPitchDeclined',
  requireStaff,
  errorWrap(NotificationController.sendPitchDeclinedNotification),
);

router.post(
  '/sendContributorAdded',
  requireStaff,
  errorWrap(NotificationController.sendContributorAddedNotification),
);

export default router;
