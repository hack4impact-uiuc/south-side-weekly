import express, { Request, Response } from 'express'; 

import User from '../models/user';

const validateRequestForRole = (req: Request, role: String) => {
    if (!req.isAuthenticated()) {
      return false;
    }
    if (!req.user) {
      return false;
    }
    return req.user.role === role;
  };
  
  module.exports = { validateRequestForRole };

