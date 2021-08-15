import cron from 'node-cron';

import User from '../models/user';
import { onboardingStatusEnum } from '../utils/enums';

// One short to account for stalled accounts for that day
const TWO_WEEKS_AGO = 13;

// Runs script once a day at 12:00 am
const ONCE_A_DAY_CRONJOB_EXPRESSION = '0 0 * * *';

// Runs once a day every day at 12:00am in Chicago time
const task = cron.schedule(
  ONCE_A_DAY_CRONJOB_EXPRESSION,
  () => {
    const twoWeeksAgoDate = new Date();
    twoWeeksAgoDate.setDate(twoWeeksAgoDate.getDate() - TWO_WEEKS_AGO);

    // Find all users that were created more than two weeks ago and have a scheduled onboarding
    // and update these onboarding statuses to 'STALLED'
    const updateStatuses = async (): Promise<void> => {
      await User.updateMany(
        {
          dateJoined: { $lt: twoWeeksAgoDate },
          onboardingStatus: onboardingStatusEnum.ONBOARDING_SCHEDULED,
        },
        {
          $set: {
            onboardingStatus: onboardingStatusEnum.STALLED,
          },
        },
      );
    };

    updateStatuses();
  },
  {
    scheduled: true,
    timezone: 'America/Chicago',
  },
);

task.start();
