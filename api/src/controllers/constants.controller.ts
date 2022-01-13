import { Request, Response } from 'express';

import * as SSW_CONSTANTS from '../utils/enums';
import { sendSuccess } from '../utils/helpers';

export const getConstants = async (
  req: Request,
  res: Response,
): Promise<void> => {
  sendSuccess(res, 'Constants', SSW_CONSTANTS);
};
