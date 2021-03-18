import { Request } from 'express';

const validateRequestForRole = (req: Request, role: string): boolean => {
  if (!req.isAuthenticated()) {
    return false;
  }
  if (!req.user) {
    return false;
  }
  return req.user.role === role;
};

export default validateRequestForRole;
