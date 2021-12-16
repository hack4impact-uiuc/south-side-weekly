import { Router } from 'express';

import { errorWrap } from '../middleware';
import { ConstantsController } from '../controllers';
import { requireRegistered } from '../middleware/auth';

const router = Router();

router.get('/', requireRegistered, errorWrap(ConstantsController.getConstants));

export default router;
